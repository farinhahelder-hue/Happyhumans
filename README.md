# Happy Humans - Site Web Monica Schneider

Site Next.js + Supabase CMS pour coaching exécutif et Happiness Design.

## ✨ Caractéristiques

### Phase 1 ✅ Dashboard & Migration
- Dashboard santé base (status Supabase, alertes)
- Migrations SQL appliquées (tables blog, historique, settings)

### Phase 2 ✅ CMS & Contenu
- Éditeur d'articles avec aperçu live
- Historique restaurable (sans expiration automatique)
- 3 brouillons d'articles coaching
- SEO complet : sitemap, robots.txt, metadata, schema.org
- Champs SEO par article (titre, description, image OG)

### Phase 3 ✅ Sections & Pages
- **Sections réordonnables** sur /coaching et /entreprises
- **Toggles footer** câblés sur Header/Footer
- Configuration via CMS (cms_settings_kv)
- Duplication d'articles depuis l'admin

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Compte Supabase (gratuit : https://supabase.com)

### Installation
```bash
npm install
```

### Configuration
Créez `.env.local` à partir de `.env.example` :
```bash
cp .env.example .env.local
```

Remplissez avec vos clés Supabase (depuis https://app.supabase.com/project/[ID]/settings/api).

### Développement
```bash
npm run dev
```

Ouvrez http://localhost:3000.

### Build & Production
```bash
npm run build
npm start
```

## 📁 Structure

```
app/
├── coaching/page.tsx        # Page coaching avec sections réordonnables
├── entreprises/page.tsx     # Page entreprises (idem)
├── blog/
│   └── [slug]/page.tsx      # Articles de blog (via Supabase)
├── api/
│   ├── public/config/       # GET /api/public/config (toggles footer)
│   └── admin/page-order/    # PUT /api/admin/page-order (reorder sections)
└── layout.tsx               # Layout global (Header + Footer)

components/
├── Header.tsx               # Navigation + charge toggles footer
├── Footer.tsx               # Pied de page (conditionnel)
└── ReorderableSections.tsx  # Composant drag-drop pour sections

lib/
└── config.ts                # PAGES_CONFIG, VISIBILITY_DEFAULTS
```

## 🔧 Toggles & Configuration

### Dans le CMS Supabase (`cms_settings_kv`) :
- `show-in-footer` (bool) → affiche le Footer
- `show-in-menu` (bool) → affiche les liens menu
- `page-sections-order-coaching` (JSON array) → ordre des sections /coaching
- `page-sections-order-entreprises` (JSON array) → ordre des sections /entreprises

### Modifier via API
```bash
# Afficher le footer
POST /api/admin/settings
{
  "key": "show-in-footer",
  "value": true
}

# Réordonner les sections de /coaching
PUT /api/admin/page-order
{
  "pageId": "coaching",
  "order": ["hero", "programs", "testimonials", "faq", "cta"]
}
```

## 📊 Historique & Restauration

Chaque modification de contenu est journalisée dans `site_content_history` :
- `content_type` : "blog_post", "page_config", "setting"
- `action` : "create", "update", "delete"
- `old_value` / `new_value` : avant/après (JSON)
- `changed_by` : "admin", "api", "user"

**API Restauration** (en admin) :
```bash
POST /api/admin/restore
{
  "historyId": "uuid-of-entry"
}
```

## 🔐 Sécurité

- RLS activé sur toutes les tables
- Administrateur uniquement pour modifications CMS
- Service key côté serveur (jamais en client)
- Anon key pour lecture publique

## 📈 Roadmap Phase 4+

- [ ] Page /about détaillée avec timeline
- [ ] Système de réservation (Calendly intégré)
- [ ] Newsletter (Convertkit)
- [ ] Analytics (Plausible ou Fathom)
- [ ] Système de testimonials interactifs

## 🤝 Support

Questions ? Ouvrez un issue ou contactez monica.schneider@hotmail.fr
