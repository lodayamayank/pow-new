import axios, {AxiosResponse, AxiosError} from 'axios'
import { agentApi, api } from '@/services'

export const MODULE_API_URL = '/agents'
export const TRADEDATA_API_URL = '/tradedata'


// const getAllTradeData = (broker: string, body: any): Promise<any> => {
//   return api
//     .post(`${MODULE_API_URL}/brokers/scrapper/all/${broker}`, body)
//     .catch((reason: AxiosError<any>) => reason?.response)
// }

const getAllTradeData = (body: any): Promise<any> => {
  return api
    .post(`${TRADEDATA_API_URL}/alldata`, body)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const getHTMLURLs = (): Promise<any> => {
  return api
    .get(`${TRADEDATA_API_URL}/htmlreports`)
    .catch((reason: AxiosError<any>) => reason?.response)
}

export {
  getAllTradeData,
  getHTMLURLs
}