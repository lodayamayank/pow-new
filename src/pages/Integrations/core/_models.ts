import { ID, Response } from "@/utils"

export type Integration = {
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
}

export type UpsertError = {
  statusCode: number
  message: string
  error: string
}

export type QueryResponse = Response<Array<Integration>>

export type RecordsQueryResponse = Response<Array<Integration>>

export const detailsInitValues: Integration = {
  name: '',
  code: '',
  description: ''
}