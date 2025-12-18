import { apiClient } from './client'

const RESERVOIRS_ENDPOINT = '/reservoirs'

export const reservoirsApi = {
  // Adicione suas funções conforme necessário
  getAll: async () => {
    const response = await apiClient.get(RESERVOIRS_ENDPOINT)
    return response.data
  },
}