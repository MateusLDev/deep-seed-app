import { apiClient } from './client'
import type { CreateCCUSStrategyData, CCUSStrategiesResponse } from '../types/api'

const CONTROLLER = '/type_ccus_strategies'

export const CCUSStrategiesService = {
  getAll: async (): Promise<CCUSStrategiesResponse[]> => {
    const response = await apiClient.get(CONTROLLER)
    return response.data
  },

  getById: async (project_id: string): Promise<CCUSStrategiesResponse> => {
    const response = await apiClient.get(`${CONTROLLER}/${project_id}`)
    return response.data
  },

  create: async (data: CreateCCUSStrategyData): Promise<CCUSStrategiesResponse> => {
    const response = await apiClient.post(CONTROLLER, data)
    return response.data
  },

  update: async (strategies_id: string, data: CreateCCUSStrategyData): Promise<CCUSStrategiesResponse> => {
    const response = await apiClient.put(`${CONTROLLER}/${strategies_id}`, data)
    return response.data
  },

  delete: async (strategies_id: string): Promise<void> => {
    await apiClient.delete(`${CONTROLLER}/${strategies_id}`)
  },
}