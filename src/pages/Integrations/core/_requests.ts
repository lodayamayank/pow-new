import axios, {AxiosResponse, AxiosError} from 'axios'
import {Integration, UpsertError, RecordsQueryResponse} from './_models'
import { api } from '@/services'

export const INTEGRATIONS_URL = '/integrations'

const getRecords = (query: string): Promise<`RecordsQueryResponse`> => {
  return api
    .get(`${INTEGRATIONS_URL}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getRecordById = (id: string): Promise<Integration | undefined> => {
  return api
    .get(`${INTEGRATIONS_URL}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createRecord = (record: Integration): Promise<Integration | UpsertError | any> => {
  return api
    .post(INTEGRATIONS_URL, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateRecord = (record: Integration, recordId: string): Promise<Integration | any> => {
  return api
    .patch(`${INTEGRATIONS_URL}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteRecord = (recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${INTEGRATIONS_URL}/${recordId}`)
  }
  return Promise.resolve()
}


export {getRecords, deleteRecord, getRecordById, createRecord, updateRecord}
