# Spécifications du site CubeMaster

## 1. Objectif du site

CubeMaster est un site pédagogique en français autour des cubes de type Rubik's Cube.

Le site doit aider les débutants à :

- résoudre différents cubes étape par étape ;
- comprendre la composition des cubes ;
- apprendre à les nettoyer et les entretenir ;
- progresser avec des contenus simples, visuels et accessibles.

## 2. Cible

Le site s'adresse principalement à :

- des enfants ou adolescents qui débutent ;
- des parents qui cherchent une solution simple à suivre ;
- des débutants curieux ;
- des joueurs qui veulent entretenir ou comprendre leur cube.

## 3. Ton éditorial

Le ton doit être :

- clair ;
- pédagogique ;
- accessible ;
- dynamique ;
- rassurant pour les débutants.

Les contenus doivent expliquer les étapes simplement, sans vocabulaire trop technique au départ.

## 4. Direction artistique

Le design doit être moderne, géométrique et coloré, inspiré de l'univers du cube.

Principes visuels :

- blocs graphiques nets ;
- angles, grilles, cartes et formes cubiques ;
- contraste fort ;
- interface lisible sur mobile et desktop ;
- univers jeune, propre et pédagogique.

Le site ne doit pas utiliser la marque Rubik's comme élément central d'identité visuelle. Le vocabulaire peut rester descriptif : cube 3x3, cube de type Rubik's Cube, solution cube, etc.

## 5. Couleurs principales

| Usage | Couleur | Code hexadécimal |
|---|---:|---:|
| Noir principal | Noir | `#000000` |
| Bleu principal | Bleu | `#2f46b0` |
| Vert principal | Vert | `#2aae34` |

### Recommandation d'utilisation

- `#000000` : textes, header, contrastes forts.
- `#2f46b0` : éléments principaux, boutons, liens, sections importantes.
- `#2aae34` : accents visuels, badges, pictogrammes, états positifs.
- Prévoir un fond clair neutre pour garder une bonne lisibilité.

## 6. Typographie

Typographie principale : **Space Grotesk**.

Recommandation technique :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

CSS recommandé :

```css
body {
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## 7. Arborescence prévue

> Important : les URLs sont normalisées en minuscules pour un rendu plus propre et plus cohérent.  
> Exemple : `/solution/3X3-debutant` devient `/solution/3x3-debutant/`.

### Accueil

| Page | URL recommandée | URL source |
|---|---|---|
| Accueil | `/` | `https://cubemaster.fr/hp` |

### Solution

| Catégorie | Sous-catégorie | URL recommandée | URL source |
|---|---|---|---|
| Solution | 2x2 | `/solution/2x2/` | `https://cubemaster.fr/solution/2x2` |
| Solution | 3x3 débutant | `/solution/3x3-debutant/` | `https://cubemaster.fr/solution/3X3-debutant` |
| Solution | 4x4 | `/solution/4x4/` | `https://cubemaster.fr/solution/4X4` |
| Solution | 5x5 | `/solution/5x5/` | `https://cubemaster.fr/solution/5X5` |
| Solution | Pyramix | `/solution/pyramix/` | `https://cubemaster.fr/solution/pyramix` |
| Solution | Mégaminx | `/solution/megaminx/` | `https://cubemaster.fr/solution/megaminx` |
| Solution | Gear Cube | `/solution/gearcube/` | `https://cubemaster.fr/solution/gearcube` |

### Nettoyage

| Catégorie | Sous-catégorie | URL recommandée | URL source |
|---|---|---|---|
| Nettoyage | 2x2 | `/nettoyage/2x2/` | `https://cubemaster.fr/nettoyage/2x2` |
| Nettoyage | 3x3 | `/nettoyage/3x3/` | `https://cubemaster.fr/nettoyage/3X3` |
| Nettoyage | 4x4 | `/nettoyage/4x4/` | `https://cubemaster.fr/nettoyage/4X4` |
| Nettoyage | 5x5 | `/nettoyage/5x5/` | `https://cubemaster.fr/nettoyage/5X5` |
| Nettoyage | Pyramix | `/nettoyage/pyramix/` | `https://cubemaster.fr/nettoyage/pyramix` |
| Nettoyage | Mégaminx | `/nettoyage/megaminx/` | `https://cubemaster.fr/nettoyage/megaminx` |
| Nettoyage | Gear Cube | `/nettoyage/gearcube/` | `https://cubemaster.fr/nettoyage/gearcube` |

