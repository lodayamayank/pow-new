import { AxiosError } from 'axios'
import { createContext } from 'react'

export type UserDetails = {
  uuid: string,
  name: string,
  email: string,
  mobile: string
}

export type User = {
  uuid: string
  name: string
  email: string
  mobile: string
  permissions: string[]
  roles: string[]
}


export type SignInCredentials = {
  email: string
  password: string
}

export type AuthContextData = {
  user?: User
  isAuthenticated: boolean
  loadingUserData: boolean
  signIn: (credentials: SignInCredentials) => Promise<void | AxiosError>
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextData)

export default AuthContext
