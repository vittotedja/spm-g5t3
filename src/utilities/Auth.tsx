import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {supabase} from '../pages/Login';
import {User} from '@supabase/supabase-js';
import {UserRole} from '../hocs/withRoleProtection';

type AuthContextType = {
	signInWithPassword: (data: any) => Promise<any>;
	signOut: () => Promise<any>;
	user: User | null;
	userRole: UserRole;
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
	useEffect(() => {
		// Check active sessions and sets the user
		async function initializeAuth() {
			try {
				const session = (await supabase.auth.getSession()).data.session;
				setUser(session?.user ?? null);
				setLoading(false);

				if (session?.user) {
					const sessEmail = session.user.email;
					const {data, error} = await supabase
						.from('staff')
						.select('*')
						.eq('email', sessEmail)
						.single();

					if (data && !error) {
						setUserRole(data.is_manager ? 'manager' : 'staff');
					} else {
						console.error('Error fetching user role:', error);
					}
				}
				setUser(session?.user ?? null);
				setLoading(false);
				// Listen for changes on auth state (logged in, signed out, etc.)
				const {data: listener} = supabase.auth.onAuthStateChange(
					async (_, session) => {
						setUser(session?.user ?? null);
						setLoading(false);
					}
				);

				return () => {
					listener?.subscription.unsubscribe();
				};
			} catch (error) {
				console.error('Error initializing authentication:', error);
				setLoading(false);
			}
		}
		initializeAuth();
	}, []);

	// Will be passed down to Signup, Login and Dashboard components
	const value = {
		// signUp: (data) => supabase.auth.signUp(data),
		signInWithPassword: (data: any) =>
			supabase.auth.signInWithPassword(data),
		signOut: () => supabase.auth.signOut(),
		user,
		userRole,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
