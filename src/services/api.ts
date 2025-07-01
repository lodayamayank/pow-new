import axios from 'axios'
import { setupInterceptors } from './interceptors'

axios.defaults.headers.common['x-space-code'] = 'test'
// axios.defaults.withCredentials = true

export const api = setupInterceptors(
  axios.create({
    baseURL: process.env.REACT_APP_API_URL
  })
)

export const agentApi = setupInterceptors(
  axios.create({
    baseURL: process.env.AGENT_SERVICE_API_URL
  })
)
