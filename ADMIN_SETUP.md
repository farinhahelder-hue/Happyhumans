# 🔐 Configurer l'accès admin

Le CMS est maintenant protégé par une vraie authentification (Supabase Auth). Avant
de pouvoir vous connecter sur `/admin`, il faut créer votre compte.

## 1. Appliquer les migrations SQL

Dans Supabase → SQL Editor, exécutez **dans l'ordre** :
1. `migrations/001_cms_blog_posts.sql`
2. `migrations/002_cms_settings_and_history.sql`
3. `migrations/003_contact_submissions.sql`
4. `migrations/004_contact_admin_notes.sql`
5. `migrations/005_blog_images_storage.sql`
6. `migrations/006_cms_testimonials.sql`

Ces fichiers sont écrits pour être rejouables sans erreur (`IF NOT EXISTS`,
`DROP POLICY IF EXISTS`) — vous pouvez les ré-exécuter sans risque si vous avez un doute.

## 2. Créer votre compte administrateur

1. Ouvrez [Supabase Console](https://app.supabase.com) → votre projet
2. Allez dans **Authentication → Users**
3. Cliquez **Add user → Create new user**
4. Renseignez votre email et un mot de passe
5. **Décochez "Auto confirm user" NON** — au contraire, cochez-le (sinon vous devrez
   confirmer par email avant de pouvoir vous connecter)

Ce site est mono-admin : **toute personne qui possède un compte peut tout modifier**.
Ne créez pas d'autres comptes sans réfléchir à qui doit avoir accès.

## 3. Se connecter

1. Allez sur `https://votre-site.fr/admin` (ou `http://localhost:3000/admin` en local)
2. Vous serez redirigé vers `/admin/login`
3. Connectez-vous avec l'email/mot de passe créés à l'étape 2

## Ce que vous pouvez faire une fois connectée

| Page | Fonction |
|------|----------|
| `/admin` | Tableau de bord — vue d'ensemble, activité récente |
| `/admin/content` | Tous les textes des pages Accueil/Coaching/Entreprises — titres, bio, programmes, FAQ, tarifs, cas d'usage, chiffres clés |
| `/admin/blog` | Liste des articles — publier, dépublier, dupliquer, supprimer |
| `/admin/blog/new` | Créer un nouvel article (éditeur avec aperçu live) |
| `/admin/blog/[id]` | Modifier un article existant |
| `/admin/testimonials` | Témoignages clients affichés sur /coaching — ajouter, modifier, réordonner, publier |
| `/admin/settings` | Toggles de visibilité + coordonnées de contact + informations Géo/Business (SEO local) |
| `/admin/history` | Historique de toutes les modifications, filtrable par type, avec restauration en un clic |
| `/admin/contacts` | Messages reçus via le formulaire de contact, avec statut et notes internes |

## Sécurité

- Toutes les routes `/admin/*` et `/api/admin/*` sont protégées par un middleware :
  sans session valide, vous êtes redirigé vers `/admin/login` (ou recevez une erreur
  401 pour les appels API).
- Les policies RLS de Supabase appliquent la même règle côté base de données, donc
  même en cas de bug dans le code de l'application, personne ne peut lire ou modifier
  le contenu sans être connecté.
- Le site est conçu pour un seul compte administrateur. Si vous voulez ajouter un
  deuxième utilisateur avec des droits limités, il faudra étendre les policies RLS
  (actuellement, tout compte authentifié a un accès complet).
