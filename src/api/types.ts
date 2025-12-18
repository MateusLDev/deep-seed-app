// Tipos básicos - adicione conforme necessário
export interface ApiResponse<T = any> {
  data: T
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total?: number
}