### Composition

| Catégorie | Sous-catégorie | URL recommandée | URL source |
|---|---|---|---|
| Composition | 2x2 | `/composition/2x2/` | `https://cubemaster.fr/composition/2x2` |
| Composition | 3x3 | `/composition/3x3/` | `https://cubemaster.fr/composition/3X3` |
| Composition | 4x4 | `/composition/4x4/` | `https://cubemaster.fr/composition/4X4` |
| Composition | 5x5 | `/composition/5x5/` | `https://cubemaster.fr/composition/5X5` |
| Composition | Pyramix | `/composition/pyramix/` | `https://cubemaster.fr/composition/pyramix` |
| Composition | Mégaminx | `/composition/megaminx/` | `https://cubemaster.fr/composition/megaminx` |
| Composition | Gear Cube | `/composition/gearcube/` | `https://cubemaster.fr/composition/gearcube` |

## 8. Navigation principale recommandée

Navigation de premier niveau :

- Accueil
- Solutions
- Nettoyage
- Composition

Navigation secondaire possible :

- 2x2
- 3x3
- 4x4
- 5x5
- Pyramix
- Mégaminx
- Gear Cube

## 9. Structure type d'une page

Chaque page peut suivre cette logique :

1. **Hero / slider**
   - titre clair ;
   - promesse de la page ;
   - visuel ou bloc graphique.

2. **Introduction**
   - explication simple du sujet ;
   - niveau de difficulté ;
   - ce que le visiteur va apprendre.

3. **Contenu principal**
   - étapes détaillées ;
   - explications courtes ;
   - blocs visuels ;
   - conseils pratiques.

4. **Photos**
   - visuels du cube ;
   - étapes de démontage, nettoyage ou résolution ;
   - schémas si nécessaire.

5. **Vidéo**
   - vidéo tutorielle intégrée si disponible ;
   - complément visuel à l'explication texte.

6. **FAQ courte**
   - questions fréquentes ;
   - réponses directes.

## 10. Contraintes techniques

Le site doit rester simple pour le lancement :

- site statique ;
- HTML, CSS et JavaScript simple ;
- pas de framework ;
- pas de build step ;
- compatible Netlify ;
- `index.html` à la racine du repo ;
- structure de fichiers claire ;
- code lisible et facile à reprendre.

Structure de départ recommandée :

```text
cubemaster/
├── README.md
├── index.html
├── style.css
└── specs-cubemaster.md
```

Structure évolutive possible :

```text
cubemaster/
├── README.md
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   └── icons/
├── solution/
│   ├── 2x2.html
│   ├── 3x3-debutant.html
│   ├── 4x4.html
│   ├── 5x5.html
│   ├── pyramix.html
│   ├── megaminx.html
│   └── gearcube.html
├── nettoyage/
│   ├── 2x2.html
│   ├── 3x3.html
│   ├── 4x4.html
│   ├── 5x5.html
│   ├── pyramix.html
│   ├── megaminx.html
│   └── gearcube.html
└── composition/
    ├── 2x2.html
    ├── 3x3.html
    ├── 4x4.html
    ├── 5x5.html
    ├── pyramix.html
    ├── megaminx.html
    └── gearcube.html
```

## 11. SEO

Chaque page doit prévoir :

- une balise `<title>` unique ;
- une meta description unique ;
- un seul H1 ;
- une structure H2/H3 claire ;
- une URL courte, descriptive et en minuscules ;
- un contenu utile et pédagogique ;
- des liens internes vers les pages proches.

### Exemples de title

