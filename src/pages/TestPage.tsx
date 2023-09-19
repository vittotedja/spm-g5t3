import React, { useEffect, useState } from "react";
import RoleCard from "../components/RoleCard";
import { getAsync } from "../utilities/Services";

interface Role {
    Role_ID: number;
    Created_At: string;
    Role_Name: string;
    Role_Desc: string;
    Dept: string;
    "Deleted?": boolean;
    Deleted_At: string | null;
    Level: string | null;
    Location: string | null;
    Appl_Close_Date: Date | null;
    Responsibilities: string | null;
    percentage_match: number;
}

const TestPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAsync("api/roles?userid=1");
      const data = await response.json();
      setRoles(data.data);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div>
      { loading ? (
        <p>Loading...</p>
      ) : (
        roles.map((role) => (
          <RoleCard
            key={role.Role_ID}
            role_name={role.Role_Name}
            role_dept={role.Dept}
            role_percentage_match={role.percentage_match}
            role_deadline={role?.Appl_Close_Date}
            role_location={role?.Location}
          />
        ))
      )}
    </div>
  );
};

export default TestPage;
