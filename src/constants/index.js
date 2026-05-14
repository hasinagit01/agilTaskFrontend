// ===== App =====
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Mon App'
export const API_URL  = import.meta.env.VITE_API_URL  || '/api'

// ===== Routes =====
export const ROUTES = {
  HOME:     '/',
  ABOUT:    '/about',
  LOGIN:    '/login',
  REGISTER: '/register',
  PROFILE:  '/profile',
  SETTINGS: '/settings',
}

// ===== Storage keys =====
export const STORAGE_KEYS = {
  TOKEN:      'auth_token',
  USER:       'auth_user',
  THEME:      'app_theme',
  AUTH_STORE: 'auth',
}

// ===== Statuts HTTP =====
export const HTTP_STATUS = {
  OK:           200,
  CREATED:      201,
  BAD_REQUEST:  400,
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  SERVER_ERROR: 500,
}

// ===== Rôles utilisateur =====
export const USER_ROLES = {
  ADMIN: 'admin',
  USER:  'user',
  GUEST: 'guest',
}

// ===== Messages snackbar =====
export const MESSAGES = {
  LOGIN_SUCCESS:    'Connexion réussie !',
  LOGOUT_SUCCESS:   'Déconnexion réussie.',
  REGISTER_SUCCESS: 'Compte créé avec succès !',
  SAVE_SUCCESS:     'Enregistré avec succès.',
  ERROR_GENERIC:    'Une erreur est survenue. Veuillez réessayer.',
  ERROR_NETWORK:    'Erreur réseau. Vérifiez votre connexion.',
}
