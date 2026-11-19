# Mon portfolio

Site statique : aucun outil à installer, aucune compilation. Tout le contenu est dans le dossier `content/`.

## Mettre le site en ligne (GitHub Pages, gratuit)
1. Crée un compte sur github.com, puis un dépôt public (par ex. `portfolio`).
2. Envoie-y tous ces fichiers (« Add file » → « Upload files »), puis « Commit changes ».
3. Dans le dépôt : **Settings → Pages**. Sous « Branch », choisis `main` et `/ (root)`, puis Save.
4. Après une minute, le site est en ligne à `https://TON-PSEUDO.github.io/portfolio/`.

## Modifier le site
Tout se fait directement sur github.com : ouvre un fichier, clique sur le crayon, modifie, puis « Commit changes ». Le site se met à jour en une minute environ.

| Je veux… | Je modifie… |
|---|---|
| Changer mon nom, ma présentation, mes axes, mon contact | `content/site.json` |
| Modifier mon CV | `content/cv.json` (ajoute un bloc `{ "date": ..., "titre": ..., "detail": ... }`) |
| Ajouter un article | voir ci-dessous |
| Changer les couleurs | les variables en haut de `style.css` (`--bg`, `--accent`…) |
| Changer la phrase glosée | le bloc `<ul class="gloss">` de `index.html` |

## Ajouter un article
1. Crée un fichier dans `content/articles/`, par ex. `mon-nouvel-article.md`, et écris ton texte en Markdown (`## Titre`, `*italique*`, `**gras**`, `[lien](url)`, listes avec `-`).
2. Ajoute une entrée **en haut** de `content/articles.json` :
```json
{ "id": "mon-nouvel-article", "fichier": "mon-nouvel-article.md", "theme": "Linguistique",
  "date": "2026", "titre": "Mon titre", "resume": "Deux phrases de résumé." },
```
Attention aux virgules entre les entrées. L’`id` ne doit contenir que des lettres, chiffres et tirets. Un nouveau `theme` crée automatiquement son bouton de filtre.

## Tester sur son ordinateur
Ouvrir `index.html` directement ne marche pas (le navigateur bloque la lecture des fichiers). Dans le dossier, lance `python3 -m http.server`, puis ouvre http://localhost:8000.

## La frise du common ground
- Page : `frise.html`, données dans `content/frise.json`. Elle apparaît dans la liste des textes grâce à l’entrée contenant `"lien": "frise.html"` dans `content/articles.json` (une entrée avec `lien` ouvre directement cette page au lieu d’un fichier Markdown).
- Les visiteurs la voient en lecture seule : on clique sur un point pour lire son détail.
- **Pour l’éditer** : ouvre `frise.html?edition` (en local ou en ligne). Ajoute ou modifie des entrées et des liens, puis clique sur « Exporter » et colle le JSON dans `content/frise.json` sur GitHub. Tant que tu ne l’as pas fait, tes modifications ne sont enregistrées que dans ton navigateur.
- Disque plein = référence vérifiée ; disque creux = à vérifier. Passe les entrées en « Référence vérifiée » à mesure que tu contrôles les textes.

## CV
`content/cv.json`. Une ligne sans `date` (laisse `""`) s’affiche en pleine largeur, comme dans « Research interests ».
