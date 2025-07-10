// Configuration pour les tests
import { beforeAll, afterAll, afterEach } from 'vitest';

// Configuration globale pour tous les tests
beforeAll(() => {
  // Configuration initiale
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Nettoyage final
});

afterEach(() => {
  // Nettoyage après chaque test
});

// Mock des modules externes si nécessaire
global.fetch = global.fetch || (() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve('')
}));
