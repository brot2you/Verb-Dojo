VERB DOJO — ANIME ADVENTURE V2
================================

IMPORTANT : Cette version est une refonte de présentation, PAS une réécriture de l'application.
Pour éviter de perdre les verbes, les cinq modes de quiz, le Memory, les badges et les données
localStorage, elle utilise une COPIE INCHANGÉE de ton index.html actuel appelée core.html.

INSTALLATION DANS LE DÉPÔT GITHUB brot2you/Verb-Dojo
--------------------------------------------------
1. Ouvre le dépôt GitHub et TÉLÉCHARGE l'ancien index.html (ou garde-en une copie de sauvegarde).
2. RENOMME cette copie « core.html » et ajoute-la à la racine du dépôt.
3. Dépose à la racine les fichiers index.html, shell.css, shell.js, dojo-theme.css du ZIP.
4. Dépose le dossier « assets » avec son image à la racine.
5. Commit les modifications. GitHub Pages ouvrira ensuite le nouveau index.html.

Arborescence finale :
/ index.html            <- nouvel écran V2
/ core.html             <- ancien index.html, INCHANGÉ (à fournir depuis ton dépôt)
/ shell.css
/ shell.js
/ dojo-theme.css
/ assets/dojo-courtyard.jpg

ATTENTION : Ne remplace PAS ton ancien index.html avant d'en faire la copie « core.html ».
Sans core.html, la V2 affiche une indication et aucun exercice.

Fonctions préservées dans core.html :
• Accueil et carte mentale AAA / ABA / ABB / ABC
• Règles, recherche, filtres et synthèse vocale
• Memory 6 / 8 / 12 paires
• QCM prétérit, QCM participe, phrases à trous passé / perfect, saisie libre
• XP, niveaux, streaks, badges et sauvegarde « verbforge_progress_v1 »

Nouveautés V2 :
• Grand dojo peint à l'accueil, navigation premium, zones d'entraînement
• Palette japonais chaud (bois, parchemin, or, bleu nuit)
• Refondre les cartes, boutons, tableaux, quiz et Memory via CSS
• Animation de pétales, micro-son d'interface activable, adaptation mobile
• Préservation du moteur React original à l'intérieur de la nouvelle coque

NOTE TECHNIQUE
La V2 intègre le moteur dans un iframe même origine pour préserver les scripts
et l'état de l'ancien index. Le nouveau thème est injecté à son chargement.
La progression est conservée sur le même domaine GitHub Pages, via localStorage.
Cette approche fonctionne sur HTTPS GitHub Pages et ne nécessite aucun build.

Aucune donnée n'est envoyée vers un serveur tiers par la refonte.
