# ✅ Testing Checklist - Phase 3 Complete

Avant de déployer en production, testez chaque feature en local.

## Prérequis

```bash
# 1. Installations dépendances
npm install

# 2. Configurer .env.local (copier .env.example)
cp .env.example .env.local

# 3. Ajouter vos clés Supabase dans .env.local

# 4. Créer la table contact_submissions dans Supabase (voir DEPLOYMENT_GUIDE.md)

# 5. Lancer le dev server
npm run dev
```

Visitez `http://localhost:3000` - tout doit charger sans erreurs.

---

## 🏠 Test 1: Navigation & Pages

### Accueil `/`
- [ ] Page charge rapidement
- [ ] Hero s'affiche avec texte + 2 boutons CTA
- [ ] Section "Qui suis-je ?" visible
- [ ] 3 service cards (Coaching, Coaching d'équipe, Articles)
- [ ] CTA "Réservez une séance découverte" en bas

**Action** : Cliquez sur les boutons CTA → doivent naviguer vers `/coaching`, `/entreprises`, `/contact`

---

## 🎯 Test 2: Pages Services

### `/coaching`
- [ ] Sections chargent dans cet ordre : hero, programs, testimonials, faq, cta
- [ ] 3 programs affichés (Executive, Leadership, Career)
- [ ] Testimonials lisibles
- [ ] FAQ avec 3 questions
- [ ] Call-to-action au-dessus de l'ordre des sections (dev only visible)

**Éditable** (en `isAdmin={true}` mode) :
- [ ] Bouton "Drag to reorder" sur chaque section
- [ ] Glissez une section → l'ordre change visuellement
- [ ] Cliquez "Sauvegarder l'ordre" → message confirmation
- [ ] Rechargez la page → nouvel ordre persiste

### `/entreprises`
- [ ] Même test que `/coaching` mais 6 sections
- [ ] Impact metrics avec 4 chiffres clés
- [ ] 3 cas d'usage affichés
- [ ] Tarification avec 3 offres

---

## 📱 Test 3: Formulaire Contact

### Page `/contact`
- [ ] Coordonnées visibles à gauche (email, tél, loc, socials)
- [ ] Formulaire à droite avec champs : nom, email, téléphone, sujet, message
- [ ] Tous les champs requis sauf téléphone

**Tester le formulaire** :
1. Remplissez : Nom="Test", Email="test@example.com", Sujet="coaching", Message="Mon message"
2. Cliquez "Envoyer"
3. Attendez 2-3 secondes
4. Message de succès doit s'afficher en vert ✅

**Vérifier dans Supabase** :
- Allez dans Table `contact_submissions`
- Votre formulaire doit être là avec `status: "new"`

**Tester les erreurs** :
- Essayez sans remplir les champs requis → erreur client
- Désactivez Internet, envoyez → erreur serveur affichée

---

## 📅 Test 4: Calendly Embed

### Section "Réservez votre séance"
- [ ] Iframe Calendly charge (attendez 3-5 sec)
- [ ] Calendly montre un formulaire de réservation
- [ ] Message "Impossible d'accéder ?" en bas avec lien email

**Test de réservation** (optionnel) :
- Cliquez dans le calendrier → tentez de réserver
- Ça doit envoyer à votre calendly.com (vous recevrez une notif email)

---

## 📊 Test 5: Analytics (Plausible)

### Configuration
1. Ouvrez `http://localhost:3000` dans DevTools (F12 → Console)
2. Tapez : `window.plausible`
3. Résultat attendu : fonction plausible() doit s'afficher

### Analytics Events
- [ ] Page load → événement "pageview" dans Plausible
- [ ] Clic lien → "Link Click" enregistré
- [ ] Submit formulaire → "Submit Form" enregistré

**Note** : Plausible ne track qu'en production. En dev, les événements ne seront pas vus. Vérifiez après déploiement sur Vercel.

---

## 📖 Test 6: Blog

### Page `/blog`
- [ ] 3 brouillons d'articles listés avec images
- [ ] Tags colorés affichés
- [ ] Date de publication visible
- [ ] Bouton "Aperçu" sur chaque brouillon

### Article individuel `/blog/[slug]`
- [ ] Exemple : `/blog/syndrome-impostor`
- [ ] Image à la une, titre, tags, date
- [ ] Contenu en HTML (paragraphes, listes)
- [ ] Champs SEO (title, description, OG image)
- [ ] Call-to-action "Réserver une séance" en bas

**Test du SEO** :
1. Inspectez le HTML (F12 → Elements)
2. Cherchez `<meta property="og:title">`
3. Doit contenir le titre de l'article

---

## 🔐 Test 7: Admin Panel

### Page `/admin/contacts`
- [ ] Affiche tous les formulaires reçus
- [ ] Filtre par statut (Nouveau, Lu, Répondu, Archivé)
- [ ] Cliquez sur un formulaire → détails s'affichent à droite
- [ ] Dropdown "Statut" → changez de "new" à "read"
- [ ] Bouton "Supprimer" → demande confirmation

**Workflow complet** :
1. Recevez un formulaire (test section 3)
2. Allez dans `/admin/contacts`
3. Marquez comme "replied"
4. Archivez
5. Filtrez "archived" → formulaire disparaît des autres onglets

---

## 🎨 Test 8: UI/UX

### Responsive Design
- [ ] Testez sur mobile (DevTools → iPhone/Android)
- [ ] Pages restent lisibles sur petit écran
- [ ] Menu ne casse pas
- [ ] Formulaire adapté au mobile

### Dark Mode (optionnel)
- Si configuré : testez mode sombre/clair

### Performance
1. Ouvrez DevTools → Lighthouse
2. Cliquez "Analyze page load"
3. Score devrait être 85+ (Performance)

---

## ⚡ Test 9: SEO

### Métadonnées
- [ ] Titre page : `Happy Humans - Coaching & Happiness Design`
- [ ] Description : visible dans Google
- [ ] OG tags pour partage réseaux

### Sitemap
- [ ] Visitez `http://localhost:3000/sitemap.xml`
- [ ] Doit contenir toutes les pages + articles blog
- [ ] Format XML valide

### Robots.txt
- [ ] Visitez `http://localhost:3000/robots.txt`
- [ ] Autorise `/` et `/blog`
- [ ] Bloque `/admin` et `/api`

---

## 🚀 Test 10: Build Production

```bash
npm run build
npm start
```

- [ ] Build complète sans erreurs
- [ ] `npm start` lance le serveur de production
- [ ] Toutes les pages chargent
- [ ] Pas de warnings en console (F12)

---

## 📝 Résumé

✅ **Avant déploiement Vercel, testez** :
- [ ] Toutes les pages s'ouvrent
- [ ] Formulaire contact sauvegarde + admin l'affiche
- [ ] Calendly s'affiche
- [ ] Build de production réussit
- [ ] Pas d'erreurs en DevTools

**Estimated time** : 15-20 min

**Questions ?** Vérifiez README.md ou DEPLOYMENT_GUIDE.md
