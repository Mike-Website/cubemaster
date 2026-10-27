# Visuels de resolution

## Pyraminx : vocabulaire

- Source : [Resoudre un Pyraminx](https://docs.google.com/document/d/1MiLhGMrMtnpAnPA5vBp-SxriWftRf89uzHbPm0lr01s/edit), section "Maintenant voici les pieces du pyraminx".
- Image de reference : `kix.15lt7kyxnw12`, recuperee le 11 octobre 2026.
- Fichier : `pyraminx-termes-google-docs.png`, original PNG de 496 x 127 pixels, sans regeneration ni retouche.
- Ordre des vues dans le document : Coins, Centres, Aretes.
- Le PNG reste une reference, pas un visuel affiche sur la page. Les trois vues sont redessinees en SVG par `pyraminxTermDiagram` dans `puzzle-guides.js`, dans le style des pages 2x2 et 3x3 : perspective commune, separations noires, pieces utiles orange, autres triangles gris et ombre discrete.
- Chaque face comporte neuf triangles : trois pointes aux extremites, trois centres inverses juste derriere les pointes et trois triangles d'aretes entre les centres. Sur les trois faces visibles, les schemas identifient les quatre pointes, les quatre ensembles de centres et les six aretes.
- Ne pas remplacer ces vues par les etats generiques du generateur de schemas : ils ne distinguent pas correctement les trois types de pieces.
