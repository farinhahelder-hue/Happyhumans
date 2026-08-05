# 👋 Monica, commencez ici !

Ton site Happy Humans est **95% prêt** pour le lancer. Voici comment procéder étape par étape.

---

## 📋 Checklist rapide

### Semaine 1 : Setup
- [ ] Créer la table `contact_submissions` dans Supabase (5 min)
- [ ] Configurer `.env.local` avec tes clés Supabase
- [ ] Ajouter ton URL Calendly dans la page contact
- [ ] Tester en local : `npm run dev`

### Semaine 2 : Tests
- [ ] Suivre le **TESTING_CHECKLIST.md** (~20 min)
- [ ] Vérifier que le formulaire contact fonctionne
- [ ] Tester l'admin panel `/admin/contacts`
- [ ] Publier tes premiers articles de blog

### Semaine 3 : Déploiement
- [ ] Déployer sur Vercel (5 min)
- [ ] Configurer ton domaine `happyhumans.fr`
- [ ] Configurer Plausible Analytics (optionnel)
- [ ] Annonce de lancement ! 🎉

---

## 🚀 Step-by-step

### Step 1: Cloner / Télécharger le code

**Depuis GitHub** (recommandé pour futur déploiement Vercel) :
```bash
git clone https://github.com/[your-username]/happy-humans.git
cd happy-humans
```

**Ou** : Télécharge le zip du dossier `happyhumans/`

### Step 2: Installer & Configurer

```bash
# Installer les dépendances (1 fois seulement)
npm install

# Copier le fichier d'exemple
cp .env.example .env.local

# Ouvrir .env.local et ajouter tes clés :
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=abc...
# SUPABASE_SERVICE_KEY=xyz...
```

**Où trouver tes clés ?**
1. Ouvre https://app.supabase.com
2. Clique sur ton projet
3. Settings → API
4. Copie l'URL et les clés

### Step 3: Exécuter les migrations SQL

**Ouvrir Supabase Console** :
1. Va dans SQL Editor
2. Clique "New Query"
3. Exécute chaque fichier du dossier `migrations/` **dans l'ordre** (001 à 006) :
   - `001_cms_blog_posts.sql` — table des articles
   - `002_cms_settings_and_history.sql` — paramètres + historique
   - `003_contact_submissions.sql` — formulaires de contact
   - `004_contact_admin_notes.sql` — notes internes sur les messages
   - `005_blog_images_storage.sql` — stockage pour l'envoi d'images d'articles
   - `006_cms_testimonials.sql` — témoignages clients

Si tu as déjà exécuté certaines migrations précédemment, il suffit d'exécuter les nouvelles (les autres sont déjà en place — ce sont des scripts "idempotents", sans risque de les rejouer).

### Step 4: Ajouter ton URL Calendly

1. Ouvre ton compte Calendly : https://calendly.com
2. Crée un événement "Séance Découverte 30min"
3. Copie l'URL : ex `https://calendly.com/monica-schneider/30min`
4. Ouvre `app/contact/page.tsx`
5. Cherche ligne 142 et remplace l'URL

### Step 5: Tester en local

```bash
# Lancer le serveur de développement
npm run dev

# Ouvre http://localhost:3000 dans le navigateur
```

Teste les pages :
- `/` → Accueil
- `/contact` → Formulaire + Calendly
- `/blog` → Articles
- `/admin/contacts` → Admin messages

**Teste le formulaire** :
1. Va sur `/contact`
2. Remplis le formulaire
3. Envoie
4. Dois voir message vert ✅
5. Va dans `/admin/contacts` → ton formulaire est là !

### Step 6: Suivre le testing checklist

Ouvre `TESTING_CHECKLIST.md` et valide chaque section (~15 min).

### Step 7: Déployer sur Vercel

#### 7a. Créer un repo GitHub

```bash
# Si pas encore fait :
git init
git add .
git commit -m "Happy Humans site - Phase 3 complete"
git remote add origin https://github.com/YOUR_USERNAME/happy-humans.git
git push -u origin main
```

#### 7b. Déployer sur Vercel

