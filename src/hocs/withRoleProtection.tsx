// import { useAuth } from '../components/Auth';
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  supabase  from "../utilities/supabase"; // Adjust the path to your supabase client

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
  const [userRole, setUserRole] = useState<UserRole | "loading">("loading");
  console.log(userRole);

  useEffect(() => {
    const fetchUserRole = async () => {
      const sessEmail = (
        await supabase.auth.getUser()
      ).data.user?.email?.toLowerCase();
      if (sessEmail) {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .ilike("email", sessEmail);
        if (data && !error) {
          setUserRole(data[0].control_access);
        } else {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole === "loading") return;

    if (userRole === null) {
      alert("Please login to access this page");
      navigate("/login");
    } else if (!requiredRoles.includes(userRole)) {
      alert("You dont have access to this page");
      navigate("/");
    }
  }, [userRole]);

  if (userRole === "loading") return null; // or a loading spinner

  return <>{children(userRole)}</>;
};

export default RoleProtection;
