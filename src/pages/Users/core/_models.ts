import { Response } from "@/utils"

export type User = {
  id?: number
  uuid?: string
  full_name: string
  email: string
  username?: string
  roles?: any
  permissions?: any
  is_active: boolean
  is_verfied?: boolean
  password?: string
  confirm_password?: string
  mobile?: number
  persistable?: any
  network_refresh_token?: any
}

export type UserUpsertError = {
  statusCode: number
  message: string
  error: string
}

export const initialUser: User = {
  full_name: '',
  email: '',
  password: '',
  roles: [],
  is_active: false,
  mobile: 0
}


export type Role = {
  id: number
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

export const userDetailsInitValues: User = {
  full_name: '',
  email: '',
  password: '',
  roles: [],
  permissions: [],
  is_active: false,
  mobile: 0
}


export type UsersQueryResponse = Response<Array<User>>
export type RolesQueryResponse = Response<Array<Role>>
export type PermissionsQueryResponse = Response<Array<Permission>>