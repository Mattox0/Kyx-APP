# Kyx

Application mobile de jeux de soirée — bientôt disponible sur iOS et Android.

Interface administrateur (Nextjs) : https://github.com/Mattox0/KYX-ADMIN

Backend (NestJS) : https://github.com/Mattox0/Kyx-BO

---

## Le projet

Kyx permet de jouer à des jeux de soirée entre amis, en local sur un seul téléphone ou en ligne dans un lobby partagé.

L'inscription est facultative — l'app est entièrement accessible sans compte. Se connecter débloque les fonctionnalités sociales (amis, parties en ligne).

---

## Jeux

### Vérité ou Défi
Questions et défis piochés aléatoirement, à tour de rôle entre les joueurs.

### Je n'ai jamais
Chaque joueur révèle ce qu'il n'a jamais fait. Ceux qui l'ont fait boivent (ou perdent un point).

### Préfères-tu
Deux options s'affrontent. Les joueurs swipent pour choisir leur camp, puis le groupe se retrouve face à face.

---

## Modes de jeu

Chaque jeu est jouable dans deux modes :

- **Local** — tous les joueurs autour du même téléphone. Les joueurs sont créés directement dans l'app, sans compte.
- **En ligne** — chaque joueur rejoint un lobby depuis son propre téléphone via un code de partie. Nécessite un compte.

---

## Fonctionnalités

- **Profil personnalisable** — pseudo et avatar généré avec DiceBear (coiffure, yeux, sourcils, bouche, lunettes, couleur de peau)
- **Système d'amis** — envoi et réception de demandes, liste d'amis
- **Lobby en temps réel** — synchronisation via WebSockets, les joueurs se rejoignent avant le lancement
- **Questions par catégorie** — les modes de jeu et questions sont gérés depuis l'interface admin

---

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Expo SDK 54 + Expo Router |
| Styling | NativeWind (Tailwind CSS) |
| Auth | Better Auth |
| Temps réel | Socket.IO |
| State serveur | TanStack React Query |
| Animations | React Native Reanimated 4 |
| Persistance locale | expo-secure-store |
| i18n | i18n-js (français) |

---

## Développement

```bash
make install          # Installer les dépendances
make start            # Démarrer le serveur de dev (API prod)
APP_ENV=dev make start  # Démarrer avec l'API locale
```

L'app nécessite un **dev client** (pas Expo Go) — voir `make install-ios` / `make install-android`.
Les builds de production se font via EAS : `make build-local-ios` / `make build-local-android`.
