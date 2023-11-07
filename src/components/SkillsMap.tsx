import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Badge from "./Badge";
import { setInitial } from "../utilities/Services";
import LoadingState from "./loadingState";
interface SkillsMapProps {
  staff_id: number | undefined;
  listing_id: number | undefined;
}

interface Skill {
  skill_name: string;
  skill_desc: string;
  skill_id: number;
  qualified: boolean;
}

const SkillsMapComponent: React.FC<SkillsMapProps> = ({
  staff_id,
  listing_id,
}) => {
  const [skillMatchData, setskillMatchData] = useState<any>(null);
  const [listingData, setListingData] = useState<any>(null);
  const [role_id, setRoleId] = useState<number | null>(null);
  let [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      try {
        await setInitial(
          setListingData,
          `api/listing?listing_id=${listing_id}`,
          false
        );

        if (listingData) {
          const roleId = listingData ? listingData.role_id : null;
          setRoleId(roleId);

          if (roleId !== null) {
            await setInitial(
              setskillMatchData,
              `api/staff_role_skill?staff_id=${staff_id}&role_id=${roleId}`
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [staff_id, listing_id]);

  if (skillMatchData === null || role_id === null) {
    return null;
  }

  const qualifiedSkills: Skill[] = skillMatchData?.skill.filter(
    (skill: Skill) => skill.qualified
  );

  const unqualifiedSkills: Skill[] = skillMatchData?.skill.filter(
    (skill: Skill) => !skill.qualified
  );

  return (
    <div className="min-w-[400px] max-h-[500px] overflow-y-auto border border-gray-200 border-solid rounded-lg">
      <section className="px-8 py-6">
        {loading ? (
          <LoadingState />
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-left text-gray-800">
              Skills Match
            </h2>
            <ProgressBar percentage={skillMatchData.match_percentage} />
            <div>
              <h4 className="pt-4 mb-2 text-xl font-bold text-left">
                Required Skills
              </h4>
              <ul>
                {skillMatchData && (
                  <>
                    {qualifiedSkills.map((skill) => (
                      <li key={skill.skill_id} className="flex items-center">
                        <Badge
                          styleType="green"
                          className="text-xs"
                          children={skill.skill_name}
                        />
                      </li>
                    ))}
                    {unqualifiedSkills.map((skill) => (
                      <li key={skill.skill_id} className="flex items-center">
                        <Badge
                          styleType="red"
                          className="text-xs"
                          children={skill.skill_name}
                        />
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SkillsMapComponent;
