
// import { useAuth } from '../components/Auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../pages/Login';  // Adjust the path to your supabase client

type UserRole = 'manager' | 'staff' | null;

interface ProtectedProps {
  requiredRole: UserRole;
  children: (role: UserRole) => ReactNode;
}

export const RoleProtection: React.FC<ProtectedProps> = ({ requiredRole, children }) => {
    const navigate = useNavigate();

    // const { userRole } = useAuth() || {};
    // console.log(userRole)
    const [userRole, setUserRole] = useState<UserRole>(null);

    useEffect(() => {
      const fetchUserRole = async () => {
        // const user = supabase.auth.getSession();
        const sessEmail = (await  supabase.auth.getUser()).data.user?.email
        // const getStaff = (await supabase.from('staff').select('*').eq('email', sessEmail).single())
        // console.log(getStaff);    
        if (sessEmail) {

          const { data, error } = await supabase
            .from('staff').select('*').eq('email', sessEmail).single();

            if (data && !error) {
                setUserRole(data.is_manager? 'manager':'staff')
          }
        }
      };

      fetchUserRole();
    }, []);

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
