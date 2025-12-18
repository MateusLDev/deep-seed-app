import type { TypeWellResponse } from '@/types/api'
import { apiClient } from './client'

const TYPE_WELL_ENDPOINT = '/type_well_targets'

export const TypeWellService = {
  getAll: async (): Promise<TypeWellResponse[]> => {
    const response = await apiClient.get(TYPE_WELL_ENDPOINT)
    return response.data
  },
}