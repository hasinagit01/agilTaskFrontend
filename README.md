# Agil Task — Frontend

Interface Kanban développée avec **Vue 3**, **Vuetify 3** et **Pinia**.

---

## Sommaire

- [Stack & dépendances](#stack--dépendances)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer l'application](#lancer-lapplication)
- [Scripts disponibles](#scripts-disponibles)
- [Architecture](#architecture)
- [Services API](#services-api)
- [Stores Pinia](#stores-pinia)
- [Composables](#composables)
- [Validation de formulaires](#validation-de-formulaires)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Thème](#thème)
- [Tests](#tests)

---

## Stack & dépendances

### Dépendances principales

| Package | Version | Rôle |
|---------|---------|------|
| `vue` | ^3.4 | Framework UI |
| `vuetify` | ^3.5 | Bibliothèque de composants Material Design |
| `pinia` | ^2.1 | Gestion d'état |
| `pinia-plugin-persistedstate` | ^3.2 | Persistance du store auth en localStorage |
| `vue-router` | ^4.3 | Routage SPA |
| `axios` | ^1.6 | Client HTTP |
| `vee-validate` | ^4.15 | Gestion de l'état des formulaires |
| `@vee-validate/zod` | ^4.15 | Adaptateur Zod pour vee-validate |
| `zod` | ^3.25 | Validation de schémas |

### Dépendances de développement

| Package | Rôle |
|---------|------|
| `vite` | Build tool |
| `@vitejs/plugin-vue` | Support Vue dans Vite |
| `vite-plugin-vuetify` | Auto-import des composants Vuetify |
| `vitest` | Test runner |
| `@vue/test-utils` | Utilitaires de test pour composants Vue |
| `jsdom` | Environnement DOM pour les tests |
| `@vitest/coverage-v8` | Rapport de couverture de code |
| `sass` | Préprocesseur CSS |

---

## Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Backend Agil Task démarré sur `http://localhost:8000`

---

## Installation

```bash
npm install
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine du dossier `frontend/` :

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Agil Task
```

Ces variables sont accessibles dans le code via `import.meta.env.VITE_*`.

---

## Lancer l'application

```bash
npm run dev
```

L'application démarre sur **http://localhost:5173**

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement avec hot-reload |
| `npm run build` | Compile pour la production dans `dist/` |
| `npm run preview` | Prévisualise le build de production |
| `npm run test` | Lance les tests en mode watch |
| `npm run test:run` | Lance les tests une seule fois |
| `npm run coverage` | Génère un rapport de couverture HTML dans `coverage/` |

---

## Architecture

```
src/
├── __tests__/          # Tests Vitest (schemas, stores, router)
├── assets/
│   └── styles/         # CSS global (main.css)
├── components/
│   ├── board/          # Composants Kanban
│   │   ├── KanbanCard.vue
│   │   ├── KanbanColumn.vue
│   │   ├── CardDetailModal.vue
│   │   └── MemberModal.vue
│   ├── common/         # Composants réutilisables
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   └── NotificationStack.vue
│   └── layout/         # Composants de mise en page
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       └── AppFooter.vue
├── composables/        # Logique réutilisable (hooks)
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useTheme.js
├── constants/          # Constantes applicatives
│   └── index.js
├── layouts/            # Gabarits de pages
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── pages/              # Pages (une par route)
│   ├── Home.vue
│   ├── BoardDetail.vue
│   ├── Profile.vue
│   ├── Settings.vue
│   ├── About.vue
│   ├── NotFound.vue
│   ├── Error.vue
│   └── auth/
│       ├── Login.vue
│       └── Register.vue
├── router/
│   └── index.js        # Routes + guards de navigation
├── schemas/            # Schémas de validation Zod
│   └── auth.schema.js
├── services/           # Clients API Axios
│   ├── api.js          # Instance Axios + intercepteurs
│   ├── auth.service.js
│   ├── board.service.js
│   ├── column.service.js
│   ├── card.service.js
│   ├── label.service.js
│   ├── member.service.js
│   ├── assignee.service.js
│   └── user.service.js
├── stores/             # Stores Pinia
│   ├── auth.store.js
│   ├── board.store.js
│   ├── column.store.js
│   ├── card.store.js
│   ├── label.store.js
│   ├── member.store.js
│   └── notification.store.js
├── utils/
│   └── date.js         # Utilitaires de formatage et calcul de dates
├── App.vue
└── main.js
```

---

## Services API

Tous les services utilisent l'instance Axios centralisée dans `services/api.js`.

### Instance Axios (`services/api.js`)

- **Base URL** : `VITE_API_URL` (`.env`)
- **Timeout** : 10 secondes
- **Intercepteur de requête** : injecte automatiquement le token JWT dans le header `Authorization: Bearer <token>`
- **Intercepteur de réponse** : gère les erreurs HTTP globalement

| Code HTTP | Comportement automatique |
|-----------|--------------------------|
| `401` | Efface l'auth + redirige vers `/login` (avec verrou anti-doublons) |
| `403` | Redirige vers `/error?code=403` |
| `404` | Redirige vers `/not-found` |
| `5xx` | Redirige vers `/error?code=500` |
| Pas de réponse | Redirige vers `/error?code=network` |

### Services disponibles

| Fichier | Méthodes principales |
|---------|---------------------|
| `auth.service.js` | `login()`, `register()`, `logout()` |
| `board.service.js` | `getAll()`, `getById()`, `create()`, `update()`, `remove()` |
| `column.service.js` | `getAll()`, `create()`, `update()`, `remove()`, `reorder()` |
| `card.service.js` | `getAll()`, `create()`, `update()`, `remove()`, `move()`, `reorder()` |
| `label.service.js` | `getAll()`, `create()`, `update()`, `remove()`, `attach()`, `detach()` |
| `member.service.js` | `getAll()`, `add()`, `updateRole()`, `remove()` |
| `assignee.service.js` | `assign()`, `unassign()` |
| `user.service.js` | `search()`, `getById()`, `update()` |

---

## Stores Pinia

| Store | État principal | Persisté |
|-------|----------------|---------|
| `auth.store` | `user`, `token`, `loading` | Oui (`user` + `token` en localStorage) |
| `board.store` | `boards[]`, `currentBoard` | Non |
| `column.store` | `columns[]` | Non |
| `card.store` | `cardsByColumn{}` (indexé par `column_id`) | Non |
| `label.store` | `labels[]` | Non |
| `member.store` | `members[]` | Non |
| `notification.store` | `notifications[]` | Non |

### Gestion des erreurs dans les stores

Chaque action store catch les erreurs et appelle `useNotificationStore().error(message)` pour afficher un toast. Les erreurs ne se propagent pas aux appelants — les fonctions retournent `null` ou `false` en cas d'échec.

### Réinitialisation

Les stores `column`, `card`, `label` et `member` exposent une méthode `reset()` appelée dans `BoardDetail.vue` via `onUnmounted` pour éviter les données stale entre navigations.

---

## Composables

### `useAuth`
Encapsule les actions d'authentification avec la gestion de la redirection post-login.

```js
const { login, register, logout, isLoggedIn, currentUser, loading } = useAuth()
```

- `login(credentials)` : connecte et redirige vers `/` (ou l'URL dans `?redirect=`)
- `register(userData)` : inscrit et redirige vers `/`
- `logout()` : déconnecte et redirige vers `/login`

### `useFetch`
Composable générique pour les requêtes GET avec gestion du loading/error.

```js
const { data, loading, error, execute } = useFetch('/boards/', { immediate: true })
```

### `useMutation`
Composable générique pour les mutations (POST, PUT, DELETE).

```js
const { mutate, loading, error } = useMutation((id) => boardService.remove(id))
const result = await mutate(boardId)  // { success: boolean, data?, error? }
```

### `useTheme`
Gère le thème clair/sombre avec persistance en localStorage.

```js
const { isDark, toggleTheme, setTheme } = useTheme()
```

---

## Validation de formulaires

Les formulaires utilisent **vee-validate** avec des schémas **Zod** définis dans `src/schemas/`.

### Schémas disponibles (`src/schemas/auth.schema.js`)

```js
// Connexion
loginSchema     // email + password (min 6 caractères)

// Inscription
registerSchema  // email + password (≥8 chars, maj, min, chiffre) + confirmPassword
```

### Pattern d'utilisation dans un composant

```js
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@/schemas/auth.schema'

const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

// vuetifyConfig injecte error-messages dans les composants Vuetify
const vuetifyConfig = (state) => ({ props: { 'error-messages': state.errors } })

const [email, emailProps]       = defineField('email',    vuetifyConfig)
const [password, passwordProps] = defineField('password', vuetifyConfig)

// handleSubmit n'exécute le callback QUE si le formulaire est valide
const onSubmit = handleSubmit(async (values) => { ... })
```

```html
<BaseInput v-model="email" v-bind="emailProps" label="Email" type="email" />
```

---

## Gestion des erreurs

### Notifications toast (`notification.store.js`)

```js
const notifStore = useNotificationStore()

notifStore.success('Board créé !')          // vert, 4s
notifStore.error('Erreur de connexion')     // rouge, 6s
notifStore.warning('Session bientôt expirée') // orange, 5s
notifStore.info('Mise à jour disponible')   // bleu, 4s
```

Les notifications s'affichent en haut à droite via `NotificationStack.vue`, intégré dans `DefaultLayout.vue`.

### Pages d'erreur

| Route | Déclenchement |
|-------|---------------|
| `/not-found` | Ressource introuvable (404) ou route inconnue |
| `/error?code=403` | Accès refusé (403) |
| `/error?code=500` | Erreur serveur (5xx) |
| `/error?code=network` | Pas de réponse du serveur |

---

## Thème

Le thème clair/sombre est géré via Vuetify et `useTheme`. La préférence est persistée dans `localStorage` sous la clé `app_theme`.

La détection automatique du thème système (`prefers-color-scheme`) s'applique au premier chargement si aucune préférence n'est sauvegardée.

---

## Tests

Les tests utilisent **Vitest** + **@vue/test-utils** avec un environnement **jsdom**.

### Lancer les tests

```bash
npm run test        # watch mode
npm run test:run    # passage unique
npm run coverage    # rapport HTML dans coverage/
```

### Structure des tests

```
src/__tests__/
├── setup.js                       # Nettoyage du localStorage entre chaque test
├── schemas/
│   └── auth.schema.test.js        # 10 tests — validation Zod (login + register)
├── stores/
│   ├── auth.store.test.js         # 12 tests — login, clearAuth, isLoggedIn
│   └── board.store.test.js        # 9 tests  — fetchBoards, create, update, remove
└── router/
    └── guards.test.js             # 8 tests  — requiresAuth, guestOnly, public
```

### Conventions

- **Stores** : `setActivePinia(createPinia())` dans chaque `beforeEach` pour isoler les tests
- **Services** : mockés via `vi.mock('@/services/...')` — les tests ne font pas d'appels réseau
- **`notification.store`** : toujours mocké dans les tests de stores pour éviter les effets de bord
- **Router guards** : testés avec un router minimal en mémoire (`createWebHashHistory`) sans lazy-loading
