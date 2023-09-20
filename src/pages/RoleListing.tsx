import React, { useEffect, useState } from "react";
import RoleCard from "../components/RoleCard";
import { getAsync } from "../utilities/Services";
import FilterBox from "../components/FilterRoleListing";

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

const RoleListing: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAsync(
        `api/roles?userid=1&page=${page}&limit=5`
      );
      const data = await response.json();
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setRoles((prevRoles) => [...prevRoles, ...data.data]);
        setPage((prevPage) => prevPage + 1);
      }
      setRoles(data.data);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className="flex justify-around">
      <FilterBox />
      <div className="flex-col justify-center w-4/6">
        <h2 className="font-bold text-2xl text-left">Role Listings</h2>
        {loading ? (
          <p className="text-left">Loading...</p>
        ) : (
          roles.map((role) => (
            <RoleCard
              key={role.Role_ID}
              role_ID={role.Role_ID}
              role_name={role.Role_Name}
              role_dept={role.Dept}
              role_percentage_match={role.percentage_match}
              role_deadline={role?.Appl_Close_Date}
              role_location={role?.Location}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RoleListing;
