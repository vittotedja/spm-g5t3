// import React from 'react';
import { createClient } from '@supabase/supabase-js';
// import { Auth } from '@supabase/auth-ui-react';
import { useRef } from 'react'
import { useAuth } from '../components/Auth';
// import { useHistory } from 'react-router-dom';
// import react from '../assets/react.svg';

const supabaseUrl = 'https://wbsagjngbxrrzfktkvtt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2Fnam5nYnhycnpma3RrdnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ2NjU0MjcsImV4cCI6MjAxMDI0MTQyN30.X_EkPcpKarJkJk3FYExVrPE3Y73CvOzkP6Yhp0oyC0A'
const supabase = createClient(supabaseUrl, supabaseKey)
export {supabase}


export function Login() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  // const [isFormValid, setIsFormValid] = useState(false)
  
  // function handleInputChange() {
  //   const email = emailRef.current.value;
  //   const password = passwordRef.current.value;
  //   if (email.length < 1 && password.length < 1){
  //     setIsFormValid(true)
  //   }
  // }
  const { signInWithPassword }: { signInWithPassword: (data: any) => Promise<{error?: Error}> } = useAuth()
//   const { history } = useHistory()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    console.log(emailRef.current?.value)
    console.log(passwordRef.current?.value)
    const email = emailRef.current ? emailRef.current.value: '';
    const password = passwordRef.current? passwordRef.current.value: '';

    const { error } = await signInWithPassword({ email, password });

    //if(!email.includes('@') && email.length <= 3){
    //  alert('Please enter a valid email')
    //}


    if (error) {
      // Check the type of error based on error.message
      let errorMessage = error.message;
      
      if (error.message.includes('credentials')) {
        errorMessage = 'The credentials you entered is invalid.';
      }
      // } else if (error.message.includes('User not found')) {
      //   errorMessage = 'There is no account asociated with this email.';
      // }
      console.log(error)
      alert(errorMessage);
    } else {
      console.log((await supabase.auth.getSession()).data.session);
      alert('Log In Succesful')
      }
    }

    return (
      <div className="flex h-screen w-screen rounded-lg p-0">
        <div className="flex flex-col justify-center items-start w-1/2 bg-emerald-600 text-white p-12">
          {/* Replace this with your logo */}
          <div className="text-3xl mb-8">Welcome to</div>
          <div className="text-6xl font-bold mb-8">GlassWindow</div>
          <div className="text-3xl mb-8">One stop internal hiring platform</div>
        </div>
        
        <div className="flex flex-col justify-center items-start w-1/2 bg-white p-12">
        <div className="text-5xl font-bold mb-6">Login</div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className='justify-start items-start text-lg font-medium text-gray-600 text-left'>
              <label htmlFor="signup-email" className="block mb-2"> Email </label>
              <input id="signup-email" type="email" ref={emailRef} className="p-2 w-full border rounded-md bg-gray-200"/>
            </div>

            <div className='justify-start items-start text-lg font-medium text-gray-600 text-left'>
              <label htmlFor="signup-password" className="block mb-2">Password</label>
              <input id="signup-password" type="password" ref={passwordRef} className="p-2 w-full border rounded-md bg-gray-200"/>
            </div>

            <button 
              type="submit" 
              // disabled={!isFormValid}
              className='font-bold mt-6 bg-emerald-600 text-white p-2 w-1/4 rounded-md hover:bg-emerald-900 focus:outline-none focus:border-emerald-700 focus:ring focus:ring-emerald-900 justify-content-end float-right
              '>
              Login
            </button>
          </form>
        </div>
      </div>
    );
}