import axios, {AxiosResponse, AxiosError} from 'axios'
import {PermissionsQueryResponse, RolesQueryResponse, User, UserUpsertError} from './_models'
import { api } from '@/services'
import { useRoutePaths } from '@/hooks'

export const USERS_URL = '/users' 
export const ROLES_URL = '/roles'
export const PERMISSIONS_URL = '/permissions'  

const getUsers = (query: string): Promise<`UsersQueryResponse`> => {
  return api
    .get(`${USERS_URL}?${query}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getUserById = (id: string): Promise<User | undefined> => {
  return api
    .get(`${USERS_URL}/${id}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const createRecord = (user: User): Promise<User | UserUpsertError | any> => {
  return api
    .post(USERS_URL, user)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const updateRecord = (user: User, userId: string): Promise<User | any> => {
  return api
    .patch(`${USERS_URL}/${userId}`, user)
    .catch((reason: AxiosError<any>) => reason?.response)
}

const deleteRecord = (userId: string): Promise<void> => {
  if(window.confirm("Are you sure want to delete this record?")){
    return api.delete(`${USERS_URL}/${userId}`)
  }
  return Promise.resolve()
}

const getRolesList = (): Promise<`RolesQueryResponse`> => {
    return api
    .get(`${ROLES_URL}`)
    .then((d: AxiosResponse<any>) => d.data)
}

const getPermissionsList = (): Promise<`PermissionsQueryResponse`> => {
    return api
    .get(`${PERMISSIONS_URL}`)
    .then((d: AxiosResponse<any>) => d.data)
}

export {getUsers, deleteRecord, getUserById, createRecord, updateRecord, getRolesList, getPermissionsList}
