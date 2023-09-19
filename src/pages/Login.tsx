import React from 'react';
import { createClient } from '@supabase/supabase-js';
// import { Auth } from '@supabase/auth-ui-react';
import { useRef, useState } from 'react'
import { useAuth } from '../components/Auth';
// import { useHistory } from 'react-router-dom';

const supabaseUrl = 'https://wbsagjngbxrrzfktkvtt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2Fnam5nYnhycnpma3RrdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ2NjU0MjcsImV4cCI6MjAxMDI0MTQyN30.X_EkPcpKarJkJk3FYExVrPE3Y73CvOzkP6Yhp0oyC0A'
const supabase = createClient(supabaseUrl, supabaseKey)
export {supabase}


export function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()

  const { signInWithPassword } = useAuth()
//   const { history } = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    // @TODO: add login logic
    // Get email and password input values
    const email = emailRef.current.value
    const password = passwordRef.current.value

    // Calls `signIn` function from the context
    const { error } = await signInWithPassword({ email, password })

    if (error) {
      alert('error signing in')
    // } else {
      // Redirect user to Dashboard
    //   history.push('/')
    }
    else {
        console.log(supabase.auth.getSession())
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input-email">Email</label>
        <input id="input-email" type="email" ref={emailRef} />

        <label htmlFor="input-password">Password</label>
        <input id="input-password" type="password" ref={passwordRef} />

        <br />

        <button type="submit">Login</button>
      </form>
    </>
  )
}