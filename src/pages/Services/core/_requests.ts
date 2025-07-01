import axios, {AxiosResponse, AxiosError} from 'axios'
import {Service, UpsertError, RecordsQueryResponse, ServicePermission} from './_models'
import { api } from '@/services'

export const SERVICES_URL = '/services'

const getRecords = (query: string): Promise<`RecordsQueryResponse`> => {
  return api
    .get(`${SERVICES_URL}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getRecordById = (id: string): Promise<Service | undefined> => {
  return api
    .get(`${SERVICES_URL}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createRecord = (record: Service): Promise<Service | UpsertError | any> => {
  return api
    .post(SERVICES_URL, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateRecord = (record: Service, recordId: string): Promise<Service | any> => {
  return api
    .patch(`${SERVICES_URL}/${recordId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteRecord = (recordId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${SERVICES_URL}/${recordId}`)
  }
  return Promise.resolve()
}

const createServicePermission = (record: ServicePermission, serviceId: string): Promise<ServicePermission | UpsertError | any> => {
  return api
    .post(`${SERVICES_URL}/permissions/${serviceId}`, record)
    .catch((reason: AxiosError<any>) => reason?.response)
}

export {getRecords, deleteRecord, getRecordById, createRecord, updateRecord, createServicePermission}
