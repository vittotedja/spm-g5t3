import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../pages/Login'

const AuthContext = createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    // console.log(children)
    useEffect(() => {
      // Check active sessions and sets the user
      const session = supabase.auth.getSession()
      console.log(session?.PromiseResult)
      setUser(session?.user ?? null)
      setLoading(false)
  
      // Listen for changes on auth state (logged in, signed out, etc.)
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
  
      return () => {
        // console.log(listener)
        listener?.subscription.unsubscribe()
      }
    }, [])
  
    // Will be passed down to Signup, Login and Dashboard components
    const value = {
      // signUp: (data) => supabase.auth.signUp(data),
      signInWithPassword: (data) => supabase.auth.signInWithPassword(data),
      signOut: () => supabase.auth.signOut(),
      user,
    }
  
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}