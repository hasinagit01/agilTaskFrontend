// ===== App =====
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Mon App'
export const API_URL  = import.meta.env.VITE_API_URL  || '/api'

// ===== Routes =====
export const ROUTES = {
  HOME:     '/',
  LOGIN:    '/login',
  REGISTER: '/register',
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
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  SERVER_ERROR: 500,
}

// ===== Messages snackbar =====
export const MESSAGES = {
  LOGIN_SUCCESS:    'Connexion réussie !',
  LOGOUT_SUCCESS:   'Déconnexion réussie.',
  REGISTER_SUCCESS: 'Compte créé avec succès !',
  ERROR_GENERIC:    'Une erreur est survenue. Veuillez réessayer.',
}
