-- =====================================================
-- AUDIT SQL pour Happy Humans - Supabase
-- Projet: ddwzwrhygvvavauhzdas
-- =====================================================

-- 1. VÉRIFIER LES RÉSIDUS DANS site_content
-- ----------------------------------------------
-- Trouve toutes les entrées contenant des mots liés au voyage/Heldonica

SELECT id, key, page, LEFT(value, 200) as value_preview
FROM site_content 
WHERE 
  value ILIKE '%voyage%' 
  OR value ILIKE '%carnet%'
  OR value ILIKE '%hôtel%' 
  OR value ILIKE '%hotel%'
  OR value ILIKE '%heldonica%'
  OR value ILIKE '%destination%'
  OR value ILIKE '%séjour%'
  OR value ILIKE '%héberg%'
ORDER BY page, key;


-- 2. VÉRIFIER LES PARAMÈTRES DANS site_settings
-- ----------------------------------------------

SELECT id, key, value
FROM site_settings 
WHERE 
  value ILIKE '%heldonica%'
  OR value ILIKE '%voyage%'
ORDER BY key;


-- 3. VÉRIFIER LES UTILISATEURS RÉCENTS
-- ----------------------------------------------

SELECT id, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 20;


-- =====================================================
-- REQUÊTES DE CORRECTION
-- =====================================================

-- Option A: Remplacer 'heldonica' par 'happy humans' dans site_content
-- ATTENTION: À utiliser avec précaution, vérifiez d'abord avec la requête de sélection

-- UPDATE site_content 
-- SET value = REPLACE(LOWER(value), 'heldonica', 'happy humans')
-- WHERE value ILIKE '%heldonica%';


-- Option B: Supprimer les entrées obsolètes (après vérification)
-- Remplacer 'ENTREE_ID' par l'ID réel

-- DELETE FROM site_content WHERE id IN ('ENTREE_ID_1', 'ENTREE_ID_2');


-- 4. VÉRIFIER LES ARTICLES DU BLOG
-- ----------------------------------------------

SELECT id, slug, title, category
FROM articles
WHERE 
  slug ILIKE '%voyage%'
  OR slug ILIKE '%travel%'
  OR category ILIKE '%carnet%'
ORDER BY created_at DESC;
