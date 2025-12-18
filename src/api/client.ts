import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// URL base da API
const BASE_URL = 'http://k8s-flocores-flocores-5b11a9b2c5-fa4d464bdd057a5e.elb.us-east-1.amazonaws.com/api/v1/reservoir'

// Criar instância do axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export default apiClient