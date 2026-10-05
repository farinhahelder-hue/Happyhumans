# CMS — architecture et règles

Ce document explique comment le contenu du site est branché sur le CMS, et **comment ajouter un texte ou une page sans casser l'édition**.

## Le principe : une seule source de vérité

Chaque page pilotée par le CMS a un module de textes par défaut :

```
lib/cms-defaults/<page>.ts      →  export const <PAGE>_DEFAULTS = { cle: 'texte par défaut', … }
```

Ce module est lu **à la fois** par :

| Qui | Comment |
|---|---|
| la page publique | `const c = useCmsContent('<page>', <PAGE>_DEFAULTS)` puis `{c.cle}` |
| l'admin | `lib/cms-page-defaults.ts` (`PAGE_DEFAULTS`) pré-remplit le formulaire |

Avant, ces textes existaient en **deux copies** qui divergeaient (l'admin disait « 45 min », le site « 1h »), et un clic sur « Sauvegarder » écrivait en base le mauvais texte. Ne dupliquez jamais un texte par défaut : modifiez uniquement le module de la page.

Les valeurs saisies dans l'admin sont stockées dans la table Supabase `site_content` (`page`, `block_key`, `value`) et **remplacent** le défaut. Une valeur vide retombe sur le défaut ; pour masquer un texte, saisir un espace.

## Ajouter un texte modifiable

1. Ajouter la clé et son texte dans `lib/cms-defaults/<page>.ts`.
2. Dans la page : `{c.ma_cle}` (lecture simple, rendue côté serveur → indexable par Google).
3. Ajouter un champ dans `PAGES_CONFIG.<page>` (`app/cms-admin/page.tsx`) :
   `{ key: 'ma_cle', label: 'Groupe — Libellé', type: 'text' | 'textarea' | 'image' }`.
   La partie avant « — » dans le libellé sert de titre de groupe dans l'admin.

`npm test` vérifie ces trois points (`__tests__/cms/consistency.test.ts`) : si vous oubliez une étape, le test dit exactement quelle clé manque.

### `c.ma_cle` ou `c.get('ma_cle')` ?

`c.get()` rend un champ cliquable pour l'édition en ligne, mais il est chargé en `ssr: false` : son texte **n'est pas dans le HTML envoyé par le serveur** (donc invisible pour Google au premier chargement). Les nouveaux champs utilisent la lecture simple `c.ma_cle`. Les anciens `c.get()` sont conservés tels quels.

## Textes avec gras, italique, liens

Utiliser le composant `components/Rich.tsx` :

```tsx
<p><Rich text={c.ma_cle} linkClassName="underline" /></p>
```

Dans l'admin, la valeur s'écrit `**gras**`, `*italique*`, `[texte](https://…)`, et un retour à la ligne devient un saut de ligne. Pas de HTML : le contenu de la base n'est jamais interprété comme du code.

## Listes

- **Éléments fixes** (cartes, formules) : une clé par élément (`domain_1_title`, `domain_2_title`…).
- **Liste libre** (FAQ) : emplacements numérotés (`faq_1_q`, `faq_1_a` … `faq_15_*`). Un emplacement vide est masqué, donc on peut supprimer et ajouter des éléments. Les questions d'origine sont dans `FAQ_ITEMS` et ne servent que tant que le CMS n'a rien enregistré.
- Listes à puces d'un seul champ : un élément par ligne (`flash_features`, `pricing_card_1_items`…).

## Ajouter une page

1. Créer `lib/cms-defaults/<page>.ts` et l'ajouter à `PAGE_DEFAULTS` (`lib/cms-page-defaults.ts`).
2. Créer le bloc `'<page>': { label, emoji, sections: [...] }` dans `PAGES_CONFIG`.
3. Si la page a un `export const metadata` (composant serveur), garder `page.tsx` serveur et mettre le contenu dans un composant client à côté (voir `app/mentions-legales/`).
4. Ajouter la page dans `PAGES` du test `consistency.test.ts` et dans `app/sitemap.ts`.

## Brouillon / publication

« Enregistrer » dans l'admin écrit un **brouillon** ; rien n'est en ligne tant qu'on ne clique pas sur **Publier**.

| Action | Effet |
|---|---|
| Enregistrer le brouillon | n'écrit que les champs **réellement modifiés** (jamais les textes par défaut) |
| Voir le brouillon / aperçu de l'admin | la page avec `?cms_preview=1` : brouillons par-dessus le publié, réservé aux sessions CMS connectées |
| Publier | recopie les brouillons de la page vers le site public, puis les supprime ; régénère le SEO |
| Abandonner | supprime les brouillons ; le site en ligne n'est pas modifié |

**Stockage, sans migration SQL** : un brouillon est une ligne de `site_content` dont `page` vaut `draft:<page>`. Le site public interroge `page = '<page>'` et ne le voit donc jamais.
Logique pure et testée seule : `lib/cms-drafts.ts`. Routes : `PUT /api/cms/content` (`draft: true`), `POST /api/cms/publish` (`publish` | `discard`), `GET /api/cms/public-content?preview=1`.

**Édition en ligne** (bouton « Éditer » sur le site) : même principe. Elle enregistre en brouillon, affiche les brouillons pendant l'édition et propose « Publier ».
Une écriture directe en ligne (sans `draft`) remplace le brouillon du même champ, pour qu'un « Publier » ultérieur n'écrase pas une modification plus récente.

**Repli** : si la base refuse les brouillons (une contrainte CHECK sur `page`, code 23514), l'admin l'affiche et revient à la publication directe, après confirmation.

**Historique** : le déclencheur SQL journalise aussi les lignes `draft:…` ; le panneau d'historique d'une page ne montre que les vraies mises en ligne.

## Développer sans Supabase

```bash
npm run dev:mock      # faux Supabase en mémoire + site en dev ; admin : /cms-admin, mot de passe « dev-local »
npm test              # tests unitaires et d'intégration (routes API contre le faux Supabase)
```

`scripts/mock-supabase.cjs` imite l'API REST de Supabase (select, upsert, delete, filtres) et le déclencheur d'historique. `/__state` affiche son contenu ; `/__config?rejectDrafts=1` simule une base qui refuse les brouillons.

## Sections réordonnables

Sur 7 pages (Accueil, À propos, Coaching, Organisations, Sparring Partner, Relations, Happiness Design), le groupe **Structure** de l'admin permet de **réordonner et masquer** les sections.
Le bandeau d'ouverture (en haut) et l'appel à l'action final (en bas) sont verrouillés : la page garde toujours un début et une fin cohérents.

- Registre : `PAGE_SECTIONS` dans `lib/cms-sections.ts` (id stable + libellé par section). Logique pure et testée.
- Stockage : un seul champ `sections_layout` (JSON `{"order":[…],"hidden":[…]}`). Vide = ordre d'origine, donc une page jamais modifiée s'affiche à l'identique.
- Il suit le circuit brouillon / publication comme tout autre champ. Un JSON invalide retombe sur l'ordre d'origine.
- Dans la page : les `<section>` de `<main>` sont dans un objet `sections`, et `resolveSections(PAGE_SECTIONS.x, c.sections_layout)` donne l'ordre à rendre.

Pour ajouter une section : l'ajouter à l'objet `sections` de la page ET à `PAGE_SECTIONS`. Pour rendre une nouvelle page réordonnable : l'ajouter à `PAGE_SECTIONS`, un champ `sections_layout` (type `sections`) dans `PAGES_CONFIG`, et la valeur `sections_layout: ''` dans ses défauts.

Limites : on ne peut pas dupliquer une section (chacune lit ses propres champs), et la disposition s'applique après le chargement du contenu, comme tous les textes du CMS (le HTML serveur est dans l'ordre d'origine).

## SEO par page

Chaque page a trois champs, groupe « Référencement Google » : `seo_title`, `seo_description`, `seo_image`.
Ils sont lus côté serveur par `lib/page-seo.ts` (`pageMetadata(page, DEFAULTS)`) dans le `layout.tsx` de la route.
Les valeurs par défaut sont celles de `lib/cms-defaults/<page>.ts` ; si Supabase est indisponible, on les utilise : le SEO ne casse jamais.
Chaque sauvegarde d'un champ `seo_*` régénère la page (`revalidatePath` dans `app/api/cms/content/route.ts`) ; sinon elle se régénère au plus toutes les 5 minutes.
`pageMetadata` définit aussi l'URL canonique et `og:url` **propres à chaque page** (avant, toutes pointaient vers l'accueil).
La page d'accueil utilise les réglages globaux (Paramètres → SEO).

