import { ID, Response } from "@/utils"

export type Service = {
  id?: ID
  uuid?: string
  name?: string
  code?: string
  description?: string
  svg_icon?: string
  image?: any
  is_active?: string
  default_active?: string
  spaces?: any
  persistable?: any
  servicePermissions?: any
}

export type ServicePermission = {
  id?: ID
  uuid?: string
  name: string
  is_super?: boolean
  description?: string
  service?: Service
  default_active: boolean
}

export type UpsertError = {
  statusCode: number
  message: string
  error: string
}

export type QueryResponse = Response<Array<Service>>

export type RecordsQueryResponse = Response<Array<Service>>

export const detailsInitValues: Service = {
  name: '',
  code: '',
  description: ''
}

export const detailsServicePermissionInitValues: ServicePermission = {
  name: '',
  description: '',
  svg_icon: '',
  default_active: false
}
