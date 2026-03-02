# 🌍 Student Globe-Trotter Pro 2026

> **Comparer les budgets Erasmus dans 350 villes sur 6 continents — en français, anglais et espagnol.**

🔗 **[→ Voir le site en ligne](https://student-globe-trotter.vercel.app)**

---

## ✨ Fonctionnalités

### 🏙️ 350 villes, 6 continents
Coûts de vie détaillés par catégorie : logement, courses, restaurants, vie nocturne, transport, santé, télécom, voyages.

### 💰 Calculateur de budget intelligent
- **3 modes** : Survival 🧟 / Standard ⚖️ / Golden 👑 avec multiplicateurs réalistes
- Calcul dynamique selon tes économies et revenus mensuels
- Barre de durée par ville (combien de mois tu peux te permettre)

### ⚔️ Battle Mode — comparer 3 villes simultanément
Sélectionne 3 villes et compare leurs coûts par catégorie sur un graphique en barres. Badge "✅ Moins cher" automatique.

### 🗺️ Carte interactive Mercator
Continents dessinés en SVG, points cliquables par ville, panel de détail au survol/clic, filtres par continent.

### 🛡️ Indice de sécurité
Score basé sur le **Numbeo Safety Index 2024**, avec popover explicatif au clic et code couleur (🛡️ sûr / ⚠️ moyen / 🔴 risqué).

### 🗣️ Niveau d'anglais
Basé sur l'**EF English Proficiency Index 2023**, affiché en barres de progression (1 à 5) par ville.

### 📝 Notes personnelles
Zone de texte libre par ville (appart trouvé, contacts, budget réel...) avec indicateur 📝 dans la liste.

### ⭐ Favoris
Étoiler des villes et les retrouver dans un panel dédié avec leurs coûts en temps réel.

### 🌐 Multilingue FR / EN / ES
Interface, noms de pays, noms de continents, catégories et fun facts traduits dans les 3 langues.

### ☀️ Mode clair / sombre
Toggle instantané, mémorisé pendant la session.

---

## 🛠️ Stack technique

| Technologie | Usage |
|---|---|
| **React 18** | Framework UI, hooks (useState, useMemo, useEffect, useCallback) |
| **Recharts** | Graphiques (PieChart, BarChart) |
| **SVG custom** | Carte Mercator dessinée à la main (800×400, 350 points) |
| **CSS-in-JS** | Styles inline dynamiques (dark/light mode, thèmes par continent) |

Aucune dépendance backend. Tout fonctionne côté client, 0 API externe appelée au runtime.

---

## 📊 Données

| Source | Usage |
|---|---|
| **Numbeo 2024** | Coûts de vie par ville (logement, restos, transport...) |
| **Numbeo Safety Index 2024** | Score de sécurité (0–100) par ville |
| **EF EPI 2023** | Niveau d'anglais par pays (1–5) |
| **Erasmus+ barèmes officiels** | Seuils de référence budgétaire (1 200 € / 1 500 €) |

> Les données sont indicatives et à titre comparatif.

---

## 🚀 Lancer le projet en local

```bash
# 1. Cloner le repo
git clone https://github.com/TON_USERNAME/erasmus-globe-trotter.git
cd erasmus-globe-trotter

# 2. Installer les dépendances
npm install

# 3. Lancer en dev
npm start
```

L'app s'ouvre sur `http://localhost:3000`.

```bash
# Builder pour la prod
npm run build
```

---

## 📁 Structure du projet

```
erasmus-globe-trotter/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        # Composant principal + toutes les données
│   ├── index.js       # Point d'entrée React
│   └── index.css      # Reset CSS global
├── package.json
├── vercel.json
└── README.md
```

---

## 🗺️ Roadmap / idées futures

- [ ] Persistance localStorage (favoris + notes entre sessions)
- [ ] Filtre par budget maximum (slider)
- [ ] Montant bourse Erasmus+ par pays intégré
- [ ] Partage de sélection via URL
- [ ] Données par semestre (S1 vs S2)

---

## 👤 Auteur

**Elio** — étudiant, passionné de dev et de voyages.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin)](https://linkedin.com/in/Elio-HammRisch)
[![GitHub](https://img.shields.io/badge/GitHub-black?style=flat&logo=github)](https://github.com/Elio-code)

---

*Made with ❤️ and a lot of ☕ — données indicatives, voir sources officielles pour planifier ton Erasmus.*
