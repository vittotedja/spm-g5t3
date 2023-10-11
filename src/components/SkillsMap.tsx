import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Badge from "./Badge";
import { setInitial } from "../utilities/Services";
interface SkillsMapProps {
  staff_id: number | undefined;
  role_id: number | undefined;
}

interface Skill {
  skill_name: string;
  skill_desc: string;
  skill_id: number;
  qualified: boolean;
}

const SkillsMapComponent: React.FC<SkillsMapProps> = ({ staff_id, role_id }) => {
  const [skillMatchData, setskillMatchData] = useState<any>(null);


  useEffect(() => {
    async function fetchData() {
      setInitial(
        setskillMatchData,
        `api/staff_role_skill?staff_id=${staff_id}&role_id=${role_id}`
      );
    }
    fetchData();
  }, []);

  console.log(skillMatchData);

  if (skillMatchData === null) {
    return null;
  }

  const qualifiedSkills: Skill[] = skillMatchData.skill.filter(
    (skill: Skill) => skill.qualified
  );

  const unqualifiedSkills: Skill[] = skillMatchData.skill.filter(
    (skill: Skill) => !skill.qualified
  );

  return (
    <div className="min-w-[400px] max-h-[600px] overflow-y-auto border border-gray-200 border-solid rounded-lg">
      <section className="px-8 py-6">
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
                      <Badge styleType="green" children={skill.skill_name} />
                    </li>
                  ))}
                  {unqualifiedSkills.map((skill) => (
                    <li key={skill.skill_id} className="flex items-center">
                      <Badge styleType="red" children={skill.skill_name} />
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </section>
      
    </div>
    
  );
};


export default SkillsMapComponent;
