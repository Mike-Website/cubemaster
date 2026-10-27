# Référence pour les pages Nettoyage

Page de référence validée : `nettoyage/3x3/index.html`.
L'ancien lien `nettoyage/propositions/index.html` redirige vers cette page.
Le parcours est adapté aux guides 2x2, 4x4, Mégaminx, Pyraminx et Gear Cube.
Le 5x5 reste inchangé, en attente du contenu fourni par l'utilisateur.

## Modèle retenu

Le modèle 2, « Une étape à la fois », est retenu.
Le bloc « Avant le premier geste / Sur ton établi. » de la proposition 1
est visible au-dessus de son parcours, sans accordéon.
Chaque matériel dispose d'une seule case à cocher : le pictogramme du chiffon
représente des couches de textile, et non un second carré ressemblant à une case.
Les propositions de comparaison ont été supprimées. La case « Étape terminée »
est retirée ; la barre de progression indique la position dans le guide,
pas une validation de l'exécution des gestes. Les cases de préparation du
matériel restent disponibles.

Le contenu des sept étapes est conservé dans le HTML. Sans JavaScript, toutes
les étapes restent lisibles. `nettoyage/guide.js` et `nettoyage/guide.css`
portent le parcours réutilisable. La navigation s'adapte au nombre d'étapes :
sept sur le 3x3, six sur chacun des cinq guides adaptés. Les ancres
`#etape-1` à `#etape-6` des anciens guides sont conservées.
Les cinq FAQ sont propres aux mécanismes concernés, et tous les liens de
références d'entretien s'ouvrent en nouvel onglet avec les attributs de sécurité.

Les photos sont des illustrations de maquette produites avec l'outil Imagegen
intégré, et non des photos de démontage validées. Asset enregistré dans
`assets/images/nettoyage/atelier-3x3-propositions.png`.

## Fidélité des visuels

La page 3x3 est en revue locale et porte `noindex, nofollow` tant que les
photos ne sont pas validées. Les visuels sont signalés comme provisoires.

Les visuels doivent être propres à CubeMaster et fidèles à un vrai cube,
sans pièces, couleurs, mécanismes ni gestes inventés.
Le triptyque généré est conservé pour la maquette uniquement. Le panneau
du cube démonté n'est pas validé : les formes des pièces et du mécanisme
ne sont pas documentées par des photographies d'un modèle réel.

Avant intégration aux pages de nettoyage, partir de photographies originales
du cube effectivement utilisé, avec son modèle identifié. Ne pas présenter
une image générée comme une photographie réelle ni comme une preuve technique.
L'exclusivité visuelle ne remplace jamais la fidélité mécanique.

À la demande de l'utilisateur, les cinq guides adaptés ont d'abord reçu
leurs propres triptyques Imagegen, dans le cadrage d'atelier du modèle validé :
préparation, entretien extérieur et contrôle final. Le même puzzle intact est
présenté dans les trois vues ; aucun mécanisme interne n'est montré.
Les images sont signalées comme illustrations générées dans chaque légende
et dans la note du parcours. Aucune image de 3x3 n'est réutilisée.
Les fichiers WebP optimisés et les originaux PNG sont enregistrés dans
`assets/images/nettoyage/`, avec leur provenance dans `README.md` et les
prompts dans `creation-visuels.json`.
Les photos originales d'un modèle identifié restent nécessaires pour
documenter les gestes de démontage, lubrification interne et remontage.
Les cinq guides portent toujours `noindex, nofollow` pendant la validation.
Le 3x3 et le 5x5 ne sont pas modifiés par cette intégration de visuels.

Après le choix Rubik's pour le 2x2 et le 4x4, deux premières vues d'anatomie
issues de schémas de montage anciens (archive 2008) sont ajoutées aux étapes
2 et 5 de ces guides. Elles restent des illustrations générées en validation,
pas des photographies ou des plans techniques exacts. Les sources originales
sont liées dans les pages. Les autres gestes internes restent à documenter ;
voir `nettoyage/references-modeles.md` pour les limites et les modèles en attente.

