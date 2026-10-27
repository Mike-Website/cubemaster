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
| Solution | Pyraminx | `/solution/pyraminx/` | `https://cubemaster.fr/solution/pyraminx` |
| Solution | Mégaminx | `/solution/megaminx/` | `https://cubemaster.fr/solution/megaminx` |
| Solution | Gear Cube | `/solution/gearcube/` | `https://cubemaster.fr/solution/gearcube` |

### Nettoyage

| Catégorie | Sous-catégorie | URL recommandée | URL source |
|---|---|---|---|
| Nettoyage | 2x2 | `/nettoyage/2x2/` | `https://cubemaster.fr/nettoyage/2x2` |
| Nettoyage | 3x3 | `/nettoyage/3x3/` | `https://cubemaster.fr/nettoyage/3X3` |
| Nettoyage | 4x4 | `/nettoyage/4x4/` | `https://cubemaster.fr/nettoyage/4X4` |
| Nettoyage | 5x5 | `/nettoyage/5x5/` | `https://cubemaster.fr/nettoyage/5X5` |
| Nettoyage | Pyraminx | `/nettoyage/pyraminx/` | `https://cubemaster.fr/nettoyage/pyraminx` |
| Nettoyage | Mégaminx | `/nettoyage/megaminx/` | `https://cubemaster.fr/nettoyage/megaminx` |
| Nettoyage | Gear Cube | `/nettoyage/gearcube/` | `https://cubemaster.fr/nettoyage/gearcube` |

### Composition

| Catégorie | Sous-catégorie | URL recommandée | URL source |
|---|---|---|---|
| Composition | 2x2 | `/composition/2x2/` | `https://cubemaster.fr/composition/2x2` |
| Composition | 3x3 | `/composition/3x3/` | `https://cubemaster.fr/composition/3X3` |
| Composition | 4x4 | `/composition/4x4/` | `https://cubemaster.fr/composition/4X4` |
| Composition | 5x5 | `/composition/5x5/` | `https://cubemaster.fr/composition/5X5` |
| Composition | Pyraminx | `/composition/pyraminx/` | `https://cubemaster.fr/composition/pyraminx` |
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
- Pyraminx
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
│   ├── pyraminx.html
│   ├── megaminx.html
│   └── gearcube.html
├── nettoyage/
│   ├── 2x2.html
│   ├── 3x3.html
│   ├── 4x4.html
│   ├── 5x5.html
│   ├── pyraminx.html
│   ├── megaminx.html
│   └── gearcube.html
└── composition/
    ├── 2x2.html
    ├── 3x3.html
    ├── 4x4.html
    ├── 5x5.html
    ├── pyraminx.html
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

- toute nouvelle page de résolution doit contenir des images ou schémas du puzzle pour chaque étape et chaque sous-étape, sur le modèle pédagogique validé du 2x2 ; une simple liste de mouvements ou un lien vers une autre résolution ne remplace pas ces visuels ;
- les cas particuliers, notamment les parités, ont aussi leur propre schéma et une instruction qui explique comment reconnaître le cas avant l'algorithme ;
- l'absence provisoire d'une vidéo 3D ne dispense jamais des schémas statiques ; la vidéo pourra être ajoutée après validation du contenu et des états ;
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

### Référence Pyraminx : vocabulaire

