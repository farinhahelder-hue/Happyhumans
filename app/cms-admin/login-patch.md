# CMS Admin Login Fix

Le fichier app/cms-admin/page.tsx contient un écran de login avec des caractères mal encodés.

## Texte cassé (à chercher dans page.tsx)
Remplacer :
- `AccÃ¨s rÃ©servÃ©` → `Accès réservé`
- `ðŸŒ¿ Happy Humans CMS` → `🌿 Happy Humans CMS`  
- `EntÃ©e` ou `Entrer` → garder `Entrer`
- `RÃ©servÃ©` → `Réservé`
- `AccÃ¨s` → `Accès`
- `MotÂ de passe` → `Mot de passe`
- `CrÃ©er` → `Créer`
- `TÃ©lÃ©charger` → `Télécharger`

## Solution rapide dans Cursor/VSCode
```
Find: AccÃ¨s rÃ©servÃ©
Replace: Accès réservé
```

Ou lancer en terminal depuis la racine du projet :
```bash
sed -i 's/AccÃ¨s rÃ©servÃ©/Accès réservé/g' app/cms-admin/page.tsx
sed -i 's/ðŸŒ¿/🌿/g' app/cms-admin/page.tsx
```
