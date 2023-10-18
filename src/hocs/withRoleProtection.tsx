import { useAuth } from '../utilities/Auth';
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = 1 | 2 | 3 | 4 | null | "loading";

interface ProtectedProps {
  requiredRoles: UserRole[];
  children: (role: UserRole) => ReactNode;
}

export const RoleProtection: React.FC<ProtectedProps> = ({
  requiredRoles,
  children,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const userRole = auth?.userRole;
  const staffId = auth?.staffId;
  console.log(user?.email)
  // console.log(userRole);
  console.log(staffId)
  useEffect(() => {
    if (!auth) {
      console.error("Auth context is not available!");
      return;
    }

    console.log('Current UserRole', userRole)
    if (userRole === "loading") return;

    if (!userRole) {
      alert("Please login to access this page");
      navigate("/login", {state: {from: location}});
    } else if (!requiredRoles.includes(userRole)) {
      alert("You dont have access to this page");
      navigate("/");
    }
  }, [userRole, navigate, requiredRoles]);

  if (!userRole || !user) return <div>Loading...</div>;  // Add loading state
    return <>{children(userRole)}</>;
};

export default RoleProtection;
