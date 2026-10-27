# cubemaster
Site pédagogique autour du Rubik's Cube : solutions, méthodes et entretien.

Site public : https://cubemaster.fr — projet Netlify : `cubemaster-fr`.

## Vérifier et construire

Node.js 22 suffit ; aucune dépendance npm n’est nécessaire.

```sh
node --test cube-player.test.cjs cube4-moves.test.cjs puzzle-guides.test.cjs nettoyage/guide.test.cjs
node scripts/build.mjs
python3 -m http.server 8765 --directory dist
```

Le dossier `dist/` contient uniquement les 27 pages publiques, la page 404,
les ressources utilisées, les licences, `robots.txt`, `sitemap.xml` et les règles Netlify.
Les spécifications, maquettes, tests, rapports et originaux non utilisés restent dans Git.

## Publication

`netlify.toml` lance les tests puis construit `dist/`, qui est le dossier à publier.
Branche de production : `main`. Dépôt : `Mike-Website/cubemaster`.
En cas de déploiement manuel sur le projet existant :

```sh
npx netlify-cli link --id d7caaa86-ba4b-4ecd-babe-5a309c6f0e57
npx netlify-cli deploy --prod --dir dist --no-build
```

Ne jamais publier la racine du dépôt. `.netlify/` et `dist/` sont ignorés par Git.
Si le déploiement continu est actif, le prochain push sur `main` remplace
un éventuel déploiement manuel par la version de cette branche.

## SEO et contenu restant

Le domaine canonique est défini dans `site.config.json` et dans les en-têtes HTML.
Le build vérifie leur cohérence. En cas de changement de domaine, mettre à jour les deux.
Le sitemap contient les 15 pages ouvertes à l’indexation.
Les six ébauches et les six guides de nettoyage en validation conservent `noindex`.
Voir [l’audit du 27 octobre 2026](reports/audit-2026-10-27.md) pour le détail par page.
