import React, { useEffect, useState } from "react";
import RoleCard from "../components/RoleCard";
import { getAsync } from "../utilities/Services";
import FilterBox from "../components/FilterRoleListing";
import SortComponent from "../components/SortComponent";
import InfiniteScroll from "react-infinite-scroll-component";

interface Role {
  role_id: number;
  created_at: string;
  role_name: string;
  role_desc: string;
  dept: string;
  "deleted?": boolean;
  deleted_At: string | null;
  level: string | null;
  location: string | null;
  appl_close_date: Date | null;
  responsibilities: string | null;
  percentage_match: number;
}

const RoleListing: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [hasMore, setHasMore] = useState(true);

  const fetchFirst = async () => {
    setPage(1); // Reset to the first page
    setRoles([]); // Clear existing roles
    setHasMore(true); // Reset hasMore
    setLoading(true); // Set loading to true

    const response = await getAsync(
      `api/staff_role?userid=1&page=1&limit=5&sort_field=${sortField}&order=${order}`
    );
    const data = await response.json();
    if (data.data.length === 0) {
      setHasMore(false);
    } else {
      setRoles(data.data);
    }
    setLoading(false);
  };

  const fetchMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    var response;
    if (page === 1) {
      response = await getAsync(
        `api/staff_role?userid=1&page=${2}&limit=5&sort_field=${sortField}&order=${order}`
      );
      setPage(2);
    } else {
      response = await getAsync(
        `api/staff_role?userid=1&page=${page}&limit=5&sort_field=${sortField}&order=${order}`
      );
    }

    const data = await response.json();
    if (data.data.length === 0) {
      setHasMore(false);
    } else {
      setRoles((prevRoles) => [...prevRoles, ...data.data]);
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  };

  const handleSortFieldChange = (field: string) => {
    setSortField(field);
  };

  const handleOrderChange = (newOrder: string) => {
    setOrder(newOrder);
  };

  useEffect(() => {
    fetchFirst(); // Fetch the first page of data when the component mounts or when sortField or order changes
  }, [sortField, order]);

  return (
    <div className="flex justify-around">
      <FilterBox />
      <div className="flex-col justify-center w-4/6">
        <h2 className="font-bold text-2xl text-left">Role Listings</h2>
        <SortComponent
          options={[
            { value: "created_at", name: "Created At" },
            { value: "role_name", name: "Role Name" },
            { value: "dept", name: "Department" },
            { value: "appl_close_date", name: "Application Deadline" },
          ]}
          onSortFieldChange={handleSortFieldChange}
          onOrderChange={handleOrderChange}
        />
        <InfiniteScroll
          dataLength={roles.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<span></span>}
        >
          {roles.map((role) => (
            <RoleCard
              key={role.role_id}
              role_ID={role.role_id}
              role_name={role.role_name}
              role_dept={role.dept}
              role_percentage_match={role.percentage_match}
              role_deadline={role?.appl_close_date}
              role_location={role?.location}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default RoleListing;
