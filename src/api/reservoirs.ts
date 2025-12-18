import type { ReservoirResponse, CreateReservoirData, UpdateReservoirData } from '@/types/api'
import { apiClient } from './client'

const RESERVOIRS_ENDPOINT = '/reservoir_details'

export const ReservoirService = {
  getAll: async (): Promise<ReservoirResponse[]> => {
    const response = await apiClient.get(RESERVOIRS_ENDPOINT)
    return response.data
  },

  getById: async (reservoir_details_id: number): Promise<ReservoirResponse> => {
    const response = await apiClient.get(`${RESERVOIRS_ENDPOINT}/${reservoir_details_id}`)
    return response.data
  },

  create: async (data: CreateReservoirData): Promise<ReservoirResponse> => {
    const response = await apiClient.post(RESERVOIRS_ENDPOINT, data)
    return response.data
  },

  update: async (reservoir_details_id: number, data: UpdateReservoirData): Promise<ReservoirResponse> => {
    const response = await apiClient.put(`${RESERVOIRS_ENDPOINT}/${reservoir_details_id}`, data)
    return response.data
  },

  delete: async (reservoir_details_id: number): Promise<void> => {
    await apiClient.delete(`${RESERVOIRS_ENDPOINT}/${reservoir_details_id}`)
  },
}