## Sécurité — règles à garder

- **Authentification des routes** : toute route de `app/api/` doit appeler `requireCmsAuth(req)`, OU figurer dans `PUBLIC_ROUTES` de `__tests__/api/cms-protected-routes.test.ts` avec sa raison. Ce test échoue sinon.
- **Session d'édition en ligne** : le cookie `hh_cms_edit` est un jeton **signé** (HMAC, 2 h, httpOnly) émis par `proxy.ts` et vérifié par `verifyEditSession` (`lib/cms-auth.ts`). Ne jamais faire confiance à la simple présence d'un cookie. `hh_cms_ui` n'est qu'un indicateur d'affichage, sans aucun accès.
- **E-mails** : toute valeur saisie par un visiteur passe par `esc()` (`lib/send-email.ts`) avant d'entrer dans un gabarit HTML.
- **Aperçu des brouillons** : `?preview=1` n'est honoré que pour une session CMS authentifiée.
- **Secrets** : jamais dans le code ni dans le dépôt (public). Variables d'environnement uniquement : voir `.env.example`.
- **URL du site** : `lib/site-url.ts` (variable `NEXT_PUBLIC_SITE_URL`) ; ne pas écrire de nom de domaine en dur.

## Ce qui n'est PAS dans le CMS

- Le quiz d'attachement (`components/attachment-test/`) : questions, scores et résultats sont dans le code.
- Les libellés des `<option>` du formulaire de contact : le texte est la valeur envoyée, il ne faut pas le changer sans adapter le traitement.
- Les articles de blog et destinations : ils ont leur propre éditeur (onglet Articles).
- La navigation : éditeur dédié (page « Navigation »).
- Les pages redirigées par `next.config.js` (`/travel-planning`, `/hotel-consulting`, `/destinations/*`…) : elles ne sont pas servies.
