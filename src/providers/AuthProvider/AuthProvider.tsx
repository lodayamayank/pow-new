import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { AuthContext, SignInCredentials, User } from '@/contexts'
import { generalpaths } from '@/router'
import { api, setAuthorizationHeader } from '@/services'
import { createSessionCookies, getToken, removeSessionCookies, validateUserPermissions } from '@/utils'
import { useSession } from '@/hooks'

type Props = {
  children: ReactNode
}

function AuthProvider(props: Props) {
  const { children } = props

  const [user, setUser] = useState<User>()
  const [loadingUserData, setLoadingUserData] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const token = getToken()
  const isAuthenticated = Boolean(token)

  async function signIn(params: SignInCredentials) {
    const { email, password } = params

    try {
      // const response = await api.post('/sessions', { email, password })
      const response = await api.post('/login', { email, password })
      const { user, token, refreshToken, permissions, roles } = response.data
      createSessionCookies({ token, refreshToken })
      const { uuid, name, mobile } = user
      setUser({ uuid, name, mobile, email, permissions, roles })
      setAuthorizationHeader({ request: api.defaults, token })
    } catch (error) {
      const err = error as AxiosError
      return err
    }
  }

  function signOut() {
    removeSessionCookies()
    setUser(undefined)
    setLoadingUserData(false)
    navigate(generalpaths.LOGIN_PATH)
  }

  useEffect(() => {
    if (!token) {
      removeSessionCookies()
      setUser(undefined)
      setLoadingUserData(false)
    }
  }, [navigate, pathname, token])

  useEffect(() => {
    const token = getToken()

    async function getUserData() {
      setLoadingUserData(true)

      try {
        const response = await api.get('/me')

        if (response?.data) {
          const { user, permissions, roles } = response.data
          const { uuid, email, name, mobile } = user
          setUser({ uuid, email, name, mobile, permissions, roles })
        }
      } catch (error) {
        /**
         * an error handler can be added here
         */
      } finally {
        setLoadingUserData(false)
      }
    }

    if (token) {
      setAuthorizationHeader({ request: api.defaults, token })
      getUserData()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loadingUserData,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
