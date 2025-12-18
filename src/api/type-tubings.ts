import type { TypeTubingResponse } from '@/types/api'
import { apiClient } from './client'

const TYPE_TUBING_ENDPOINT = '/type_tubings'

export const TypeTubingService = {
  getAll: async (): Promise<TypeTubingResponse[]> => {
    const response = await apiClient.get(TYPE_TUBING_ENDPOINT)
    return response.data
  },
}