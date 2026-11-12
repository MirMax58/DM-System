import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import {
  JOIN_COMPANY_MUTATION,
  LOGIN_MUTATION,
  ME_QUERY,
  REGISTER_COMPANY_MUTATION,
} from '../graphql/operations.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'dm-system-token'

export function AuthProvider({ children }) {
  const client = useApolloClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  const saveSession = useCallback(async (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token)
    await client.clearStore()
    setUser(payload.user)
    return payload.user
  }, [client])

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY)
    await client.clearStore()
    setUser(null)
  }, [client])

  useEffect(() => {
    let active = true
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return () => { active = false }

    client.query({ query: ME_QUERY, fetchPolicy: 'network-only' })
      .then(({ data }) => {
        if (!active) return
        if (data?.me) setUser(data.me)
        else {
          localStorage.removeItem(TOKEN_KEY)
          setUser(null)
        }
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [client])

  const login = useCallback(async (variables) => {
    const { data } = await client.mutate({ mutation: LOGIN_MUTATION, variables })
    return saveSession(data.login)
  }, [client, saveSession])

  const registerCompany = useCallback(async (input) => {
    const { data } = await client.mutate({ mutation: REGISTER_COMPANY_MUTATION, variables: { input } })
    return saveSession(data.registerCompany)
  }, [client, saveSession])

  const joinCompany = useCallback(async (input) => {
    const { data } = await client.mutate({ mutation: JOIN_COMPANY_MUTATION, variables: { input } })
    return saveSession(data.joinCompany)
  }, [client, saveSession])

  const value = useMemo(() => ({
    user,
    company: user?.company || null,
    loading,
    isAuthenticated: Boolean(user),
    login,
    registerCompany,
    joinCompany,
    logout,
  }), [user, loading, login, registerCompany, joinCompany, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth має використовуватися всередині AuthProvider.')
  return context
}
