import { Response } from "@/utils"



export type Role = {
  id?: number
  name?: string
  guard_name?: string
  is_super?: boolean
  permissions?: any
}

export type Permission = {
    id: number
    name?: string
    guard_name?: string
    is_super?: boolean
}

export const initialRole: Role = {
  name: '',
  guard_name: 'web',
  permissions: [],
  is_super: false
}

export const roleDetailsInitValues: Role = {
  name: '',
  guard_name: 'web',
  permissions: [],
  is_super: false
}

export type RolesQueryResponse = Response<Array<Role>>
export type PermissionsQueryResponse = Response<Array<Permission>>