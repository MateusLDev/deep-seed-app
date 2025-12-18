import type { TypeFunctionResponse } from '@/types/api'
import { apiClient } from './client'

const TYPE_FUNCTION_ENDPOINT = '/type_functions'

export const TypeFunctionService = {
  getAll: async (): Promise<TypeFunctionResponse[]> => {
    const response = await apiClient.get(TYPE_FUNCTION_ENDPOINT)
    return response.data
  },
}