# ✨ Guide des nouvelles fonctionnalités

Ce guide explique, en langage simple, ce qui a été ajouté à ton site et à ton
espace admin. Tout se pilote depuis `/admin` — sans toucher au code.

---

## 🎨 Apparence — change les couleurs, la police et le logo

**Où :** `/admin` → **🎨 Apparence**

Tu peux personnaliser tout l'aspect du site public :
- **Modèles** : 6 combinaisons prêtes (Océan, Forêt, Coucher de soleil…). Un clic
  applique couleurs + police assorties, que tu peux ensuite ajuster.
- **Couleurs** : une couleur principale + une secondaire. Les nuances foncées
  (survol des boutons) sont calculées automatiquement. ⚠️ Si tu choisis une
  couleur trop claire, un avertissement s'affiche (le texte blanc des boutons
  deviendrait illisible).
- **Police** : 6 choix, chaque bouton est affiché dans sa propre police.
- **Logo** : remplace le nom écrit "Happy Humans" par une image dans l'en-tête.
- **Icône (favicon)** : la petite icône dans l'onglet du navigateur.

Un **aperçu en direct** en haut de la page montre le résultat avant de sauvegarder.
👉 Recharge le site public pour voir les changements.

---

## 🌍 Site en français ET en anglais

Ton site existe maintenant en deux langues :
- Français : `happyhumans.fr/coaching`
- Anglais : `happyhumans.fr/en/coaching`

Un **bouton FR / EN** dans l'en-tête permet aux visiteurs de changer de langue.

**Pour saisir les traductions anglaises :** `/admin` → **Contenu** → bouton
**English** (en haut à droite). Tu retrouves les mêmes blocs, pré-remplis avec le
texte français comme point de départ ; remplace-les par l'anglais et sauvegarde.

> Tant qu'un bloc n'est pas traduit, la page anglaise affiche le texte français —
> jamais de page vide ou cassée. Tu peux donc traduire petit à petit.

**Le blog est aussi bilingue.** Dans l'éditeur d'article, un bouton **Français /
English** en haut permet de saisir la version anglaise (titre, extrait, contenu,
SEO). L'adresse (slug), l'image et les tags sont communs aux deux langues. Un
article non traduit s'affiche en français sur `/en/blog`. ⚠️ Nécessite la migration
`008_blog_i18n.sql`.

---

## 📣 Newsletter — collecte les emails de tes visiteurs

- Un formulaire d'inscription apparaît en bas de la page **Blog**.
- **Où voir les inscrits :** `/admin` → **📣 Abonnés**. Tu peux les **exporter en
  CSV** (bouton en haut) pour les importer dans ton outil d'emailing.
- Protection anti-spam intégrée.

> ⚙️ **À faire une fois** : exécuter la migration `007_newsletter_subscribers.sql`
> dans Supabase (voir MONICA_START_HERE.md, étape 3) pour créer la table.

---

## 📊 Statistiques de fréquentation dans le tableau de bord

Le **Tableau de bord** affiche une section **Fréquentation (30 jours)** : visiteurs,
pages vues, taux de rebond, durée moyenne, et pages les plus vues.

> ⚙️ Pour l'activer : crée une clé API sur Plausible (Settings → API Keys) et
> ajoute `PLAUSIBLE_API_KEY=...` dans tes variables d'environnement. Sans clé, un
> simple lien vers Plausible s'affiche.

---

## ✉️ Notification email des nouveaux messages

Quand un visiteur remplit le formulaire de contact, tu peux recevoir un **email**
automatiquement (au lieu de devoir vérifier l'admin).

> ⚙️ Pour l'activer : renseigne `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO` et
> `CONTACT_NOTIFICATION_FROM` (voir `.env.example`). Sans ça, les messages restent
> visibles dans `/admin` → **Messages** comme avant.
>
> Le formulaire a aussi une **protection anti-spam** (invisible pour les visiteurs).

---

## ✍️ Éditeur d'articles visuel

Dans l'éditeur d'article, plus besoin d'écrire du code. Une barre d'outils permet de
mettre en forme comme dans un traitement de texte : **Titre**, **Sous-titre**,
**Gras**, **Italique**, listes, citation, lien. Sélectionne du texte puis clique un
bouton.

---

## 🖼️ Descriptions d'images (accessibilité + Google)

Sous chaque image dans `/admin` → **Contenu**, un champ **Texte alternatif** permet
de décrire l'image. C'est lu par les lecteurs d'écran et aide **Google Images** à
référencer tes photos.

---

## 🧰 Confort d'utilisation de l'admin

- **Sur téléphone** : l'admin s'adapte (menu en bouton ☰, tiroir coulissant).
- **Alerte anti-perte** : si tu quittes une page avec des modifications non
  enregistrées, le navigateur te prévient.
- **Bouton "Rétablir"** sur chaque bloc de contenu : revenir au texte d'origine.
- **Sections repliables** et **pastille orange** quand un bloc n'est pas sauvegardé.
- **"Voir la page ↗"** à côté des onglets de Contenu, pour ouvrir la vraie page.

---

## Récapitulatif des variables d'environnement

| Variable | Rôle | Obligatoire ? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` / `SUPABASE_SERVICE_KEY` | Base de données | ✅ Oui |
| `NEXT_PUBLIC_CALENDLY_URL` | Ton lien Calendly | Recommandé |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Suivi des visites | Optionnel |
| `PLAUSIBLE_API_KEY` | Stats dans l'admin | Optionnel |
| `RESEND_API_KEY` + `CONTACT_NOTIFICATION_TO` / `_FROM` | Emails des nouveaux messages | Optionnel |

Tout est déjà documenté dans `.env.example`.
