# kiwidesignaix.com : site statique

Site de l'atelier graphique Kiwi (EURL Sweet Paper, Mallory Milliet Gavard). Reconstruction en HTML,
CSS et JavaScript purs d'un site WordPress 5.3 / thème Enfold 4.7.3, publiable tel quel sur GitHub
Pages. Aucune dépendance, aucun build. La seule ressource externe est le lien Google Fonts
(Open Sans, Karla, Megrim).

## URLs

| URL | Fichier |
|---|---|
| `https://kiwidesignaix.com/` | `index.html` (one-pager : welcome, recent, services, about, contact) |
| `https://kiwidesignaix.com/politique-de-confidentialite/` | `politique-de-confidentialite/index.html` (Mention Légales) |
| `/2020/02/27/bonjour-tout-le-monde/` | redirection douce vers `/` |
| `/portfolio-item/meli-melo/` | redirection douce vers `/` |
| toute autre URL | `404.html` (`noindex, follow`) |

Le domaine nu est l'hôte du site (`www` redirige vers lui, en 301) : aucun `www` dans les canonical,
le sitemap ou les liens internes. Le `CNAME` contient `kiwidesignaix.com`.

Les liens internes des pages réelles sont écrits en **chemin absolu depuis la racine** (`/`, `/…#recent`),
et les ressources (`assets/…`) en **chemin relatif**, sauf dans `404.html` où tout est absolu (elle
peut être servie depuis n'importe quel chemin). Conséquence assumée : ouvrir les fichiers en `file://`
ne donne pas un site navigable, et un déploiement dans un sous-dossier de domaine casserait les liens.
Le site est prévu pour la racine de `kiwidesignaix.com`.

## Structure

- `assets/css/site.css` : toute la feuille de style (écrite à la main, valeurs mesurées sur l'original,
  aucun code Enfold).
- `assets/js/site.js` : menu burger, retour en haut, visionneuse de la galerie, formulaire `mailto:`.
- `assets/img/`, `assets/fonts/` : médias d'origine et police d'icônes `entypo-fontello`.
- `robots.txt`, `sitemap.xml` : les 2 URLs réelles.

## Choix et valeurs mesurées

- Une URL d'origine = un dossier avec un `index.html`, pour préserver le référencement.
- **En-tête** : fixe et transparent au-dessus de 990 px (hauteur 50 px, contenu décalé de 48 px),
  remis dans le flux en dessous (90 px de 768 à 989 px, 80 px sous 768 px). Relevé sur l'original :
  `position: fixed` à 990 px, `relative` à 989 px.
- **Menu** : le thème n'affiche jamais son menu horizontal (hauteur calculée 0 px à toutes les
  largeurs) ; toute la navigation passe par le volet burger. Le bouton fait trois traits de
  21 × 2 px espacés de 6 px, dans un carré de 21 px. Le volet est un panneau de 300 px collé à
  droite, sans fond, sur un voile noir à 10 %. Sans JavaScript, le volet est remis dans le flux par
  une règle `<noscript>` : la navigation reste possible et le panneau ne recouvre plus le contenu.
- **Hauteur des sections** : `100vh` pour chaque cellule (`table-cell` avec `height: 100vh` dans le
  thème), et `calc(100vh - hauteur de l'en-tête + 1px)` pour la première section — ce qui donne les
  851 px mesurés à 1440 × 900. En dessous de 768 px, le thème remet la hauteur à `auto` et empile
  les cellules dans l'ordre du document, avec un rembourrage latéral de 8 %.
- **Filets** : bloc de 25 px de haut, trait de 50 × 2 px posé à 12 px du haut (position mesurée).
- **Fonds `fixed`** (parallaxe) repassés en `scroll` sous 768 px, sinon le rendu mobile casse.
- **Couleurs** : terrestre `#d3c3bc` (cellules), `#bfada5` (fond de galerie), `#c3aca1` (icônes, filets
  de `services`, bouton), `#0a0a0a` (filet de `welcome`), `#b0b0b0` (paragraphes), `#222222` (titres),
  `#ffffff` (textes sur fond coloré). Le fond de page est blanc.
- **Polices** : corps Karla 15 px en `font-weight: 100` ; titres `h1` Megrim 60 px (48 px sous 500 px) ;
  `h2`-`h6` Open Sans. Chargées depuis le CDN Google, avec `&display=swap`.
- Les vignettes de la galerie sont des `<img>` (`alt=""`, dimensions réelles, `loading="lazy"` sauf
  les deux premières) et non des fonds CSS, pour porter les dimensions et le chargement différé.
- **Écart connu sur la galerie** : l'original utilise un empilement *masonry* (isotope) ; la copie
  utilise une grille de 2 colonnes. Les vignettes y sont 3 % plus larges et la section `recent` est
  8 px plus haute à 1440 px (29 px à 768 px). À l'œil, l'ordre et les proportions sont conservés.
- **Page 404** : le texte (« Oups ! », « Cette page n'existe pas. », « Retour à l'accueil ») n'existe
  pas dans les sources ; c'est le minimum nécessaire.

## Formulaire de contact

