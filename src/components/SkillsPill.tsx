import React from 'react';

interface SkillsPillProps {
  skill: string;
}

const SkillsPill: React.FC<SkillsPillProps> = ({ skill }) => {

    return (
        <span className="inline-flex items-center rounded-md  px-3 py-1 text-base font-medium text-green-600 ring-2 ring-inset ring-emerald-600 mr-2 mb-2">
        {skill}
        </span>
    );
  };
  

export default SkillsPill;
