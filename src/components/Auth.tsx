import React, { useContext, useState, useEffect } from 'react'
import { supabase } from '../pages/Login'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      // Check active sessions and sets the user
      const session = supabase.auth.getSession()
  
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