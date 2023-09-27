import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from '../pages/Login';  // Adjust the path to your supabase client
import { useAuth } from '../components/Auth';

export type UserRole = 'manager' | 'staff' | null;

interface ProtectedProps {
  requiredRole: UserRole;
  children: (role: UserRole) => ReactNode;
}

export const RoleProtection: React.FC<ProtectedProps> = ({ requiredRole, children }) => {
    const navigate = useNavigate();

    const { userRole } = useAuth() || {};
    console.log(userRole)
    if (userRole === null) {
        return
    }
    if (userRole === null) {
      return <div>Loading...</div>;
    }

    if (userRole !== requiredRole) {
        // alert("You don't have the rights to access this page")
        navigate('/role-listing');
        return null;
    }

    // return <WrappedComponent {...props} />;
    return <>{children(userRole)}</>
  };
// }

 export default RoleProtection;
