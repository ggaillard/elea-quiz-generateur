# Template CSV pour l'import de questions

Ce fichier contient un exemple de format CSV pour importer des questions dans le générateur de quiz.

## Format des colonnes

- **Type**: Type de question (mcq, truefalse, shortanswer, matching)
- **Titre**: Titre de la question
- **Question**: Texte de la question
- **Note**: Note par défaut pour la question (ex: 1)
- **Pénalité**: Pénalité en cas d'erreur (ex: 0)
- **Feedback général**: Feedback affiché après la réponse
- **Tags**: Tags séparés par des virgules
- **Réponse 1-5**: Texte des réponses possibles
- **Fraction 1-5**: Pourcentage de points pour chaque réponse (0-100)
- **Feedback 1-5**: Feedback spécifique pour chaque réponse
- **Options spéciales**: Options additionnelles (format clé=valeur;clé2=valeur2)

## Types de questions supportés

### QCM (mcq)
- Utilisez les colonnes Réponse 1-5 pour les options
- Fraction: 100 pour la bonne réponse, 0 pour les mauvaises

### Vrai/Faux (truefalse)
- Réponse 1: "Vrai", Réponse 2: "Faux"
- Fraction 1: 100 si vrai est correct, 0 sinon
- Fraction 2: 0 si vrai est correct, 100 sinon

### Réponse courte (shortanswer)
- Utilisez les colonnes Réponse 1-5 pour les réponses acceptées
- Fraction: généralement 100 pour toutes les bonnes réponses

### Appariement (matching)
- Format: "Question:Réponse" dans chaque colonne Réponse
- Fraction: toujours 100 pour les appariements

## Exemple de contenu

Voir le fichier `template_questions.csv` pour un exemple pratique.