1. Va sur https://vercel.com/new
2. Clique "Import Git Repository"
3. Sélectionne ton repo `happy-humans`
4. Framework: Next.js (auto-détecté)
5. Clique "Deploy"

#### 7c. Ajouter les variables d'env

Pendant le déploiement (ou après dans Settings → Environment Variables) :
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=happyhumans.fr
```

#### 7d. Configurer le domaine

Dans Vercel → Settings → Domains :
- Ajoute `happyhumans.fr`
- Suis les instructions pour la DNS

Chez ton registraire (Godaddy, Namecheap, etc.) :
- Ajoute un CNAME : `happyhumans.fr → cname.vercel-dns.com`
- Attends 15-30 min

### Step 8: Configurar Plausible (optionnel)

Si tu veux tracker les visites :
1. Va sur https://plausible.io
2. Inscris-toi gratuitement
3. Ajoute ton site `happyhumans.fr`
4. Dans `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=happyhumans.fr`
5. Redéploie sur Vercel

Après 24h, tu verras les stats sur plausible.io.

---

## 📚 Contenu à ajouter

### Tes articles de blog

3 brouillons d'articles sont prêts dans Supabase. Pour **publier** :
1. Va dans l'**Admin CMS** (url: /admin si tu l'ajoutes)
2. Clique "Publier" sur un article
3. L'article apparaît sur `/blog` et dans Google

### Tes sections réordonnables

Les pages `/coaching` et `/entreprises` ont des sections que tu peux **réordonner** (drag-drop). C'est automatique : dès que tu es connectée à `/admin`, ouvre simplement `/coaching` ou `/entreprises` dans le même navigateur et tu verras "☰ Drag to reorder" apparaître sur chaque section. Glisse-les dans l'ordre voulu, puis clique "Sauvegarder l'ordre".

### Envoyer des images pour tes articles

Dans l'éditeur d'article (`/admin/blog/[id]`), les champs "Image à la une" et "Image Open Graph" ont maintenant un bouton "📤 Envoyer" : tu peux choisir une image directement depuis ton ordinateur (jpg, png, webp, gif — 5 Mo max) au lieu de devoir trouver une URL toi-même. Un aperçu s'affiche automatiquement une fois envoyée.

### Rechercher et filtrer tes articles

Sur `/admin/blog`, une barre de recherche et des filtres (statut publié/brouillon, tag) apparaissent dès que tu as des articles — pratique quand la liste s'allonge.

### ⚠️ Remplacer les textes de démonstration

Toutes les pages publiques (Accueil, Coaching, Entreprises) contiennent encore des
**textes d'exemple** écrits pendant le développement — pas ton vrai contenu. Va sur
`/admin/content` pour les modifier, page par page. Ce n'est pas une migration SQL à
exécuter : ce sont juste des textes à remplacer, ça marche déjà.

Deux choses à corriger **avant de lancer le site publiquement** :

1. **`/coaching` → Programmes** : les 3 programmes affichent tous exactement le même
   texte "Description du programme" — un oubli du développement, pas du vrai contenu.
2. **`/entreprises` → Impact mesurable** : les chiffres ("+35% Engagement", "+28%
   Rétention", "+42% Productivité", "9/10 Satisfaction") sont des exemples inventés,
   pas des statistiques réelles. Publier des chiffres de performance inventés comme
   s'ils étaient vrais est risqué (image de marque, voire publicité trompeuse) — soit
   remplace-les par tes vrais résultats, soit supprime le bloc entier avec le bouton
   🗑 dans `/admin/content` si tu n'as pas encore de chiffres à montrer.

Les autres blocs (bio, cas d'usage, tarifs, FAQ, titres) sont modifiables au même
endroit — relis-les aussi, certains sont probablement encore génériques.

### Photos : remplace les images d'exemple par les tiennes

Le site utilisait des blocs de couleur unis en fond des grands titres (Accueil,
Coaching, Entreprises) — c'était froid et impersonnel. J'ai ajouté de vraies photos
chaleureuses (banque d'images Unsplash, libres de droits) en attendant les tiennes.
Sur `/admin/content`, chaque en-tête a maintenant un champ "Image de fond" avec un
bouton d'envoi — remplace-les par tes propres photos dès que tu peux, ce sera
beaucoup plus personnel que des photos de banque d'images, même chaleureuses.

**Ta photo sur la page d'accueil** : la section "Qui suis-je ?" avait une icône 🎯
générique à la place d'une vraie photo de toi. J'ai ajouté un champ "Photo" dans le
bloc "Qui suis-je ?" sur `/admin/content` (onglet Accueil) — envoie ta photo dès que
possible, l'icône disparaîtra automatiquement dès qu'une photo est envoyée.

### Ajouter tes vrais témoignages clients

La page `/coaching` affichait jusqu'ici 3 témoignages d'exemple (avec le même texte répété trois fois) — ce n'était que du contenu de démonstration. Va sur `/admin/testimonials` pour ajouter tes vrais témoignages : texte, nom, fonction, entreprise (optionnel), et un interrupteur "Publié". Utilise les flèches ↑↓ pour choisir l'ordre d'affichage. Tant qu'aucun témoignage n'est publié, la section est simplement masquée sur le site — pas de contenu de démo affiché par erreur.

### Notes internes sur les messages de contact

Sur `/admin/contacts`, chaque message a maintenant un champ "Notes internes" (jamais visible par le visiteur) pour te garder des rappels — ex. "Relancer le 20/07". Il y a aussi un onglet "Archivés" dans les filtres.

### Modifier ton email/téléphone de contact

Sur `/admin/settings`, la section "Coordonnées" te permet de changer l'email et le téléphone affichés sur la page `/contact` — plus besoin de demander à un développeur. Le champ "Ville"/"Zone de service" de la section "Géo & Business" est maintenant lui aussi affiché sur `/contact` (pas seulement utilisé pour le SEO).

### Configurer les toggles footer

Pour afficher/masquer le footer :
1. Va dans Supabase
2. Table `cms_settings_kv`
3. Cherche la clé `show-in-footer`
4. Change `value` de `false` à `true`
5. Redéploie ou l'app recharge

---

## 🆘 Dépannage

### "npm command not found"
→ Installe Node.js depuis https://nodejs.org (version 18+)

### "Formulaire ne s'envoie pas"
→ Vérifies que la table `contact_submissions` existe dans Supabase
→ Vérifie que `SUPABASE_SERVICE_KEY` est dans `.env.local`

### "Page contact ne charge pas"
→ Vérifies que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont dans `.env.local`

### "Vercel dit erreur build"
→ Clique sur le lien d'erreur dans Vercel
→ Copie-colle l'erreur dans un message à claude-code

---

## 📊 Après le lancement

### Chaque semaine
- [ ] Vérifier les nouveaux formulaires de contact dans `/admin/contacts`
- [ ] Regarder les stats Plausible (trafic, pages populaires)
- [ ] Publier un nouvel article de blog

### Chaque mois
- [ ] Mettre à jour tes tarifs / propositions
- [ ] Ajouter un nouveau témoignage
- [ ] Réordonner les sections si besoin

---

## 📞 Support

**Besoin d'aide ?**
- Questions techniques → claude-code
- Contenu / rédaction → tes articles
- SEO / Analytics → Plausible dashboard

**Commandes utiles** :
```bash
npm run dev      # Lancer le serveur local
npm run build    # Tester la build
npm start        # Serveur production local
npm run lint     # Vérifier les erreurs
```

---

## ✨ Vous êtes prête !

Ton site est maintenant **complet avec** :
✅ Accueil + pages services
✅ Blog avec 3 articles
✅ Formulaire contact + admin
✅ Calendly pour réservations
✅ Analytics Plausible
✅ SEO complet (sitemap, robots.txt, metadata)
✅ Sections réordonnables
✅ Historique & restauration

**Prochaines étapes** : Suivre la checklist et lancer ! 🚀

Questions ? Reluis **DEPLOYMENT_GUIDE.md** ou **TESTING_CHECKLIST.md**.

Bon lancement ! 🎉
