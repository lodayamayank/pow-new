import axios, {AxiosResponse, AxiosError} from 'axios'
import {PermissionsQueryResponse, Role, RolesQueryResponse} from './_models'
import { api } from '@/services'
import { useRoutePaths } from '@/hooks'
import { ID } from '@/utils'

export const ROLES_URL = '/roles'
export const PERMISSIONS_URL = '/permissions'

const createRecord = (user: Role): Promise<Role | any> => {
  return api
    .post(ROLES_URL, user)
    .catch((reason: AxiosError<any>) => reason?.response)
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

const assignPermissions = (role: Role, roleId: ID): Promise<Role | any> => {
  return api
    .post(`${ROLES_URL}/permissions/${roleId}`, role)
    .then((response: AxiosResponse<any>) => response)
    .catch((reason: AxiosError<any>) => reason?.response)
}

export {createRecord, getRolesList, getPermissionsList, assignPermissions}