- `Solution cube 3x3 débutant : méthode simple | CubeMaster`
- `Nettoyer un cube 3x3 : démontage et entretien | CubeMaster`
- `Composition d'un cube 3x3 : pièces et mécanisme | CubeMaster`

## 12. Standard pédagogique validé pour les résolutions

La section **Étape 1 - Faire la face blanche** de la page
`/solution/2x2/` est la référence visuelle et pédagogique à suivre pour les
prochaines étapes du 2x2 et pour les autres résolutions, notamment le 3x3.

### Structure d'une étape

- présenter un objectif court avant les schémas ;
- employer une grille de deux schémas par ligne sur ordinateur et une colonne sur mobile ;
- donner à chaque schéma un numéro, un titre d'action, une instruction courte, un visuel et une légende ;
- utiliser les flèches uniquement lorsqu'elles représentent réellement le passage au schéma suivant ;
- conserver des textes lisibles, sans débordement, avec des visuels proches des explications ;
- afficher clairement les retournements du cube, par exemple dans un repère `180°` dédié.

### Traitement des cubes et des couleurs

- représenter tous les cubes avec le même angle isométrique ;
- utiliser des carrés colorés séparés par des traits noirs bien visibles ;
- baisser l'intensité des carrés qui ne participent pas à l'action ;
- mettre en évidence le coin, la face ou la couche réellement manipulée ;
- encadrer en bleu l'emplacement d'arrivée lorsque celui-ci doit être repéré ;
- conserver les trois couleurs d'un même coin pendant tout son déplacement ;
- vérifier que chaque état représenté est physiquement possible et que les couleurs des côtés correspondent aux faces voisines ;
- vérifier la continuité entre le schéma de départ, l'algorithme, le résultat et un éventuel retournement du cube.

### Règles pédagogiques

- employer le mot **carré** plutôt que **sticker** dans les explications destinées aux débutants ;
- indiquer la position de la face de référence lorsqu'elle doit rester en dessous ou au-dessus ;
- écrire l'algorithme exact près de l'action à effectuer ;
- expliquer les lettres et le sens des mouvements avant la première résolution ;
- montrer les faces et les couches manipulées avec des flèches directionnelles explicites ;
- adapter les schémas au puzzle concerné : le modèle graphique est commun, mais les pièces, les algorithmes et les états doivent être vérifiés pour chaque résolution.

### Base 3D validée

- utiliser `cube-player.js` et la version locale de Three.js pour les animations ;
- construire le puzzle avec un groupe par pièce et faire tourner une couche autour de l'axe central du cube ;
- ne jamais déplacer verticalement une couche pendant un mouvement : seul son angle change ;
- conserver la même configuration entre le dernier schéma d'une étape, sa vidéo et le premier schéma de l'étape suivante ;
- employer des couleurs vives, des séparations noires et un contour bleu pour la pièce suivie ;
- faire apparaître le contour suivi en fondu au départ et le conserver sur l'état final lorsqu'il sert de repère ;
- ne pas lancer les vidéos automatiquement ; un seul bouton gère lecture, pause, reprise et relance ;
- garder le mouvement courant et la progression lisibles à proximité du cube ;
- présenter les faces cachées par un mouvement de caméra lorsque leur contrôle est utile, sans modifier l'état du cube ;
- afficher `R2` dans l'algorithme, mais l'animer comme deux mouvements `R` distincts séparés par une pause ;
- valider par le code l'état initial et l'état final de chaque animation avant de la réutiliser.

### Algorithmes 2x2 validés

**Étape 1 - Face blanche**

- garder la face blanche en dessous pendant le placement des quatre coins ;
- placer le coin à traiter au-dessus de son emplacement ;
- répéter `R U R' U'` jusqu'à ce que le coin soit orienté vers le bas ;
- si un coin est bloqué dans la face blanche, utiliser le même algorithme pour le sortir ;
- vérifier simultanément les couleurs latérales afin de former le premier rang des faces voisines ;
- retourner le cube à `180°` à la fin : blanc en haut, jaune en bas.

