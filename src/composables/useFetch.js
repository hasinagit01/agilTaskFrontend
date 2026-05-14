import { ref, shallowRef } from 'vue'
import api from '@/services/api'

/**
 * Composable générique pour les requêtes GET
 * @param {string|Ref<string>} url
 * @param {Object} options
 */
export function useFetch(url, options = {}) {
  const data    = shallowRef(options.initialValue ?? null)
  const error   = ref(null)
  const loading = ref(false)

  const execute = async (params = {}) => {
    loading.value = true
    error.value   = null
    try {
      const resolvedUrl = typeof url === 'function' ? url() : url
      data.value = await api.get(resolvedUrl, { params: { ...options.params, ...params } })
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (options.immediate !== false) {
    execute()
  }

  return { data, error, loading, execute, refresh: execute }
}

/**
 * Composable pour les mutations (POST, PUT, DELETE)
 * @param {Function} mutationFn
 */
export function useMutation(mutationFn) {
  const data    = shallowRef(null)
  const error   = ref(null)
  const loading = ref(false)

  const mutate = async (...args) => {
    loading.value = true
    error.value   = null
    try {
      data.value = await mutationFn(...args)
      return { success: true, data: data.value }
    } catch (e) {
      error.value = e
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, mutate }
}
