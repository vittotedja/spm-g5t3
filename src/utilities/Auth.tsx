import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import supabase from '../utilities/supabase';
import {User} from '@supabase/supabase-js';
import {UserRole} from '../hocs/withRoleProtection';

interface SignInData {
	email: string;
	password: string;
}
type AuthContextType = {
	signInWithPassword: (data: SignInData) => Promise<any>;
	signOut: () => Promise<any>;
	user: User | null;
	userRole: UserRole;
	staffId: number | null;
};
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
	return useContext(AuthContext);
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userRole, setUserRole] = useState<UserRole>(null);
	const [staffId, setStaffId] = useState<number | null>(null);

	useEffect(() => {
			async function initializeAuth() {
				try {
					const session = (await supabase.auth.getSession()).data.session; // Simplified getting the session
					await updateUserInfo(session?.user ?? null);

					const { data: listener } = supabase.auth.onAuthStateChange(
						async (_, session) => {
							await updateUserInfo(session?.user ?? null);
						}
					);
					return () => {listener?.subscription.unsubscribe()};
				} catch(error) {
					console.error('Error initializing authentication:', error)
				} finally {
					setLoading(false)
				};
			};

			const updateUserInfo = async (user: User | null) => { 
					setUser(user);
					// console.log(session)
					if (user) {
						const sessEmail = user.email?.toLowerCase();
						if(sessEmail) {
							const {data, error} = await supabase
								.from('staff')
								.select('*')
								.ilike('email', sessEmail)
								.single();
								// console.log(data)
							if (data && !error) {
								setUserRole(data.control_access);
								setStaffId(data.staff_id);
							} else {
								console.error('Error fetching user role:', error);
							}
						} else {
							setUserRole(null);
							setStaffId(null);
						}
					}
				};
			initializeAuth();
		}, []);
	
	useEffect(() => {
		console.log(userRole)
		console.log(staffId)
	}, [userRole, staffId])
	// Will be passed down to Signup, Login and Dashboard components

	const value = {
		// signUp: (data) => supabase.auth.signUp(data),
		signInWithPassword: async (data: SignInData) => {
			const {email, password} = data;
			const response = await supabase.auth.signInWithPassword({email, password});
			return response
		},
		signOut: () => supabase.auth.signOut(),
		user,
		userRole,
		staffId,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