La reprise suivante est limitée aux 2x2 et 4x4. Chaque étape possède maintenant
une image distincte : repérage, pièces séparées, nettoyage à sec, préparation
du lubrifiant, remontage, contrôle. Les deux pages n'utilisent plus le triptyque
extérieur ; les autres puzzles le conservent sans modification.
Le 2x2 suit le coin rouge-blanc-vert, avec deux coins séparés puis un seul
dernier coin à remonter. Le 4x4 montre les trois familles de pièces et deux
stades progressifs autour du noyau fermé, d'après la référence ancienne.
Les gros plans et légendes sont adaptés à chaque geste, sans présenter une
application de lubrifiant ou une extraction non documentée.
Les prompts et corrections sont dans `creation-entretien-rubiks-v2.json`.
Les images restent générées en validation, pas des photographies ou des plans
certifiés. Le modèle actuel doit toujours être vérifié avant démontage.

Le guide `nettoyage/integrations-seo.md` décrit la connexion MCP de DataForSEO
et Bright Data et la méthode prévue pour enrichir les FAQ. Aucun compte
n'est connecté et aucun volume de recherche n'est encore collecté.

## Adaptation du contenu

Les textes des guides existants sont conservés et harmonisés au tutoiement.
Le démontage reste conditionné à la notice du modèle, sans méthode universelle
de retrait des pièces. Le 2x2 distingue les coins visibles des éléments
internes ; le 4x4 garde les familles de pièces triées ; le Mégaminx utilise
les repères de couleurs photographiés ; le Pyraminx distingue pointes et axes ;
le Gear Cube privilégie le nettoyage accessible et un démontage limité.

Le séchage complet précède la lubrification et le remontage. La répartition
du lubrifiant par rotation intervient seulement après remontage. Les temps
affichés sont des estimations hors séchage, pas des temps mesurés.
Références générales consultées le 10 octobre 2026 :
- https://speedcubeshop.com/a/blog/how-to-clean-your-speed-cube
- https://speedcubeshop.com/a/blog/how-to-clean-a-rubiks-cube-expert-guide-for-peak-performance
- https://www.gancube.com/blogs/gan_news/how-to-lube-a-speedcube

Ces sources ne fournissent pas de procédure de démontage universelle pour
chaque puzzle ; la notice exacte du modèle reste nécessaire.

## Prompt de l'image

Use case: photorealistic-natural. Asset type: three-panel photographic contact
sheet for a French educational cube-cleaning website prototype. Create a very
wide horizontal triptych, aspect ratio 3:1, three equally sized square
photographic panels seamlessly side by side with no borders, no text and no
graphics. Same bright white tabletop, cool daylight, pale blue work mat, sharp
professional editorial product photography throughout. LEFT PANEL: close view
of an authentic standard 3x3 twisty cube, square plastic pieces with vivid red
green white yellow colors and thin black divisions, one removable center cap
resting beside it, a small precision screwdriver and a shallow dish next to the
cube. MIDDLE PANEL: a realistic disassembled 3x3 cube with separate corner and
edge cubies arranged neatly around a grey microfiber cloth and a soft brush;
the metal core kept separately dry, no water on metal, no hands, no disassembly
exploded floating CGI. RIGHT PANEL: the same neatly reassembled 3x3 cube,
aligned solved vivid faces, grey cloth folded beside it and a small unlabeled
transparent cube-lubricant dropper bottle; this is an after-care photograph.
All cube pieces must look mechanically plausible, no extra face rows, no
impossible decorative cubes. Put the central subject in the middle of EACH
square panel with breathing room around objects. Crisp visible materials,
light realistic shadows, avoid dark moody photos, beige background, wood
tables, gradients, watermark, written words, branding, UI. These are
illustrative prototype photos, not a diagram.

## Icônes

Lucide 0.468.0, distribution UMD dans `assets/vendor/lucide.min.js`.
Licence ISC, avec certains pictogrammes issus de Feather sous licence MIT.
Les notices figurent dans `assets/vendor/LUCIDE-LICENSE.txt`.

## Vérification

Contrôles : `node --test nettoyage/guide.test.cjs`, syntaxe JavaScript,
références locales et disponibilité des icônes.
Le navigateur de test interdit le protocole `file:` : les mises en page
responsive sont préparées, mais la validation visuelle desktop et mobile
reste à faire sur cette page locale avant intégration aux guides publiés.
