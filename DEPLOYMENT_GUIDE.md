# 🚀 Guide de Déploiement - Phase 3 Complete

## Étapes avant production

### 1. Créer la table `contact_submissions` dans Supabase

1. Ouvrez [Supabase Console](https://app.supabase.com)
2. Allez dans **SQL Editor**
3. Exécutez le contenu de `migrations/003_contact_submissions.sql`

**Raccourci** : Copiez et exécutez ceci :

```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow visitors to create submissions"
  ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
```

### 2. Configurer les variables d'environnement

Créez `.env.local` avec :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Analytics (optionnel)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=happyhumans.fr
```

### 3. Configurer Calendly

1. Allez sur [Calendly](https://calendly.com)
2. Créez un événement "Séance Découverte 30min"
3. Générez l'URL d'embed (ex: `https://calendly.com/monica-schneider/30min`)
4. Mettez à jour cette URL dans `app/contact/page.tsx` ligne 142

### 4. Configurer Plausible Analytics (optionnel)

1. Allez sur [Plausible](https://plausible.io)
2. Inscrivez votre site `happyhumans.fr`
3. Définissez la variable d'env `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

Plausible commencera à tracker les visites automatiquement.

### 5. Test en local

```bash
npm install
npm run dev
```

Visitez :
- `http://localhost:3000` → Accueil
- `http://localhost:3000/contact` → Formulaire contact + Calendly
- `http://localhost:3000/admin/contacts` → Admin (messages)

Testez le formulaire → doit sauvegarder dans Supabase.

### 6. Build de production

```bash
npm run build
npm start
```

Vérifiez qu'il n'y a pas d'erreurs.

## Déploiement sur Vercel

### Configuration Vercel

1. **Connectez votre repo GitHub** à Vercel
   - https://vercel.com/new
   - Sélectionnez le repo Happy Humans
   - Framework: Next.js (auto-détecté)

2. **Configurez les env vars** :
   - Dashboard Vercel → Settings → Environment Variables
   - Ajoutez :
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_KEY
     NEXT_PUBLIC_PLAUSIBLE_DOMAIN
     ```

3. **Déployez** :
   ```bash
   git push origin main
   ```
   Vercel build automatiquement.

### URL de production

Après déploiement :
- `https://happy-humans.vercel.app` (preview)
- `https://happyhumans.fr` (avec domaine personnalisé)

## Post-déploiement

### 1. Vérifier les fonctionnalités

- [ ] Page d'accueil charge
- [ ] Blog liste les 3 articles
- [ ] Formulaire contact envoie et sauvegarde
- [ ] Calendly s'affiche sur `/contact`
- [ ] Footer est visible (check `show-in-footer` toggle)
- [ ] Plausible dashboard reçoit les hits

### 2. Configurer le domaine personnalisé

Dans Vercel → Settings → Domains :
```
happyhumans.fr → CNAME → cname.vercel-dns.com
```

Puis chez votre registraire (Godaddy, Namecheap, etc.) :
```
CNAME happyhumans.fr → cname.vercel-dns.com
```

Attendre ~15-30min que la DNS se propage.

### 3. SSL / HTTPS

Vercel gère automatiquement (Let's Encrypt).

### 4. Analytics & Monitoring

- **Plausible** : Consultez les stats sur plausible.io/happyhumans.fr
- **Vercel** : Monitoring automatique (Analytics tab)
- **Supabase** : Consultez les contacts reçus dans la table

## Roadmap Phase 4 (optionnel)

- [ ] Page /about détaillée
- [ ] Système de newsletter (Convertkit)
- [ ] Intégration email (Resend)
- [ ] Page de tarifs dynamiques
- [ ] Blog search

## Support

- Questions ? contact@happyhumans.fr
- Code ? Consultez README.md
