// import { useAuth } from '../components/Auth';
import React, {ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../pages/Login'; // Adjust the path to your supabase client

export type UserRole = 1 | 2 | 3 | 4 | null;

interface ProtectedProps {
	requiredRoles: UserRole[];
	children: (role: UserRole) => ReactNode;
}

export const RoleProtection: React.FC<ProtectedProps> = ({
	requiredRoles,
	children,
}) => {
	const navigate = useNavigate();

	// const { userRole } = useAuth() || {};
	const [userRole, setUserRole] = useState<UserRole>(null);
	// const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserRole = async () => {
			// const user = supabase.auth.getSession();
			const sessEmail = (await supabase.auth.getUser()).data.user?.email?.toLowerCase();
			console.log(sessEmail)
			// const getStaff = (await supabase.from('staff').select('*').eq('email', sessEmail).single())
			if (sessEmail) {
				const {data, error} = await supabase
					.from('staff')
					.select('*')
					.ilike('email', sessEmail)
					.single();
				console.log(data)
				
				if (data && !error) {
					setUserRole(data.control_access);
				}
			}
		};
		fetchUserRole();
	}, []);

	if (userRole === null) {
		return <div>Loading...</div>;
	}

	if (!requiredRoles.includes(userRole)) {
		alert("You don't have the rights to access this page")
		navigate('/role-listing');
		return null;
	}

	// return <WrappedComponent {...props} />;
	return <>{children(userRole)}</>;
};
// }

export default RoleProtection;
