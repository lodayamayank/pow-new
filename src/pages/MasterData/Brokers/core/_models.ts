import { ID, Response } from "@/utils"

export type Broker = {
  id?: ID
  uuid?: string
  name: string
  dpid: string
  code: string
  logo?: any
  description?: string
  etfs_isins?: string
  etfs_scripcodes?: string
  is_active?: boolean
  persistable?: any
  platforms?: any
  clients?: any
  clientPlatformBrokers?: any
  clientCommercials?: any
  clientSubscriptions?: any
  clientAUM?: any
  clientStrategies?: any
}

export type UpsertError = {
  statusCode: number
  message: string
  error: string
}

export type QueryResponse = Response<Array<Broker>>

export type RecordsQueryResponse = Response<Array<Broker>>

export const detailsInitValues: Broker = {
  name: '',
  code: '',
  description: '',
  dpid: ''
}