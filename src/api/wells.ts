import type { WellTargetResponse, CreateWellData, UpdateWellData } from '@/types/api'
import { apiClient } from './client'

const WELLS_ENDPOINT = '/well_targets'

export const WellTargetService = {
  getAll: async (): Promise<WellTargetResponse[]> => {
    const response = await apiClient.get(WELLS_ENDPOINT)
    return response.data
  },

  getById: async (well_targets_id: number): Promise<WellTargetResponse> => {
    const response = await apiClient.get(`${WELLS_ENDPOINT}/id/${well_targets_id}`)
    return response.data
  },

  getByProjectId: async (project_id: string): Promise<WellTargetResponse[]> => {
    const response = await apiClient.get(`${WELLS_ENDPOINT}/project_id/${project_id}`)
    return response.data
  },

  create: async (data: CreateWellData): Promise<WellTargetResponse> => {
    const response = await apiClient.post(WELLS_ENDPOINT, data)
    return response.data
  },

  update: async (well_targets_id: number, data: UpdateWellData): Promise<WellTargetResponse> => {
    const response = await apiClient.put(`${WELLS_ENDPOINT}/${well_targets_id}`, data)
    return response.data
  },

  delete: async (well_targets_id: number): Promise<void> => {
    await apiClient.delete(`${WELLS_ENDPOINT}/${well_targets_id}`)
  },
}