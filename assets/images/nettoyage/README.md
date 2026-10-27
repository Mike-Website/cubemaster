# Visuels des guides Nettoyage

Les cinq triptyques `atelier-{2x2,4x4,megaminx,pyraminx,gearcube}-genere`
sont des illustrations photoréalistes créées avec l'outil Imagegen intégré
à la demande de l'utilisateur. Ce ne sont pas des photographies prises
sur un atelier réel ni des preuves de compatibilité mécanique.

## Fichiers

- Original PNG : 2172 × 724 pixels, conservé dans ce dossier.
- WebP utilisé par les pages : mêmes dimensions, qualité 88, encodage Sharp.
- Trois vues carrées par puzzle : préparation, nettoyage extérieur,
  puzzle intact et aligné pour le contrôle final.
- Les vues extérieures utilisent les recadrages CSS du modèle validé ;
  les légendes décrivent ce qui est réellement montré.
- Le recadrage mobile des nouveaux visuels garde davantage de hauteur
  au-dessus du puzzle. Celui du 3x3 n'est pas modifié.

Les prompts exacts sont enregistrés dans `creation-visuels.json`.
Les originaux générés dans le dossier personnel Codex restent conservés.
Les versions écartées du Mégaminx ne sont pas déployées.

## Retour de validation

L'utilisateur a jugé ces vues extérieures trop décoratives et demande
des repères de démontage, une vue des pièces séparées et le remontage.
Elles ne sont donc pas validées comme visuels pédagogiques définitifs.
Les modèles choisis et les références à obtenir sont consignés dans
`nettoyage/references-modeles.md` : Rubik's pour le 2x2 et le 4x4 ; référence
du Pyraminx et du Mégaminx à confirmer ; QiYi MoFangGe / Raphaël pour le
Gear Cube, en attente d'identification par l'utilisateur. Aucune correspondance
mécanique avec les images génériques actuelles n'est revendiquée.

## Premières vues d'anatomie Rubik's

`rubiks-{2x2,4x4}-anatomie-2008-v1.png` et `.webp` : deux images carrées
de 1254 × 1254 pixels, générées avec Imagegen intégré puis encodées avec Sharp
(WebP qualité 85). Elles ont d'abord été intégrées aux étapes 2 et 5 des deux guides.
Elles ne sont pas présentées comme des photographies réelles ou comme des
plans mécaniques exacts. Cette première intégration est désormais complétée
par les séries décrites ci-dessous ; le 2x2 reprend une version corrigée
de sa vue d'anatomie à l'étape 2.

Les références factuelles sont deux schémas de montage Rubik's anciens,
archivés par James A. Storer en 2008, liés dans les pages et dans
`nettoyage/references-modeles.md`. Les rendus sont en validation locale :
ils permettent de repérer les coins/guides du 2x2 et le noyau sphérique
du 4x4, sans déduire de premier geste de retrait ni assimiler ces anciennes
versions à tous les cubes Rubik's récents.

Corrections avant intégration : carré blanc manquant puis contour du carré
sur le coin droit du 2x2 ; retrait des trois pièces surnuméraires du premier
essai 4x4. Les petits détails internes restent des approximations de rendu,
pas des dimensions ou fixations certifiées. Pour le remontage réel, suivre
le document original correspondant au modèle, pas les pointillés générés.
Les sources, les prompts et les limites sont dans `creation-anatomie-rubiks.json`.
Les vues du premier retrait, du nettoyage des pièces et de la lubrification
interne ne sont pas encore documentées par des photos du modèle actuel.

## Séries complètes 2x2 et 4x4

Périmètre confirmé par l'utilisateur : terminer uniquement le 2x2 et le 4x4.
Chaque page affiche maintenant six vues distinctes, sans triptyque répété :

| Étape | 2x2 | 4x4 |
| --- | --- | --- |
| 1 | Coin rouge-blanc-vert repéré sur le cube résolu | Groupe de quatre centres orange repéré |
| 2 | Deux coins séparés au-dessus des guides, six dans le corps | Deux rangées autour du noyau fermé et trois exemples de familles |
| 3 | Coton-tige sec sur le plastique accessible d'un coin | Brosse souple sur un élément d'arête, pièces triées |
| 4 | Coin sec et flacon fermé | Centre, arête et coin secs, flacon fermé |
| 5 | Dernier coin au-dessus de son emplacement, sept en place | Trois rangées inférieures et centre incliné, référence de montage photo 8 |
| 6 | Cube remonté tenu dans une main | Cube remonté tenu dans une main |

Les douze images portent les noms `rubiks-{puzzle}-{scene}-v2.png`
et `.webp`, sauf le dernier remontage 2x2, corrigé en `remontage-v3`.
La vue `rubiks-2x2-pieces-v2` corrige le contour inférieur vert de l'ancienne
vue d'anatomie ; celle-ci reste conservée mais n'est plus affichée.
Chaque image fait 1254 × 1254 pixels. Les WebP sont encodés avec Sharp,
qualité 85, effort 6, et pèsent moins de 200 Ko chacun. Les originaux restent
conservés. Aucun fichier des anciennes séries n'est supprimé.

Le cadrage carré affiche l'image intégralement, sur desktop et mobile,
avec la règle `.cm-photo-reference` existante. Les légendes et les textes
alternatifs correspondent à la scène de chaque étape. Les prompts exacts,
corrections et versions écartées sont dans `creation-entretien-rubiks-v2.json`.
La première préparation 4x4 à trois rangées et les essais de remontage avec
une pièce doublée ne sont pas intégrés. Les carrés verts tronqués des gros
plans 2x2, ainsi que les contours verts des deux vues ouvertes, ont été
corrigés avant intégration.

Ces rendus sont des illustrations générées à valider, pas des photographies
originales ni des plans certifiés. Ils reprennent les familles et états visibles
des documents anciens ; les détails internes cachés restent approximatifs.
Le contour bleu est un repère, les pointillés indiquent un alignement de
montage, jamais un geste d'extraction. Les flacons fermés ne montrent ni une
application réelle ni une dose. La méthode de premier retrait et les zones
de lubrification restent dépendantes de la notice du modèle exact.
Les Pyraminx, Mégaminx et Gear Cube conservent leur ancienne série en attendant
la reprise de leur travail. Le 3x3 et le 5x5 ne sont pas modifiés.

## Contrôles et limites

Inspection des images : nombre de rangées du 2x2 et du 4x4, silhouette
triangulaire du Pyraminx, faces pentagonales du Mégaminx, aspect extérieur
des engrenages du Gear Cube. Une première version du Mégaminx avait une
couleur répétée sur deux faces adjacentes ; elle a été corrigée avant
intégration. L'inspection visuelle ne vaut pas validation d'un modèle réel.

Aucun mécanisme interne, pièce détachée ou manipulation de démontage
n'est représenté dans les cinq triptyques extérieurs. Le flacon fermé ne démontre ni
une application de lubrifiant ni son dosage. Les indications de démontage
et de remontage nécessitent la notice exacte et des photos originales.
La génération originale ne garantit pas à elle seule une exclusivité
juridique des images.

Les guides restent en revue locale avec `noindex, nofollow`.
Le fichier `atelier-3x3-propositions.png` est l'ancienne maquette du 3x3 :
il est distinct de ces cinq séries et n'est pas réutilisé.
Le 5x5 n'a reçu ni visuel ni modification.
