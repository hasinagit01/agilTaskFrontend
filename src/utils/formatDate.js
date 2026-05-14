/**
 * Formate une date en chaîne lisible
 * @param {string|Date} date
 * @param {string} locale
 * @returns {string}
 */
export function formatDate(date, locale = 'fr-FR') {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date))
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(date, locale = 'fr-FR') {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Retourne le temps relatif (ex: "il y a 3 heures")
 */
export function timeAgo(date, locale = 'fr-FR') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diff = (new Date(date) - Date.now()) / 1000

  const units = [
    { unit: 'year',   seconds: 31536000 },
    { unit: 'month',  seconds: 2592000  },
    { unit: 'week',   seconds: 604800   },
    { unit: 'day',    seconds: 86400    },
    { unit: 'hour',   seconds: 3600     },
    { unit: 'minute', seconds: 60       },
    { unit: 'second', seconds: 1        },
  ]

  for (const { unit, seconds } of units) {
    if (Math.abs(diff) >= seconds) {
      return rtf.format(Math.round(diff / seconds), unit)
    }
  }
  return 'à l\'instant'
}