**Étape 2 - Face jaune**

- garder la face blanche en haut et la face jaune en bas ;
- placer le coin à orienter en bas, devant et à droite ;
- répéter `R U R' U'` jusqu'à ce que son carré jaune regarde vers le dessous ;
- tourner uniquement la face du bas avec `D'` pour amener le coin jaune suivant au même emplacement ;
- répéter l'opération pour les quatre coins, puis effectuer le dernier `D'` d'alignement ;
- retourner le cube à `180°` : jaune en haut, blanc en bas ;
- la séquence `[2, 4, 2, 4]` utilisée dans la vidéo est un cas démonstratif, pas une règle universelle du nombre de répétitions.

**Étape 3 - Dernier échange**

- garder la face jaune en haut et la face blanche en bas ;
- placer à gauche une face latérale déjà résolue ; le bleu n'est que la couleur de l'exemple ;
- exécuter entièrement `R U R' U' R' F R2 U' R' U' R U R' F'` ;
- ne pas interrompre l'algorithme avant le dernier `F'` ;
- le résultat attendu est un cube entièrement résolu.

**Cas particulier**

- uniquement lorsque la configuration correspond au cas montré, répéter `R U R' U'` jusqu'à l'insertion du coin ;
- réaligner ensuite la dernière face avec le mouvement final indiqué par la configuration ;
- dans la démonstration validée, la séquence est `R U R' U'` répétée trois fois, puis `U'`.

### Référence technique

- structure HTML : `solution/2x2/index.html`, section `#face-blanche` ;
- moteur 3D : `cube-player.js`, avec les modes `first-layer`, `yellow-orient`, `last-swap` et `quick-finish` ;
- styles partagés : `style.css`, règles `.white-step-*`, `.white-corner-*`, `.corner-*` et `.cube-player-*` ;
- avant toute duplication, contrôler la cohérence des couleurs, l'ordre des mouvements, les traits SVG superposés et le rendu responsive.

## 13. Première version à produire

Pour la première version, créer uniquement la page d'accueil.

La page d'accueil doit présenter :

- le nom du site : **CubeMaster** ;
- une accroche pédagogique ;
- les trois grandes familles de contenus : Solutions, Nettoyage, Composition ;
- les principaux cubes traités : 2x2, 3x3, 4x4, 5x5, Pyramix, Mégaminx, Gear Cube ;
- une navigation claire ;
- un design moderne, géométrique et coloré.

Ne pas encore créer toutes les pages secondaires. Les liens peuvent pointer vers les futures URLs.

## 14. Brief Codex prêt à l'emploi

```text
Tu travailles sur le repo cubemaster.

Contexte :
- Site statique hébergé sur Netlify.
- Nom de domaine : cubemaster.fr.
- Le fichier index.html doit rester à la racine.
- Pas de framework.
- Pas de build step.
- Le site doit rester en HTML/CSS/JS simple.
- Respecter les spécifications présentes dans specs-cubemaster.md.

Objectif :
Créer une première vraie page d'accueil pour CubeMaster, un site pédagogique en français autour des cubes de type Rubik's Cube : solutions, nettoyage, composition et progression.

À faire :
1. Améliorer index.html.
2. Améliorer style.css.
3. Utiliser la typo Space Grotesk via Google Fonts.
4. Utiliser les couleurs principales : noir #000000, bleu #2f46b0, vert #2aae34.
5. Créer une navigation principale : Accueil, Solutions, Nettoyage, Composition.
6. Créer un hero moderne avec le titre CubeMaster et une accroche claire.
7. Créer 3 blocs principaux : Solutions, Nettoyage, Composition.
8. Mettre en avant les cubes : 2x2, 3x3, 4x4, 5x5, Pyramix, Mégaminx, Gear Cube.
9. Donner une direction graphique moderne, géométrique et colorée.
10. Garder une excellente lisibilité mobile et desktop.
11. Ne pas créer encore toutes les pages secondaires.
12. Ne pas déplacer index.html.
13. Ne pas ajouter de dépendances.
```
