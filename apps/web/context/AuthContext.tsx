"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { signin, signup, getMe } from "@/src/actions/auth"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
      }
      setHasCheckedStorage(true)
    } else {
      setHasCheckedStorage(true)
    }
  }, [])

  // Fetch user data when token is available
  const fetchUser = useCallback(async () => {
    if (!hasCheckedStorage) {
      return // Wait for localStorage check to complete
    }

    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const userData = await getMe()
      setUser(userData)
    } catch (error) {
      // Token might be invalid, clear it
      console.error("Failed to fetch user:", error)
      setToken(null)
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    } finally {
      setIsLoading(false)
    }
  }, [token, hasCheckedStorage])

  // Fetch user when token changes or after checking storage
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    try {
      const data = await signin({ email, password })
      const newToken = data.token
      
      setToken(newToken)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
      }
      
      // User data is returned from signin, set it immediately
      if (data.user) {
        setUser(data.user)
      } else {
        // Otherwise fetch it
        await fetchUser()
      }
    } catch (error) {
      throw error
    }
  }

  const signupUser = async (name: string, email: string, password: string) => {
    try {
      const data = await signup({ name, email, password })
      const newToken = data.token
      
      setToken(newToken)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
      }
      
      // User data is returned from signup, set it immediately
      if (data.user) {
        setUser(data.user)
      } else {
        // Otherwise fetch it
        await fetchUser()
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup: signupUser,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
