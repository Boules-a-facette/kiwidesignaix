# Vérification de la reprise — kiwidesignaix.com

29 septembre 2026. Contrôle fait par l'orchestrateur (Michel) après la construction déléguée à
Claude Code, sur la copie servie en local (`python3 -m http.server 8899`) comparée à l'original en
ligne. La comparaison porte sur les **styles calculés** et les **positions absolues**, pas sur des
captures jugées à l'œil ; les captures n'ont servi qu'au contrôle visuel final.

## Méthode

- `scripts/computed-styles.js` (dépôt `migration_mallory`) évalue la même liste de cibles sur
  l'original et sur la copie, à 1440, 768 et 375 px, et rend un JSON par page et par largeur.
- Les cibles sont cherchées par rôle (identifiants de section, nièmes titres, champs de formulaire),
  pas par classe CSS, pour rester comparable entre WordPress et la copie statique.
- Les deux jeux de JSON sont comparés propriété par propriété ; sont ignorés les écarts sans effet
  visible (technique de mise en page `table-cell` contre `flex`, couleurs de bordure de largeur
  nulle, `text-align: start` contre `left`).
- Les liens de sortie ont aussi été vérifiés à la main (`grep`, existence des 33 fichiers de
  `assets/img`).

## Résultat : hauteurs de sections (px)

| Largeur | welcome | recent | services | about | contact |
|---|---|---|---|---|---|
| 1440 — original | 851 | 1841 | 1086 | 900 | 1044 |
| 1440 — copie | 851 | 1849 | 1087 | 900 | 965 |
| 768 — original | 811 | 1082 | 1425 | 900 | 1272 |
| 768 — copie | 811 | 1131 | 1425 | 900 | 1243 |
| 375 — original | 919 | 4086 | 1662 | 759 | 1343 |
| 375 — copie | 919 | 4071 | 1643 | 759 | 1264 |

Écarts restants, tous expliqués :

- **`recent` (+8 / +49 / −15)** : l'original empile la galerie en *masonry* (isotope), la copie en
  grille de 2 colonnes. Les vignettes y sont environ 3 % plus larges.
- **`contact` (−79 / −29 / −79)** : le captcha de l'original (« 4 + 4 = ? ») n'est pas reproduit ;
  il occupait 63 px de haut, plus sa marge. C'est un écart voulu (documenté au README).
- **`services` (−19 à 375 px)** : écart d'espacement entre les blocs empilés à une colonne.

## Ce qui correspond au pixel

- **Repères du hero** à 1440 px : logo `[29, 0, 188, 50]`, titre `[813, 320, 513, 66]`, paragraphe
  `[813, 471, 513, 74]`, bouton `[813, 571, 167, 46]` — identiques sur les deux.
- **Repères à 375 px** : logo `[28-29, 6, 255-256, 68]`, titre `[30, 580, 315, 53]`, paragraphe
  `[30, 718, 315, 99]`, bouton `[30, 843, 167, 46]` — identiques.
- **Mentions légales** : les **six** positions de `h3` (`98, 245, 384, 498, 674, 764` à 1440 px ;
  `130, 400, 688, 827, 1201, 1340` à 375 px), le pied de page et la hauteur de page sont identiques.
- **Pied de page** à 375 px : copyright à `x = 28`, conteneur de 319 px (identique : 24 px et 272 px
  à 320 px).
- **Burger** : trait de 21 × 2 px, centré à la même ordonnée que l'original (le thème applique une
  échelle de 0,6 sur un trait de 35 × 3 px).
- **Aucun débordement horizontal** à 375, 768 et 1440 px ; aucune image cassée.
- **Aucune requête vers `kiwidesignaix.com`** : les seules occurrences du domaine sont les
  `canonical`, le sitemap, le robots, les redirections, le texte des mentions légales et le README.

## Comportements exercés au navigateur

| Contrôle | Résultat |
|---|---|
| Menu burger | ouvre un panneau de 300 px collé à droite, pleine hauteur, 6 entrées dans l'ordre, voile à 10 %, `aria-expanded` à `true` |
| Fermeture du menu | `Échap` ferme (vérifié) ; clic sur le voile et sur un lien fermés par construction |
| Visionneuse de la galerie | ouvre l'image plein format (chargée, `naturalWidth > 0`), suivant/précédent, `Échap` ferme, défilement de la page verrouillé, focus retenu dans les trois boutons, Ctrl/Cmd + clic non intercepté |
| Retour en haut | visible et à 0,7 d'opacité après défilement |
| Formulaire vide | trois messages d'erreur, focus sur le premier champ fautif |
| Formulaire rempli | message de confirmation, URL `mailto:` construite (sujet et corps encodés, séparateurs `\r\n`) |
| Formulaire, champ piège rempli | message affiché, **pas** d'ouverture du logiciel de messagerie |
| Sans JavaScript | le formulaire retombe sur `action="mailto:…" method="post" enctype="text/plain"` ; le volet de menu est remis dans le flux par la règle `<noscript>` (plus de panneau fixe qui recouvre le contenu) |

## Relecture adverse

Un second passage de Claude Code (lecture seule, mission « trouve ce qui ne va pas ») a rendu
19 points. Traitement :

- **Corrigés** : bouton « La suite plus bas ! » mort sans JavaScript (`href` vers `#recent`) ;
  formulaire sans repli sans JavaScript ; champ piège rempli qui bloquait un visiteur sans retour ;
  séparateurs `\r\n` ; panneau de menu qui recouvrait le contenu en `<noscript>` ; `&display=swap` ;
  `scroll-margin-top` inutile sous 990 px ; pied de page collé aux bords sous 768 px ; visionneuse
  sans piège de focus ni verrou de défilement ; description dupliquée sur les mentions légales ;
  `href` OVH en `https://` ; `alt` du logo, placeholders et `title` repris à l'identique de
  l'original ; trois affirmations fausses du README.
- **Écartés, avec raison** : structure de titres (cinq `h1` sur l'accueil, aucun sur les mentions
  légales) — c'est le balisage de l'original, arbitrage déjà retenu pour vgavard-electricite.com ;
  contrastes insuffisants — fidèles à l'original, signalés comme point à arbitrer par la cliente ;
  coquilles accentuées conservées — textes d'origine ; `noindex` sur les redirections douces —
  voulu, ces URLs sont du contenu de démonstration qu'on préfère voir sortir de l'index.
- **Signalés au README comme points ouverts** : noms accessibles des vignettes (à demander à la
  cliente) ; adresse de contact publique et aspirable, car c'est l'adresse personnelle de la
  gérante ; dépendance au CDN Google Fonts.

## Non vérifié, à regarder sur un vrai navigateur

- **L'ouverture réelle d'un logiciel de messagerie** par le formulaire : l'URL `mailto:` est
  construite et l'exécution ne lève pas d'erreur, mais le navigateur automatisé ne remet la main à
  aucun client de messagerie. À confirmer sur le navigateur de Benjamin.
- **Les visuels à l'œil** : les captures ont été comparées (accueil en 1440 et 375 px), mais pas
  chaque section de chaque page en 768 px.
- Le **rendu des fonds `fixed`** (parallaxe) n'a été vérifié qu'en styles calculés, pas au
  défilement réel.
- Le **comportement entre 768 et 989 px** : la mise en page y est très étroite (colonnes d'environ
  184 px), ce qui est fidèle à l'original, mais n'a pas été jugé sur capture.
