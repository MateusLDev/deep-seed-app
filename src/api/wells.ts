import { apiClient } from './client'

const WELLS_ENDPOINT = '/wells'

export const wellsApi = {
  // Adicione suas funções conforme necessário
  getAll: async () => {
    const response = await apiClient.get(WELLS_ENDPOINT)
    return response.data
  },
}