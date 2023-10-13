// import React from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { Auth } from '@supabase/auth-ui-react';
import {useRef} from 'react';
import {useAuth} from '../utilities/Auth';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const supabaseUrl:string = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey:string = import.meta.env.VITE_SUPABASE_KEY || ''
const supabase:SupabaseClient = createClient(supabaseUrl, supabaseKey)
export {supabase}


export function Login() {
	// const createAccForStaff = useCreateAcc();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	// const [isFormValid, setIsFormValid] = useState(false)

	// function handleInputChange() {
	//   const email = emailRef.current.value;
	//   const password = passwordRef.current.value;
	//   if (email.length < 1 && password.length < 1){
	//     setIsFormValid(true)
	//   }
	// }
	const auth = useAuth();
	if (!auth) {
		return <div>Auth Error</div>;
	}
	const {signInWithPassword} = auth;
	//   const { history } = useHistory()
	const navigate = useNavigate();

	async function handleSubmit(
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> {
		e.preventDefault();
		const email = emailRef.current ? emailRef.current.value : '';
		const password = passwordRef.current ? passwordRef.current.value : '';

		const {error} = await signInWithPassword({email, password});

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
			alert(errorMessage);
		} else {
			alert('Log In Succesful');
			navigate('/');
		}
	}

	return (
		<div className="flex w-screen h-screen p-0 rounded-lg">
			<div className="flex flex-col items-start justify-center w-1/2 p-12 text-white bg-emerald-600">
				{/* Replace this with your logo */}
				<div className="mb-8 text-3xl">Welcome to</div>
				<div className="mb-8 text-6xl font-bold">GlassWindow</div>
				<div className="mb-8 text-3xl">
					One stop internal hiring platform
				</div>
			</div>

			<div className="flex flex-col items-start justify-center w-1/2 p-12 bg-white">
				<div className="mb-6 text-5xl font-bold">Login</div>
				<form onSubmit={handleSubmit} className="w-full space-y-4">
					<div className="items-start justify-start text-lg font-medium text-left text-gray-600">
						<label htmlFor="signup-email" className="block mb-2">
							{' '}
							Email{' '}
						</label>
						<input
							id="signup-email"
							type="email"
							ref={emailRef}
							className="w-full p-2 bg-gray-200 border rounded-md"
						/>
					</div>

					<div className="items-start justify-start text-lg font-medium text-left text-gray-600">
						<label htmlFor="signup-password" className="block mb-2">
							Password
						</label>
						<input
							id="signup-password"
							type="password"
							ref={passwordRef}
							className="w-full p-2 bg-gray-200 border rounded-md"
						/>
					</div>

					<button
						type="submit"
						// disabled={!isFormValid}
						className="float-right w-1/4 p-2 mt-6 font-bold text-white rounded-md bg-emerald-600 hover:bg-emerald-900 focus:outline-none focus:border-emerald-700 focus:ring focus:ring-emerald-900 justify-content-end "
					>
						Login
					</button>

					{/* <button
          				onClick={() => createAccForStaff()}
          				className="mb-4 p-2 text-white bg-blue-500 rounded-md"
        				>
          				Create Accounts for Staff
        			</button> */}
				</form>
			</div>
		</div>
	);
}
