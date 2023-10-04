import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import Badge from "./Badge";
import { getAsync, postAsync } from "../utilities/Services";
import { setInitial } from "../utilities/Services";

interface SkillsMapProps {
  staffID: string | undefined;
  roleID: string | undefined;
}

const SkillsMapComponent: React.FC<SkillsMapProps> = ({ staffID, roleID }) => {
  const [skillMatchData, setskillMatchData] = useState<any>(null);
  const [applyLoading, setApplyLoading] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setInitial(
        setskillMatchData,
        `api/get_skillmatch?roleid=${roleID}&staffid=${staffID}`
      );
    }
    fetchData();
  }, []);

  console.log(skillMatchData);

  if (skillMatchData === null) {
    return null;
  }
  const handleApply = async () => {
    try {
      setApplyLoading(true);
      const staffID = 4;
      const roleID = 10;
      const response = await getAsync(
        `api/get_totalapplications?staffid=${staffID}&roleid=${roleID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.have_applied) {
        //show have applied modal
        alert("you have already applied for this role");
        setApplyLoading(false);
      } else if (data.total_applications >= 5) {
        //show max limit modal
        alert("More than 5 applications are not allowed!");
        setApplyLoading(false);
      } else {
        //show reason modal
        const reason = window.prompt("Please enter your reason for applying");
        if (reason !== null && reason !== "") {
          //insert data
          const applyResponse = await postAsync("api/get_application", {
            application_id: (Math.floor(Math.random() * 100000) + 1).toString(),
            staff_id: staffID,
            role_id: roleID,
            statement: reason,
          });

          if (!applyResponse.ok) {
            throw new Error(`HTTP error! status: ${applyResponse.status}`);
          }
          const applyData = await applyResponse.json();
          if (applyData) {
            alert("Application submitted successfully!");
          }
          setApplyLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full lg:w-1/4">
      <section className="py-6 px-8 m-2 rounded-lg border border-solid border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-left">
            Skills Match
          </h2>
          <ProgressBar percentage={skillMatchData.percentage} />
          <div>
            <h4 className="text-xl font-bold mb-2 text-left pt-4">
              Required Skills
            </h4>
            <ul>
              {skillMatchData && (
                <>
                  {skillMatchData.In_Both.map((item: string, index: string) => (
                    <li className="flex items-center p-1" key={index}>
                      <Badge styleType="green" children={item} />
                    </li>
                  ))}
                  {skillMatchData.Only_In_Roles.map(
                    (item: string, index: string) => (
                      <li
                        className="flex items-center p-1"
                        style={{ color: "#AD0626" }}
                        key={index}
                      >
                        <Badge styleType="red" children={item} />
                      </li>
                    )
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </section>
      <Button
        styleType="green"
        className="bg-emerald-600 text-white py-2 px-6 ml-3.5 rounded-md text-lg font-semibold hover:bg-emerald-900 w-11/12"
        onClick={handleApply}
        loading={applyLoading}
      >
        Apply
      </Button>
    </div>
  );
};

export default SkillsMapComponent;
