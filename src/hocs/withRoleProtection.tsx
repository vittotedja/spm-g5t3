import React, { ComponentType, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../pages/Login';  // Adjust the path to your supabase client

type UserRole = 'manager' | 'staff' | null;

interface ProtectedProps {
  requiredRole: UserRole;
}

function withRoleProtection<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRole: UserRole
): React.FC<P & ProtectedProps> {
  return (props: P):ReactElement | null => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const navigate = useNavigate();

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
    }

    return <WrappedComponent {...props} />;
  };
}

export default withRoleProtection;
