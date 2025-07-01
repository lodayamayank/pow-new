import axios, {AxiosResponse, AxiosError} from 'axios'
import {Client, UpsertError, RecordsQueryResponse, ClientBroker, ClientAUM, ClientProfitSettled, ClientAdjustments, ClientGroup} from './_models'
import { api } from '@/services'

export const MODULE_API_URL = '/clients'
export const AGENTS_API_URL = '/agents'

const getRecords = (query?: string): Promise<`RecordsQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getRecordById = (id: string): Promise<Client | undefined> => {
  return api
    .get(`${MODULE_API_URL}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createRecord = (record: Client): Promise<Client | UpsertError | any> => {
  return api
    .post(MODULE_API_URL, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateRecord = (record: any, recordId: string): Promise<Client | any> => {
  return api
    .patch(`${MODULE_API_URL}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteRecord = (recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/${recordId}`)
  }
  return Promise.resolve()
}

const getClientBrokerRecords = (clientId: string, query?: string): Promise<`ClientBrokersRecordsQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}/brokers/${clientId}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getClientBrokerRecordById = (clientId: string, id: string): Promise<ClientBroker | undefined> => {
  return api
  .get(`${MODULE_API_URL}/brokers/${clientId}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createClientBrokerRecord = (clientId: string, record: ClientBroker): Promise<ClientBroker | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/brokers/"+clientId, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateClientBrokerRecord = (clientId: string, recordId: string, record: any): Promise<ClientBroker | any> => {
  return api
    .patch(`${MODULE_API_URL}/brokers/${clientId}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteClientBrokerRecord = (clientId: string, recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/brokers/${clientId}/${recordId}`)
  }
  return Promise.resolve()
}


const getClientAUMRecords = (clientId: string, query?: string): Promise<`ClientAUMRecordsQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}/aum/${clientId}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getClientAUMRecordById = (clientId: string, id: string): Promise<ClientAUM | undefined> => {
  return api
  .get(`${MODULE_API_URL}/aum/${clientId}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createClientAUMRecord = (clientId: string, record: ClientBroker): Promise<ClientAUM | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/aum/"+clientId, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateClientAUMRecord = (clientId: string, recordId: string, record: any): Promise<ClientAUM | any> => {
  return api
    .patch(`${MODULE_API_URL}/aum/${clientId}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const uploadClientAUMsRecord = (data: any): Promise<ClientAdjustments | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/aum/bulkupload", data)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteClientAUMRecord = (clientId: string, recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/aum/${clientId}/${recordId}`)
  }
  return Promise.resolve()
}

const getClientProfitsRecords = (clientId: string, query?: string): Promise<`ClientProfitSettledQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}/profits/${clientId}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getClientProfitsRecordById = (clientId: string, id: string): Promise<ClientProfitSettled | undefined> => {
  return api
  .get(`${MODULE_API_URL}/profits/${clientId}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createClientProfitsRecord = (clientId: string, record: ClientProfitSettled): Promise<ClientProfitSettled | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/profits/"+clientId, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateClientProfitsRecord = (clientId: string, recordId: string, record: any): Promise<ClientProfitSettled | any> => {
  return api
    .patch(`${MODULE_API_URL}/profits/${clientId}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const uploadClientProfitsRecord = (data: any): Promise<ClientAdjustments | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/profits/bulkupload", data)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteClientProfitsRecord = (clientId: string, recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/profits/${clientId}/${recordId}`)
  }
  return Promise.resolve()
}

const getClientAdjustmentsRecords = (clientId: string, query?: string): Promise<`ClientAdjustmentQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}/adjustments/${clientId}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getClientAdjustmentsRecordById = (clientId: string, id: string): Promise<ClientAdjustments | undefined> => {
  return api
  .get(`${MODULE_API_URL}/adjustments/${clientId}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createClientAdjustmentsRecord = (clientId: string, record: ClientAdjustments): Promise<ClientAdjustments | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/adjustments/"+clientId, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const uploadClientAdjustmentsRecord = (data: any): Promise<ClientAdjustments | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/adjustments/upload", data)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateClientAdjustmentsRecord = (clientId: string, recordId: string, record: any): Promise<ClientAdjustments | any> => {
  return api
    .patch(`${MODULE_API_URL}/adjustments/${clientId}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteClientAdjustmentsRecord = (clientId: string, recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/adjustments/${clientId}/${recordId}`)
  }
  return Promise.resolve()
}

const getClientTasks = (clientId: string): Promise<any> => {
  return api
    .get(`${MODULE_API_URL}/tasks/${clientId}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const setupClientTasks = (clientId: string, taskFor: string, startDate: string, endDate: string): Promise<any> => {
  if(window.confirm("Are you sure want take this action?")){
    return api
      .get(`${AGENTS_API_URL}/client-historical-tradedata-running-task/${clientId}/${taskFor}/${startDate}/${endDate}`)
      .then((d: AxiosResponse<any>) => d.data)
  }
}

const deleteClientTask = (clientId: string, recordId: number): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/tasks/${clientId}/${recordId}`)
  }
  return Promise.resolve()
}

const deleteClientTaskAll = (): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/tasks/all`)
  }
  return Promise.resolve()
}

const getClientGroupRecords = (clientId: string, query?: string): Promise<`ClientGroupsRecordsQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}/groups/${clientId}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getClientGroupRecordById = (id: string): Promise<ClientGroup | undefined> => {
  return api
  .get(`${MODULE_API_URL}/groups/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createClientGroupRecord = (record: ClientGroup): Promise<ClientGroup | UpsertError | any> => {
  return api
    .post(MODULE_API_URL + "/groups", record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateClientGroupRecord = (record: any, recordId: string): Promise<ClientGroup | any> => {
  return api
    .patch(`${MODULE_API_URL}/groups/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteClientGroupRecord = (recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${MODULE_API_URL}/groups/${recordId}`)
  }
  return Promise.resolve()
}


export {
  getRecords, 
  deleteRecord, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  getClientBrokerRecords, 
  getClientBrokerRecordById,
  createClientBrokerRecord, 
  updateClientBrokerRecord, 
  deleteClientBrokerRecord,
  getClientAUMRecords,
  getClientAUMRecordById,
  createClientAUMRecord,
  updateClientAUMRecord,
  deleteClientAUMRecord,
  getClientProfitsRecords,
  getClientProfitsRecordById,
  createClientProfitsRecord,
  updateClientProfitsRecord,
  deleteClientProfitsRecord,
  getClientAdjustmentsRecords,
  getClientAdjustmentsRecordById,
  createClientAdjustmentsRecord,
  uploadClientAdjustmentsRecord,
  updateClientAdjustmentsRecord,
  deleteClientAdjustmentsRecord,
  getClientTasks,
  setupClientTasks,
  deleteClientTask,
  deleteClientTaskAll,
  uploadClientAUMsRecord,
  uploadClientProfitsRecord,
  getClientGroupRecords,
  getClientGroupRecordById,
  createClientGroupRecord,
  updateClientGroupRecord,
  deleteClientGroupRecord
}
