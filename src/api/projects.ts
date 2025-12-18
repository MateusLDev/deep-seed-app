import { apiClient } from './client'
import type { ProjectsResponse, CreateProjectData } from '../types/api'

const CONTROLLER = '/projects'

export const ProjectsService = {
  getAll: async (): Promise<ProjectsResponse[]> => {
    const response = await apiClient.get(CONTROLLER)
    return response.data
  },

  getById: async (project_id: string): Promise<ProjectsResponse> => {
    const response = await apiClient.get(`${CONTROLLER}/${project_id}`)
    return response.data
  },

  create: async (data: CreateProjectData): Promise<ProjectsResponse> => {
    const response = await apiClient.post(CONTROLLER, data)
    return response.data
  },

  update: async (project_id: string, data: CreateProjectData): Promise<ProjectsResponse> => {
    const response = await apiClient.put(`${CONTROLLER}/${project_id}`, data)
    return response.data
  },

  delete: async (project_id: string): Promise<void> => {
    await apiClient.delete(`${CONTROLLER}/${project_id}`)
  },
}