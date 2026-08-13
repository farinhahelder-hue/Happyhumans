# Plan d'implémentation FR/EN — site Happy Humans (happyhumans.vercel.app)

> Objectif : rendre le site bilingue **français / anglais** avec des **URLs
> séparées** (`/coaching` en FR, `/en/coaching` en EN) — la meilleure approche
> pour le référencement Google.
>
> ⚠️ **Non testable hors ligne** : ce site nécessite Supabase + MongoDB + les
> secrets JWT/Resend/Brevo. Toute implémentation doit être **exécutée et testée
> dans un environnement réel** avant déploiement, et **ne jamais être mergée dans
> `main` sans test + sauvegarde préalable de `main`**.

## Architecture actuelle (constatée)

- Chaque page est un composant client (`'use client'`) qui lit son contenu via
  `useCmsContent(pageKey, DEFAULTS)` (`hooks/useCmsContent.tsx`).
- Le hook appelle `GET /api/cms/public-content?page=<page>` → lignes
  `{ block_key, value }` (Supabase), fusionnées sur des `DEFAULTS` français
  définis dans le code de chaque page.
- Édition en ligne via `EditableField` (`page` + `fieldKey`), sauvegarde
  déclenchée par l'événement `inline-edit-saved` (voir `contexts/InlineEditContext`,
  `components/InlineEditor`, `app/api/cms/content`).
- `app/layout.tsx` : `<html lang="fr">` en dur, `generateMetadata` piloté par
  `getKvSettings()`. Aucune locale.

## Approche recommandée

**URLs séparées** (`/en/...`), FR à la racine. On NE refactorise PAS en segment
`[lang]` (trop risqué) : on ajoute un miroir `/en`.

### 1. Stockage des traductions (sans migration de schéma)

Réutiliser la table de contenu CMS avec une **convention de clé suffixée** :
la valeur anglaise d'un champ `hero_title` est stockée sous `hero_title::en`.

- `GET /api/cms/public-content?page=X&locale=en` : pour chaque `block_key`,
  renvoyer la valeur `block_key::en` si présente, sinon la valeur FR (fallback).
- `POST/PUT` du contenu (`app/api/cms/content`) : accepter un `locale` et écrire
  sous la clé suffixée quand `locale=en`.

### 2. Contexte de locale

Créer `contexts/LocaleContext.tsx` (`'fr' | 'en'`, défaut `'fr'`).
`useCmsContent` lit la locale du contexte et passe `&locale=` à l'API.
Les pages restent inchangées (elles héritent la locale du provider).

### 3. Routing `/en`

Pour chaque page à traduire, extraire le corps en composant réutilisable
(`components/pages/CoachingPage.tsx`, etc.) puis :
- Route FR `app/coaching/page.tsx` → `<LocaleProvider locale="fr"><CoachingPage/></LocaleProvider>`
- Route EN `app/en/coaching/page.tsx` → `<LocaleProvider locale="en"><CoachingPage/></LocaleProvider>`

Pages concernées (checklist) :

- [ ] `/` (accueil)
- [ ] `/coaching`
- [ ] `/entreprises`
- [ ] `/happiness-design`
- [ ] `/relations`
- [ ] `/sparring-partner`
- [ ] `/a-propos`
- [ ] `/contact`
- [ ] `/faq`
- [ ] `/blog` + `/blog/[slug]`
- [ ] `/booking` (décider : traduire ou garder FR)
- [ ] pages légales (mentions, confidentialité) — souvent FR uniquement (obligation légale locale)

### 4. En-tête / pied de page

- Liens de nav localisés (préfixe `/en` sauf exceptions).
- **Sélecteur FR/EN** (basé sur `usePathname`) qui bascule vers la même page dans
  l'autre langue.
- `<html lang>` : petit composant client `SetHtmlLang` monté sur les pages `/en`
  (ou header via middleware).

### 5. SEO

- `hreflang` : dans `generateMetadata` de chaque page (FR et EN),
  `alternates.languages = { fr, en, 'x-default' }` + `canonical`.
- Ajouter les URLs `/en/...` au `sitemap` (`app/robots.ts` / route sitemap).

### 6. Éditer les traductions dans l'admin

`EditableField` + `/cms-admin` doivent proposer une bascule **FR / EN** :
en mode EN, l'écriture se fait sous la clé `::en`. C'est la partie la plus
délicate (toucher l'éditeur en ligne et l'API d'écriture).

### 7. Saisie du contenu

Monica saisit l'anglais page par page dans l'admin. Champ EN vide → le FR
s'affiche (fallback). On peut donc déployer tôt et traduire progressivement.

## Ordre de travail suggéré

1. API `public-content` + `content` locale-aware (fondation).
2. `LocaleContext` + `useCmsContent` locale-aware.
3. Une page pilote (`/en/coaching`) + sélecteur + hreflang → **tester en réel**.
4. Éditeur admin FR/EN.
5. Répliquer aux autres pages.
6. Sitemap + revue SEO.

## Référence

Une implémentation de référence (sur une base plus simple, à titre d'exemple de
patterns : `localizedHref`, `hreflangAlternates`, sélecteur, fallback) existe sur
la branche `happy-humans-coaching-cms` de ce dépôt — utile comme inspiration,
**non transposable telle quelle** (systèmes de contenu différents).
