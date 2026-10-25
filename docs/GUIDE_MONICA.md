# Guide express — modifier le site (logo, photos, textes)

À garder sous la main. Tout se fait sur **https://happyhumans.vercel.app/cms-admin** (mot de passe de l'administration).

## 1. Changer le logo
**Le plus simple, directement sur le site** : bouton **✏️ Éditer** → en haut, **Modifier le menu et le logo** → **📷 Changer le logo**. Le logo change aussitôt. (**↩ Logo d'origine** pour revenir en arrière.)

Le **pied de page a son propre logo**, en version claire (le fond est vert foncé) : même panneau, bloc « Logo du pied de page ». Sans logo dédié, le pied de page reprend le logo de l'en-tête ; sans aucun logo, c'est le logo de la charte en crème. Dans l'administration : **⚙️ Paramètres → Logo & Identité → Logo du pied de page**.

**Pour régler la taille, la forme, la position** :
1. **⚙️ Paramètres** → **Logo & Identité**.
2. **⬆ Upload logo** → choisissez votre image. L'aperçu en haut de la page montre le résultat tel qu'il sera sur le site.
3. Réglez à votre goût :
   - **Taille** (curseur ou boutons XS → XL) ;
   - **Forme** : *Cercle* ou *Arrondi* (l'image est recadrée au carré) ou *Sans découpe* (le logo garde ses proportions : à choisir pour un logo large) ;
   - **Position** : à gauche ou centré ;
   - **Afficher le nom à côté du logo** : choisissez *Non* si votre logo contient déjà le nom « Happy Humans ».
4. Cliquez **Sauvegarder** (bouton en haut de la page). Le logo change aussi dans le pied de page.

> Si c'est encore un ancien logo qui s'affiche : dans **Logo & Identité**, cliquez la croix rouge ✕ à côté de l'adresse du logo, puis **Sauvegarder** : le logo de la charte revient.
>
> Conseil : un PNG à fond transparent, d'au moins 200 × 200 px, donne le meilleur rendu. Pour revenir au logo d'origine : cliquez la croix rouge ✕ à côté de l'adresse de l'image, puis **Sauvegarder**.

## 2. Changer une photo
**Le plus simple, directement sur le site** : bouton **✏️ Éditer** → sur chaque photo, un bouton **📷 Changer la photo** apparaît (coin en haut à droite) → choisissez la photo → **Enregistrer le brouillon** → **Publier**.

**Ou dans l'administration** :
1. **🗂️ Pages** → choisissez la page (Accueil, Coaching, À propos, Relations, Sparring partner, Happiness Design, FAQ, Blog…).
2. Ouvrez le bloc **Hero** (ou le bloc qui contient « Photo de fond », « Photo Monica », « Image »…). Chaque photo actuelle s'y affiche.
3. **⬆️ Upload** → choisissez la nouvelle photo (ou **Médiathèque** pour réutiliser une photo déjà envoyée). Un message « Image envoyée ✓ » confirme l'envoi.
4. **Enregistrer le brouillon**, puis **Publier** : la photo est alors en ligne.

> Les grosses photos (téléphone, appareil photo) sont **réduites automatiquement** avant l'envoi : inutile de les retoucher. Formats acceptés : JPG, PNG, WebP, GIF, SVG (les photos HEIC d'iPhone doivent d'abord être exportées en JPG).
> **Effet vert et or** : les photos de fond et d'illustration (pas les portraits) sont teintées aux couleurs de la charte. Pour les voir en couleurs naturelles : **⚙️ Paramètres → Thème & Couleurs → Effet duotone sur les photos → Non**, puis **Sauvegarder** (visible au prochain rechargement de la page).
> Pour remettre la photo d'origine : cliquez la croix rouge sur la photo, puis enregistrez et publiez.

## Changer un nom du menu (ex. « Organisations » → « Entreprises »), l'ordre, ajouter ou masquer un lien
**Directement sur le site** : **✏️ Éditer** → **Modifier le menu et le logo**.
- **Glissez ⠿** un lien pour changer l'ordre ;
- cliquez dans le **nom** pour le modifier, dans l'**adresse** pour changer la page visée ;
- **👁️** masque ou affiche un lien, **🗑** le supprime, **➕ Ajouter un lien** en crée un ;
- **💾 Enregistrer le menu** : le changement est visible tout de suite sur le site.

Même éditeur dans l'administration : onglet **🧭 Menu**. Le bas de page (liste « Navigation » du pied de page) se modifie dans **🗂️ Pages → Footer**.

**Verrouiller l'ordre du menu** : en haut de l'éditeur (onglet **🧭 Menu**), un interrupteur **🔒 Ordre du menu verrouillé**. Activé, le glisser-déposer est désactivé : plus personne ne peut déplacer un lien par erreur. Renommer, masquer, ajouter ou supprimer un lien reste possible. Pensez à **💾 Enregistrer le menu**.

## 3. Changer un texte
- **Directement sur le site** : bouton **✏️ Éditer le site** (en haut de l'administration), puis cliquez sur le texte à modifier.
- **Ou page par page** : **🗂️ Pages** → la page → le champ (la barre de recherche en haut retrouve un champ par un mot).
- Dans les deux cas : **Enregistrer le brouillon**, relire, puis **Publier**. Un brouillon n'est visible que de vous (bouton **👁 Voir le brouillon**).

## 3 bis. Modifier les textes de l'espace client (connexion, inscription, tableau de bord)
Onglet **🔐 Espace client**.
- **Connexion** (`/auth/login`) : titre, sous-titre, libellés des champs, texte du bouton, phrase « Pas encore de compte ? ».
- **Inscription** (`/auth/register`) : même chose, plus les messages d'erreur (« mot de passe trop court », « les mots de passe ne correspondent pas ») et le message de confirmation.
- **Espace client** (`/dashboard`) : titre de bienvenue, cartes « Tes ressources », bloc « Continuer ton parcours », boutons, et l'**adresse email de contact** affichée en bas.
- **Enregistrer le brouillon** puis **Publier**, comme pour les autres pages.

> Le prénom du visiteur est ajouté automatiquement après « Bienvenue ». L'encadré « Supabase non configuré » ne s'affiche que sur une installation sans base de données : inutile de le modifier sur le site en ligne.

## 3 ter. Les 7 outils de Happiness Design
Onglet **☀️ Happiness Design** → bloc **Outils** → champs **Outil 1** à **Outil 7** (titre, description, texte alternatif de l'image).
- Le **texte alternatif** est lu par les lecteurs d'écran et par Google à la place de l'image : décrivez ce que montre le visuel.
- Le mot affiché devant le numéro (« Outil 1 », « Outil 2 »…) se change une fois pour les sept, champ **« Petit label devant le numéro »**.
- Les images, elles, viennent du **pack d'illustrations** (⚙️ Paramètres → Thème), pas de ce bloc.

## 3 quater. Créer une nouvelle page (adresse, texte, blocs)
**📄 Pages libres** (dans le menu de l'administration) → **➕ Nouvelle page**.
1. **Nom de la page** : le titre affiché en haut de la page.
2. **Adresse** : se remplit toute seule à partir du nom (`/p/ateliers`). Modifiable, en minuscules et tirets. Si l'adresse est déjà prise, un numéro est ajouté automatiquement.
3. **Accroche** : les quelques lignes sous le titre.
4. **Sections de la page** : ajoutez autant de blocs que nécessaire (titre + texte + image, texte, image, appel à l'action, citation) et déplacez-les avec ▲ ▼.
5. **Référencement Google** : titre et description dans Google, image de partage.
6. **En ligne / Hors ligne** (interrupteur en haut à droite) : hors ligne, la page existe mais personne ne la voit — pratique pour la préparer.
7. **💾 Enregistrer**, puis **🔗 Voir la page**.

Pour mettre un lien vers cette page dans le menu : **🧭 Menu** → **➕ Ajouter un lien** → nom (ex. « Ateliers ») et adresse `/p/ateliers` → **💾 Enregistrer le menu**.

> ⚠️ Une page libre s'enregistre directement (pas de brouillon) : elle est en ligne dès que l'interrupteur « En ligne » est activé.

## 3 quinquies. Le fil d'Ariane (« Accueil › Coaching individuel »)
Onglet **🔗 Fil d'Ariane**.
- L'interrupteur du haut affiche ou masque le fil **sur tout le site** (il n'apparaît jamais sur l'accueil).
- Chaque champ est le texte d'un maillon, page par page. Exemple : remplacer « Monica » par « À propos » pour la page `/a-propos`.
- L'adresse de chaque maillon est automatique ; vous ne changez que le texte affiché.
- **💾 Enregistrer le brouillon** puis **🚀 Publier** — comme pour les autres pages.

## 3 sexies. Changer l'adresse de réservation, l'email affiché, les objets d'e-mails
Onglet **⚙️ Paramètres** :
- **📅 Réservation (Calendly)** : l'**adresse de votre compte Calendly** (ex. `https://calendly.com/happyhumans-coaching`) et le **nom du rendez-vous** pour chaque service (coaching, Happiness Design, sparring, entreprises, relations). Modifier ici change **tous les boutons de réservation du site** et l'agenda de la page « Réserver » — aucun code à toucher.
- **🌍 Général → Email de contact** : l'adresse affichée en bas du site et dans les messages envoyés aux visiteurs.
- **📧 Emails automatiques** : l'**objet** des messages reçus par les visiteurs (confirmation de séance, accusé de contact) et celui de vos notifications. `{name}` est remplacé par le nom du visiteur.

Cliquez **💾 Sauvegarder** en bas de la page. Délai d'affichage : ~30 secondes.

> Si vous changez de compte Calendly, pensez à vérifier chaque rendez-vous : l'adresse finale est `compte/nom-du-rendez-vous`.

## 4. Réorganiser ou masquer des sections d'une page
**🗂️ Pages** → la page → bloc **Structure** : flèches ↑ ↓ pour changer l'ordre, bouton **Masquer / Afficher** pour retirer ou remettre une section. Puis enregistrer et publier.

## 5. Si quelque chose ne marche pas
| Ce que vous voyez | Que faire |
|---|---|
| « Votre session a expiré » | Reconnectez-vous à l'administration, puis recommencez. |
| « Image trop lourde » / « Format non pris en charge » | Utilisez une image JPG ou PNG. |
| Le changement n'apparaît pas sur le site | Attendez ~30 secondes puis rechargez la page avec **Ctrl + F5** (Cmd + Maj + R sur Mac). |
| Un texte ou une photo a été écrasé par erreur | **🗂️ Pages** → la page → **🕘 Historique** → **↩ Restaurer** : chaque ancienne valeur d'un champ est conservée. |

## Avant la présentation
- Faites vos changements **la veille**, puis ouvrez le site dans une fenêtre de navigation privée pour voir ce que verront les visiteurs.
- Le **mode maintenance** (⚙️ Paramètres) permet de masquer le site pendant que vous travaillez : vous continuez à le voir, pas les visiteurs.
