#!/usr/bin/env node

import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { pdfService } from '../src/services/pdfService.js';
import { AIQuizService } from '../src/services/aiService.js';
import { createEleaService } from '../src/services/eleaService.js';

/**
 * Processeur de fichiers PDF en lot
 * Traite plusieurs fichiers PDF simultanément
 */

export interface BatchOptions {
  outputDir: string;
  configPath: string;
  parallel: number;
  deploy: boolean;
  verbose: boolean;
}

export interface BatchResult {
  total: number;
  success: number;
  errors: string[];
}

/**
 * Traite un dossier de fichiers PDF en lot
 */
export async function processBatch(inputDir: string, options: BatchOptions): Promise<BatchResult> {
  const result: BatchResult = {
    total: 0,
    success: 0,
    errors: []
  };

  try {
    // Recherche des fichiers PDF
    const pdfFiles = await findPDFFiles(inputDir);
    result.total = pdfFiles.length;

    if (pdfFiles.length === 0) {
      console.log('ℹ️  Aucun fichier PDF trouvé');
      return result;
    }

    console.log(`📁 ${pdfFiles.length} fichiers PDF trouvés`);

    // Traitement par lot avec limite de parallélisme
    const batches = createBatches(pdfFiles, options.parallel);
    
    for (const batch of batches) {
      const promises = batch.map(file => 
        processFile(file, options)
          .then(() => {
            result.success++;
            if (options.verbose) {
              console.log(`✅ ${file} traité avec succès`);
            }
          })
          .catch(error => {
            result.errors.push(`${file}: ${error.message}`);
            if (options.verbose) {
              console.error(`❌ ${file}: ${error.message}`);
            }
          })
      );

      await Promise.all(promises);
    }

    return result;

  } catch (error) {
    result.errors.push(`Erreur générale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return result;
  }
}

/**
 * Trouve tous les fichiers PDF dans un dossier
 */
async function findPDFFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recherche récursive
        const subFiles = await findPDFFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        files.push(fullPath);
      }
    }
    
    return files;
  } catch (error) {
    throw new Error(`Erreur lors de la recherche de fichiers: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Crée des lots de fichiers pour le traitement parallèle
 */
function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Traite un fichier PDF individuel
 */
async function processFile(filePath: string, options: BatchOptions): Promise<void> {
  try {
    // Validation du fichier
    if (!await pdfService.validatePDF(filePath)) {
      throw new Error('Fichier PDF invalide');
    }

    // Chargement de la configuration
    const config = await loadConfig(options.configPath);
    
    // Analyse du PDF
    const analysis = await pdfService.analyzePDF(filePath);
    
    // Génération du quiz
    const aiService = new AIQuizService(config.ai);
    const quiz = await aiService.generateQuiz(analysis, {
      type: 'mixed',
      count: 10,
      level: 'intermediate',
      style: 'academic',
      language: 'fr',
      includeExplanations: true,
      difficultyDistribution: {
        easy: 30,
        medium: 50,
        hard: 20
      }
    });

    // Sauvegarde
    const outputPath = join(options.outputDir, `${quiz.id}.json`);
    await saveQuiz(quiz, outputPath);

    // Déploiement si demandé
    if (options.deploy) {
      const eleaService = createEleaService(config.elea);
      const eleaQuiz = await eleaService.convertQuizToElea(quiz);
      await eleaService.deployToElea(eleaQuiz);
    }

  } catch (error) {
    throw new Error(`Erreur lors du traitement de ${filePath}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Charge la configuration
 */
async function loadConfig(configPath: string): Promise<any> {
  const { readFile } = await import('fs/promises');
  const configContent = await readFile(configPath, 'utf8');
  return JSON.parse(configContent);
}

/**
 * Sauvegarde un quiz
 */
async function saveQuiz(quiz: any, outputPath: string): Promise<void> {
  const { writeFile } = await import('fs/promises');
  await writeFile(outputPath, JSON.stringify(quiz, null, 2));
}

/**
 * Traitement avec Worker Thread (pour de très gros volumes)
 */
export async function processWithWorker(filePath: string, options: BatchOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      workerData: { filePath, options }
    });

    worker.on('message', (result) => {
      if (result.success) {
        resolve();
      } else {
        reject(new Error(result.error));
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

/**
 * Surveillance des performances
 */
export class BatchMonitor {
  private startTime: number = 0;
  private processedFiles: number = 0;
  private totalFiles: number = 0;

  start(total: number): void {
    this.startTime = Date.now();
    this.totalFiles = total;
    this.processedFiles = 0;
  }

  update(): void {
    this.processedFiles++;
    const elapsed = Date.now() - this.startTime;
    const rate = this.processedFiles / (elapsed / 1000);
    const eta = (this.totalFiles - this.processedFiles) / rate;

    console.log(
      `📊 Progrès: ${this.processedFiles}/${this.totalFiles} ` +
      `(${(this.processedFiles / this.totalFiles * 100).toFixed(1)}%) ` +
      `| Vitesse: ${rate.toFixed(2)}/s ` +
      `| ETA: ${Math.round(eta)}s`
    );
  }

  end(): void {
    const elapsed = Date.now() - this.startTime;
    const rate = this.processedFiles / (elapsed / 1000);
    
    console.log(`✅ Traitement terminé en ${Math.round(elapsed / 1000)}s`);
    console.log(`📊 Vitesse moyenne: ${rate.toFixed(2)} fichiers/s`);
  }
}
