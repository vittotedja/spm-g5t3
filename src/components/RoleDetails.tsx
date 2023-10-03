import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

interface RoleDetailsProps {
  roleID: string | undefined;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ roleID }) => {
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (roleID === undefined || roleID == "0") {
          throw new Error("roleID is undefined");
        }

        const validRoleID = /^\d+$/.test(roleID);

        if (!validRoleID) {
          throw new Error(`Invalid roleID: ${roleID}`);
        }

        setLoading(true);
        
        const response = await fetch(
          `http://127.0.0.1:8000/api/get_role?roleid=${roleID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoleData(data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., set an error state)
      }
    };

    if (roleID) {
      fetchData();
    }
  }, [roleID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (roleData === null || roleData === undefined) {
    return <div>Error 404 There is no Role with the ID {roleID}</div>;
  }

  const close_date = new Date(roleData.appl_close_date)
    .toISOString()
    .split("T")[0];

  return (
    <div className="w-full lg:w-3/4 mb-8 lg:mb-0">
      <section className="rounded-lg m-2 p-8 min-h-[100%] relative border border-solid border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="flex-grow">
            <div className="flex items-start">
              <div className="flex-grow">
                <h2 className="text-xl text-gray-600 mb-2 text-left">
                  {roleData.dept}
                </h2>
              </div>
              <div className="text-right ml-4">
                <h2 className="text-l text-gray-600 mb-2">
                  Application Close Date
                </h2>
                <h2 className="text-l text-emerald-900 font-bold italic">
                  {close_date}
                </h2>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
              {roleData.role_name}
            </h2>
            <div className="flex items-center mb-4">
              <FaLocationDot className="text-gray-400 mr-2" />
              <p className="text-l text-emerald-900 italic text-left">
                {roleData.location}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <p className="text-l text-gray-800 text-left mr-6">Level</p>
              <p className="text-l text-gray-800 italic text-left">
                {roleData.level}
              </p>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">
              Description
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">
              {roleData.role_desc}
            </p>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">
              Responsibility
            </h3>
            <p className="text-xl text-gray-600 mb-8 text-left">
              {roleData.responsibility}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleDetails;