- le bloc « Les termes utilisés » redessine les trois vues du [Google Docs Pyraminx](https://docs.google.com/document/d/1MiLhGMrMtnpAnPA5vBp-SxriWftRf89uzHbPm0lr01s/edit), dans l’ordre **Coins**, **Centres**, **Arêtes** ; le document sert de référence pour les pièces, pas de visuel à afficher tel quel ;
- les coins désignent ici les petites pointes. Les centres sont les trois triangles inversés derrière les pointes sur chaque face ; les arêtes sont les trois autres triangles entre les centres. Conserver ces repères, sans les remplacer par des états génériques ;
- `pyraminxTermDiagram` reprend le style validé des pages 2x2 et 3x3 : trois faces en perspective, traits noirs, pièces concernées orange, autres pièces grisées et ombre discrète ;
- le fichier source non retouché reste `assets/images/solution/pyraminx-termes-google-docs.png`, uniquement comme référence. La provenance et les règles de dessin sont documentées dans le README de ce dossier.
- le bloc « Les faces du puzzle » présente Avant, Gauche, Droite et Dessous, sans case Dessus. Les quatre vues gardent le même angle. La face du dessous est jaune, légèrement floutée et visible derrière des faces latérales transparentes aux traits gris ; les autres cases conservent des traits noirs.

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

### Extension 4x4 en cours de validation

- la page `/solution/4x4/` reprend les trois blocs de notation du 3x3 avec des visuels 4x4 : vocabulaire orange, couches vertes, mouvements bleus ;
- ici, les minuscules `r`, `l`, `u`, `d` tournent une seule couche interne ; `Rw`, `Lw`, `Uw` tournent deux couches. Depuis la face avant, les colonnes 2 et 3 sont respectivement `l` et `r` ;
- `cube4-scenes.js` fournit les séquences des centres, de la parité OLL et de la parité PLL au lecteur partagé `cube-player.js` ; les mouvements restent géométriques, centrés et sans translation artificielle ;
- les animations sont sans lecture automatique, avec un seul bouton lecture/pause/reprise/relance ; les demi-tours restent notés `2` et sont animés en deux quarts de tour séparés ;
- les centres sont animés depuis deux barres blanches à gauche en haut et à droite devant. Le blanc est complété en haut, le jaune en bas, puis le blanc passe à gauche et le jaune à droite. Les barres de couleur sont montrées horizontalement avant de redevenir verticales pour l’insertion. La vue finale remet le jaune en haut et le blanc en bas ;
- les exemples de transfert d’une barre vers le bas sont `l D2 l'` à gauche et `r' D2 r` à droite. Pour `r U2 r'`, les deux barres doivent être dans la colonne droite ; à gauche, utiliser `l' U2 l` ;
- correction proposée du retournement d’une arête : `R U R' F R' F' R`. L’apostrophe du second F est indispensable ;
- association proposée : `u L' U' L u'` avec morceau avant droit en haut et avant gauche en bas ; `d' L' U' L d` pour les hauteurs inversées. Les couleurs frontales sont inversées avant de réunir les morceaux ;
- l’orientation répétée des coins avec `R U R' U'` est proposée blanc en haut et jaune en bas, avec `D` ou `D'` entre les coins. Le maintien du blanc en bas demanderait une autre formule ;
- ces corrections de notation et de prise ont été soumises à l’utilisateur : elles sont des propositions vérifiées, pas encore une validation éditoriale ;
- les parités reprennent les formules CubeSkills : OLL `Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'` et PLL `r2 U2 r2 Uw2 r2 Uw2 U2`. Les animations partent de configurations légales construites par inversion ;
- `cube-player.test.cjs` vérifie les rotations 2x2/3x3/4x4, les couches internes et doubles, les états des centres et les résultats animés des deux parités. `cube4-moves.test.cjs` contrôle les repères, les apostrophes et les couches surlignées ;
- le bloc séparé « Dernier étage : coins, puis arêtes » a été retiré à la demande de l’utilisateur.

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

### Algorithmes 3x3 validés

La page `/solution/3x3-debutant/` reprend le standard pédagogique du 2x2 avec six étapes, des schémas isométriques à traits noirs et une animation 3D par étape. Les algorithmes du dernier étage suivent le guide débutant officiel Rubik's.

**Étape 1 - Croix blanche**

- former d'abord une croix avec les quatre arêtes blanches autour du centre jaune ;
- aligner la couleur latérale de chaque arête avec le centre identique ;
- effectuer un demi-tour de la face alignée, par exemple `F2`, pour descendre l'arête vers le centre blanc ;
- vérifier la croix blanche et les quatre centres latéraux avant de continuer.

**Étape 2 - Coins blancs**

- garder la face blanche en dessous ;
- placer le coin à traiter au-dessus de son emplacement ;
- répéter `R U R' U'` jusqu'à son insertion ;
- vérifier la face blanche et le premier rang des quatre faces latérales.

**Étape 3 - Deuxième étage**

- choisir une arête du haut qui ne contient pas de jaune ;
- aligner sa couleur frontale avec le centre ;
- insertion à droite : `U R U' R' U' F' U F` ;
- insertion à gauche : `U' L' U L U F U' F'` ;
- vérifier les deux premiers étages avant de travailler le jaune.

**Étape 4 - Croix jaune**

- reconnaître le point, le L ou la ligne ;
- orienter le L avec ses branches vers l'arrière et la gauche, ou garder la ligne horizontale ;
- exécuter `F R U R' U' F'` jusqu'à obtenir la croix jaune.

**Étape 5 - Face jaune**

- garder le jaune en haut et orienter le cas du poisson comme indiqué par le schéma ;
- exécuter entièrement `R U R' U R U2 R'` ;
- replacer le nouveau cas et recommencer si les neuf carrés ne sont pas encore jaunes.

**Étape 6 - Dernier étage**

- placer les coins avec `F' L F' R2 F L' F' R2 F2` ;
- placer ensuite les arêtes avec `F2 U L R' F2 L' R U F2` ;
- montrer chaque mouvement double comme deux quarts de tour séparés dans les animations ;
- terminer les algorithmes avant de contrôler le résultat.

### Continuité 3D du 3x3

- les modes du lecteur sont `3x3-cross`, `3x3-white-corner`, `3x3-middle-right`, `3x3-yellow-cross`, `3x3-yellow-face` et `3x3-final` ;
- chaque lecteur contient 27 pièces et fait tourner une couche de 9 pièces autour du centre du cube ;
- les états sont construits à rebours depuis un cube résolu : le résultat d'une vidéo est exactement l'état de départ de la suivante ;
- chaque lecteur expose des contrôles internes pour le nombre de pièces, l'état initial, les pixels visibles et l'état final attendu ;
- source de vérification des algorithmes du dernier étage : `https://coach.rubiks.com/en/quick-reference`.

### Référence technique

- structure HTML : `solution/2x2/index.html`, section `#face-blanche` ;
- moteur 3D : `cube-player.js`, avec les modes `first-layer`, `yellow-orient`, `last-swap` et `quick-finish` ;
- styles partagés : `style.css`, règles `.white-step-*`, `.white-corner-*`, `.corner-*` et `.cube-player-*` ;
- avant toute duplication, contrôler la cohérence des couleurs, l'ordre des mouvements, les traits SVG superposés et le rendu responsive.

### Référence pour les pages Nettoyage

- le modèle retenu est intégré à `nettoyage/3x3/index.html` : une étape à la fois, navigation précédent/suivant et suivi de la position dans le parcours ; les anciennes propositions ont été retirées ;
- garder le bloc visible « Avant le premier geste / Sur ton établi. » au-dessus du parcours, avec une seule case à cocher par matériel ; le pictogramme du chiffon ne doit pas ressembler à une seconde case ;
- ne pas afficher de case « Étape terminée » ; la barre suit l'étape affichée, sans validation manuelle ;
- le parcours partagé est dans `nettoyage/guide.js` et `nettoyage/guide.css`. Conserver les étapes dans le HTML pour une lecture complète sans JavaScript. Le modèle 3x3 est validé et adapté aux guides 2x2, 4x4, Mégaminx, Pyraminx et Gear Cube, avec six étapes et une FAQ propre à chaque puzzle ;
- ne pas toucher au guide 5x5 tant que son contenu n'a pas été fourni par l'utilisateur ;
- conserver les liens de références d'entretien en nouvel onglet avec `target="_blank"` et `rel="noopener noreferrer"` ;
- conserver la charte CubeMaster et le contenu propre à chaque puzzle ; ne pas reprendre les blocs de résolution pour présenter l'entretien ;
- les visuels doivent être exclusifs au site et fidèles au cube réellement utilisé : aucune pièce, couleur, géométrie interne ou manipulation inventée ;
- privilégier des photographies originales d'un modèle identifié ; une image générée ne constitue ni une photographie réelle ni une référence mécanique validée ;
- le triptyque `assets/images/nettoyage/atelier-3x3-propositions.png` reste une illustration de maquette. Le panneau du cube démonté n'est pas validé pour publication pédagogique ; ne pas le déployer dans les guides sans remplacement ou validation à partir de photos réelles.
- les cinq guides adaptés ont d'abord reçu leurs propres triptyques d'atelier `assets/images/nettoyage/atelier-{puzzle}-genere.webp`, générés avec Imagegen : préparation, nettoyage extérieur et contrôle final. Pyraminx, Mégaminx et Gear Cube les conservent en attendant leur reprise. Aucune vue de 3x3 n'est utilisée pour représenter un autre puzzle ;
- ces visuels extérieurs ne documentent pas le démontage, la lubrification interne ou le remontage d'un modèle précis. Pour ces gestes, prévoir des photographies originales d'un modèle identifié ; les guides restent en revue locale et en `noindex, nofollow` jusqu'à validation ;
- la connexion SEO est documentée dans `nettoyage/integrations-seo.md`. Les FAQ doivent s'appuyer sur les requêtes, intentions et questions réellement relevées par puzzle, sans inventer de volumes ni confondre popularité d'une réponse et fiabilité mécanique. Ne jamais intégrer des identifiants API dans les fichiers du site.
- correction demandée pour les visuels d'entretien : les vues extérieures répétées ont été jugées trop décoratives. Préparer des vues liées au premier retrait, aux pièces séparées, au nettoyage et au remontage, avec des repères pédagogiques ;
- références choisies par l'utilisateur : Rubik's pour le 2x2 et le 4x4 (choix confirmé le 10 octobre 2026). Pour Pyraminx et Mégaminx, pas d'équivalent Rubik's identifié : Meffert's proposé, en attente de réponse. QiYi MoFangGe / Raphaël pour le Gear Cube, dont la variante reste à identifier par l'utilisateur. Deux schémas de montage Rubik's anciens, archivés en 2008, ont été retrouvés ; ne pas les présenter comme les mécanismes actuels. Le statut et les sources sont consignés dans `nettoyage/references-modeles.md`. Ne pas attribuer les images génériques actuelles à ces marques et ne pas générer d'intérieur non documenté.
- dernier périmètre demandé : terminer le 2x2 et le 4x4 seulement, puis reprendre les autres puzzles plus tard ;
- chaque étape du 2x2 et du 4x4 utilise désormais une vue distincte : repérage, pièces séparées, nettoyage à sec, préparation du lubrifiant, remontage et contrôle. Douze fichiers `rubiks-{puzzle}-{scene}-v2.webp` (remontage 2x2 corrigé en `v3`) remplacent les anciennes vues, y compris l'anatomie 2x2 dont le contour vert est corrigé. Le 2x2 suit le coin rouge-blanc-vert ; le 4x4 distingue centre/arête/coin et montre deux stades différents du remontage. Les textes et FAQ sont précisés sans changer le parcours validé ;
- les douze vues sont carrées, affichées intégralement sur mobile et desktop avec `.cm-photo-reference`, sans recadrage de triptyque. Les originaux PNG et WebP optimisés sont conservés dans `assets/images/nettoyage/`. Les prompts exacts, corrections et limites sont enregistrés dans `creation-entretien-rubiks-v2.json` ;
- les légendes et la note indiquent que ces illustrations sont générées en validation à partir des références Rubik's anciennes, pas des photographies réelles ni des plans exacts. Les documents originaux sont liés en nouvel onglet. Le contour bleu sert au repérage, les pointillés au montage, jamais à l'extraction. Les flacons fermés ne démontrent ni zone d'application ni dose. Le premier retrait et l'application réelle restent conditionnés à la notice du modèle exact. L'intégration des séries est terminée, pas leur certification mécanique ou leur validation finale par l'utilisateur.

## 13. Première version à produire

Pour la première version, créer uniquement la page d'accueil.

La page d'accueil doit présenter :

- le nom du site : **CubeMaster** ;
- une accroche pédagogique ;
- les trois grandes familles de contenus : Solutions, Nettoyage, Composition ;
- les principaux cubes traités : 2x2, 3x3, 4x4, 5x5, Pyraminx, Mégaminx, Gear Cube ;
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
8. Mettre en avant les cubes : 2x2, 3x3, 4x4, 5x5, Pyraminx, Mégaminx, Gear Cube.
9. Donner une direction graphique moderne, géométrique et colorée.
10. Garder une excellente lisibilité mobile et desktop.
11. Ne pas créer encore toutes les pages secondaires.
12. Ne pas déplacer index.html.
13. Ne pas ajouter de dépendances.
```
