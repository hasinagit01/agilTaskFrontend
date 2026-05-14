/**
 * Règles de validation pour les formulaires Vuetify
 * Chaque règle retourne true si valide, ou un message d'erreur string
 */

export const rules = {
  required: (v) => (v !== null && v !== undefined && v !== '') || 'Ce champ est obligatoire.',

  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide.',

  minLength: (min) => (v) =>
    (v && v.length >= min) || `Minimum ${min} caractères.`,

  maxLength: (max) => (v) =>
    !v || v.length <= max || `Maximum ${max} caractères.`,

  password: (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v) ||
    'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.',

  confirmPassword: (password) => (v) =>
    v === password || 'Les mots de passe ne correspondent pas.',

  phone: (v) =>
    !v || /^[+]?[\d\s\-()]{8,15}$/.test(v) || 'Numéro de téléphone invalide.',

  url: (v) =>
    !v || /^https?:\/\/.+\..+/.test(v) || 'URL invalide.',

  positiveNumber: (v) =>
    (!v || Number(v) > 0) || 'Doit être un nombre positif.',

  integer: (v) =>
    (!v || Number.isInteger(Number(v))) || 'Doit être un entier.',
}

/**
 * Valide un objet de données selon un schéma de règles
 * @param {Object} data
 * @param {Object} schema
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validate(data, schema) {
  const errors = {}
  for (const [field, fieldRules] of Object.entries(schema)) {
    for (const rule of fieldRules) {
      const result = rule(data[field])
      if (result !== true) {
        errors[field] = result
        break
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
