# GenderChain RDC — Site vitrine

Site statique (HTML/CSS/JS), sans dépendance à installer — prêt pour GitHub Pages.

## Structure
```
index.html
css/style.css
js/main.js
assets/           (logos, photos de l'équipe, logos partenaires — déjà optimisés pour le web)
```

## Déployer sur GitHub Pages (identique à la procédure du portfolio)

1. Crée un nouveau dépôt GitHub public, ex. `genderchain-rdc`.
2. Pousse **exactement** cette arborescence à la racine du dépôt (ne renomme aucun dossier :
   `css/`, `js/` et `assets/` sont référencés tels quels dans `index.html`).
3. Dans **Settings → Pages** :
   - Source = branche `main`, dossier `/root`.
   - Sauvegarde.
4. Ton site est en ligne à `https://<ton-pseudo>.github.io/genderchain-rdc/`.

## Domaine personnalisé (optionnel)

Si tu veux un sous-domaine du type `genderchain.lkb.dpdns.org` :
1. Cloudflare → zone `lkb.dpdns.org` → DNS → Add record :
   - Type **CNAME**, Name `genderchain`, Target `<ton-pseudo>.github.io` (sans `/`, sans `https://`), Proxy status DNS only le temps de la validation.
2. GitHub → Settings → Pages → Custom domain → `genderchain.lkb.dpdns.org` → Save.
3. Attends le "DNS check successful", puis coche **Enforce HTTPS**.
4. Tu peux ensuite repasser le proxy Cloudflare en orange si tu veux le CDN.

## Contenu à vérifier avant publication
- Le lien Facebook du bouton "Facebook" dans **Liens utiles** pointe vers le profil personnel d'Imara (`facebook.com/imarakabionaabel`) plutôt qu'une page Facebook dédiée à GenderChain — confirme que c'est bien voulu, ou remplace par une page GenderChain si elle existe.
- Le compte X/Twitter `@GenderChain` est référencé tel que fourni — vérifie qu'il est actif.
- Membre "Furaha Ngabo Daniella" : aucune photo fournie, un avatar avec initiales (FD) est utilisé à la place. Envoie-moi sa photo si tu veux la remplacer.