Sans serveur, le formulaire valide les champs côté client (Nom, Type de Projet et Message
obligatoires ; l'e-mail, s'il est rempli, doit contenir une `@`), puis ouvre le logiciel de
messagerie du visiteur via `mailto:` avec le sujet `Site Kiwi - message de <nom>`. Rien n'est envoyé
par le site lui-même.

- **Sans JavaScript**, le formulaire retombe sur son attribut `action="mailto:…" method="post"
  enctype="text/plain"` : le navigateur ouvre le logiciel de messagerie avec les champs pré-remplis.
  C'est pour cela que l'adresse figure aussi dans le HTML.
- L'adresse de destination (`mallorym@hotmail.fr`, l'adresse d'administration du WordPress d'origine)
  n'apparaît qu'à deux endroits : la constante en tête de `site.js` et l'attribut `action` du
  formulaire. Elle est donc publique et aspirable par les robots de spam — inévitable avec un
  formulaire `mailto:` sans service tiers. C'est l'adresse personnelle de la gérante : à confirmer,
  voire à remplacer par une adresse dédiée ou un service tiers (Web3Forms, FormSubmit).
- Le **captcha** de l'original (« 4 + 4 = ? ») n'est pas reproduit : il protégeait un envoi côté
  serveur et ne protège plus rien avec `mailto:`. Un champ piège invisible (honeypot) est conservé ;
  s'il est rempli, le message de confirmation s'affiche quand même mais aucune fenêtre de messagerie
  ne s'ouvre.
- La visionneuse de la galerie verrouille le défilement de la page, garde le focus dans ses trois
  boutons et laisse passer Ctrl/Cmd + clic (ouverture de l'image dans un nouvel onglet).

## Écarts assumés (défauts de l'original corrigés)

1. Logo servi en `http://` sur une page HTTPS : toutes les ressources internes sont en chemins
   relatifs, sans `http://` (seul reste le lien OVH des mentions légales, dont la cible est en
   `https://` et le texte affiché « http://www.ovh.com », fidèle à l'original).
2. Lien Instagram du header pointant sur `#` : non repris. Il faudra une vraie adresse Instagram de
   la cliente pour le remettre (le bouton burger occupe donc seul le bord droit).
3. Logo de remplacement `/KiwiV2/.../logo.png` (404) : aucune référence à `/KiwiV2/`.
4. Coquilles : « C'est partit ! » devient « C'est parti ! » ; le message de confirmation devient
   « Votre logiciel de messagerie va s'ouvrir avec votre message. » (l'original annonçait un envoi
   réussi, ce qui serait faux) ; le caractère invisible `U+2028` après « print » dans « Au menu » est
   remplacé par une espace normale.
5. Bouton « retour en haut » muet (icône vide dans l'original) : il porte le glyphe `\e8a5` de
   `entypo-fontello`, est cliquable (`#top`) et apparaît à 0,7 d'opacité après défilement.
6. `sitemap.xml` et `robots.txt` ajoutés (l'original n'en avait pas), `<meta name="description">`
   sur l'accueil (elle vient des réglages du site).
7. Contenu de démonstration (« Bonjour tout le monde ! », portfolio « Meli Melo », archives de
   catégories et de tags) non repris ; les deux URLs indexables redirigent vers l'accueil.
8. Bouton « La suite plus bas ! » : le `href` de l'original (`#next-section`) ne désignait aucune
   ancre réelle et ne fonctionnait que par JavaScript. Il pointe maintenant sur `#recent`.

## Points à trancher par la cliente

- **Contrastes** : le texte des cellules terre cuite est blanc sur `#d3c3bc` (≈ 1,7:1) et les
  paragraphes sont en `#b0b0b0` sur blanc (≈ 2,2:1). C'est **fidèle à l'original**, mais très en
  dessous de WCAG AA (4,5:1). Toucher ces couleurs, c'est s'écarter du rendu d'origine : arbitrage
  explicite nécessaire.
- **Noms accessibles des 14 vignettes** : l'original ne donne qu'un attribut `title` qui est un nom
  de fichier (« 53 », « vincent », « givree »…). Des `alt` descriptifs (« Logo Vegandia »…) sont à
  demander à la cliente.
- **Hébergeur (OVH)** : les mentions légales déclarent OVH comme hébergeur. Faux dès la publication
  ailleurs (GitHub Pages). Le texte est laissé tel quel ; il faudra le corriger, et ajouter la
  mention de Google Fonts si le CDN est conservé.
- **Structure de titres** : cinq `h1` sur l'accueil et pas de `h1` sur les mentions légales, comme
  dans l'original (arbitrage déjà retenu pour le site vgavard-electricite.com : on reproduit le
  balisage tel quel).
- **Coquilles accentuées conservées** (« Evenementiel », « EDITEUR DU SITE », « Numero Siret »,
  « Mention Légales ») : non corrigées, ce sont les textes d'origine.
- **Adresse Instagram** si le lien doit être remis.

## Hors du dépôt

- Le WordPress d'origine et ses sources d'audit (`migration_mallory/audits/kiwidesignaix/`), y compris
  la matière première de la reprise et l'archive FTP.
- Le DNS et la redirection `www` vers le domaine nu.

`VERIFICATION.md` : ce qui a été contrôlé, comment, et ce qui reste à regarder.
