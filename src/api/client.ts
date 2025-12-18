import axios, { type AxiosInstance } from 'axios'

const BASE_URL = 'http://k8s-flocores-flocores-5b11a9b2c5-fa4d464bdd057a5e.elb.us-east-1.amazonaws.com/api/v1/reservoir'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export default apiClient