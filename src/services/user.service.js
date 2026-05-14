import api from './api'

export const userService = {
  /**
   * Liste tous les utilisateurs (admin)
   * @param {{ page?: number, limit?: number, search?: string }} params
   */
  async getAll(params = {}) {
    return api.get('/users', { params })
  },

  /**
   * Récupère un utilisateur par ID
   * @param {string|number} id
   */
  async getById(id) {
    return api.get(`/users/${id}`)
  },

  /**
   * Met à jour le profil
   * @param {string|number} id
   * @param {Object} data
   */
  async update(id, data) {
    return api.put(`/users/${id}`, data)
  },

  /**
   * Met à jour l'avatar (multipart)
   * @param {string|number} id
   * @param {File} file
   */
  async updateAvatar(id, file) {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.patch(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * Supprime un utilisateur
   * @param {string|number} id
   */
  async delete(id) {
    return api.delete(`/users/${id}`)
  },

  /**
   * Change le mot de passe
   * @param {string|number} id
   * @param {{ currentPassword: string, newPassword: string }} data
   */
  async changePassword(id, data) {
    return api.patch(`/users/${id}/password`, data)
  },
}
