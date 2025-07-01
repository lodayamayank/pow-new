import { ID, Response } from "@/utils"

export type Client = {
  id?: ID
  uuid?: string
  name: string
  nickname: string
  mobile: number
  email: string
  altEmail: string
  pan: string
  dob: string
  nomineeName: string
  description?: string
  is_active?: boolean
  weeklyReport: boolean
  persistable?: any
  brokerDetails?: any
  clientPlatforms?: any
  clientCommercials?: any
  clientSubscriptions?: any
  clientAUM?: any
  clientStrategies?: any
}

export type ClientBroker = {
  id?: ID
  uuid?: string
  client?: any
  broker?: any
  brokerId?: string
  clientCode: string
  boidDematNumber: string
  mpin: string
  password: string
  toptSecretKey: string
  cdslUsername: string
  cdslPassword: string
  cdslSecretQuestion: string
  cdslSecretAnswer: string
  cdslTPIN: string
  is_active?: boolean
  persistable?: any
}

export type ClientAUM = {
  id?: ID
  uuid?: string
  client?: any
  broker?: any
  brokerId?: string
  amount: number
  startDate: any
  endDate: any
  is_active?: boolean
  persistable?: any
}

export type ClientProfitSettled = {
  id?: ID
  uuid?: string
  client?: any
  broker?: any
  brokerId?: string
  amount: number
  settledDate: any
  is_active?: boolean
  persistable?: any
}

export type ClientAdjustments = {
  id?: ID
  uuid?: string
  client?: any
  broker?: any
  brokerId?: string
  amount: number
  entryDate: any
  persistable?: any
}

export type ClientGroup = {
  id?: ID
  uuid?: string
  name: string
  whatsappGroupID?: string
  parentClient: any
  details: string
  clients?: any
  persistable?: any
}

export enum ClientTasksForList {
  // TRADE_DATA_SCRAPPER = 'TRADE_DATA_SCRAPPER',
  LEDGER = 'LEDGER',
  FNO_PROFITS = 'FNO_PROFITS',
  ETF_TRANSACTION_REPORT = 'ETF_TRANSACTION_REPORT',
  PORTFOLIO_VALUE = 'PORTFOLIO_VALUE'
}

export type UpsertError = {
  statusCode: number
  message: string
  error: string
}

export type QueryResponse = Response<Array<Client>>
export type RecordsQueryResponse = Response<Array<Client>>

export type ClientBrokerQueryResponse = Response<Array<ClientBroker>>
export type ClientBrokersRecordsQueryResponse = Response<Array<ClientBroker>>

export type ClientAUMQueryResponse = Response<Array<ClientAUM>>
export type ClientAUMRecordsQueryResponse = Response<Array<ClientAUM>>

export type ClientProfitSettledQueryResponse = Response<Array<ClientProfitSettled>>
export type ClientProfitSettledRecordsQueryResponse = Response<Array<ClientProfitSettled>>

export type ClientGroupQueryResponse = Response<Array<ClientGroup>>
export type ClientGroupsRecordsQueryResponse = Response<Array<ClientGroup>>

export const detailsInitValues: Client = {
  name: '',
  nickname: '',
  mobile: null,
  email: '',
  altEmail: '',
  pan: '',
  dob: '',
  nomineeName: '',
  weeklyReport: false
}

export const clientBrokerDetailsInitValues: ClientBroker = {
  clientCode: '',
  boidDematNumber: '',
  mpin: '',
  password: '',
  toptSecretKey: '',
  cdslUsername: '',
  cdslPassword: '',
  cdslSecretQuestion: '',
  cdslSecretAnswer: '',
  cdslTPIN: '',
}

export const clientAUMDetailsInitValues: ClientAUM = {
  amount: 0,
  startDate: '',
  endDate: ''
}

export const clientProfitsSettledDetailsInitValues: ClientProfitSettled = {
  amount: 0,
  settledDate: '',
}

export const clientAdjustmentsDetailsInitValues: ClientAdjustments = {
  amount: 0,
  entryDate: '',
}

export const clientGroupsInitValues: ClientGroup = {
  name: '',
  whatsappGroupID: '',
  parentClient: null,
  details: '',
  clients: null,
}