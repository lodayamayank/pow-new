import axios, {AxiosResponse, AxiosError} from 'axios'
import {Broker, UpsertError, RecordsQueryResponse} from './_models'
import { api } from '@/services'

export const MODULE_API_URL = '/masterdata/brokers'

const getRecords = (query: string): Promise<`RecordsQueryResponse`> => {
  return api
    .get(`${MODULE_API_URL}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getRecordById = (id: string): Promise<Broker | undefined> => {
  return api
    .get(`${MODULE_API_URL}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createRecord = (record: Broker): Promise<Broker | UpsertError | any> => {
  return api
    .post(MODULE_API_URL, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateRecord = (record: any, recordId: string): Promise<Broker | any> => {
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

export {getRecords, deleteRecord, getRecordById, createRecord, updateRecord}
