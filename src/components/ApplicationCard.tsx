
import React from 'react';
import ProgressBar from './ProgressBar';
import { useState, useEffect } from 'react';
import formatDate from '../utilities/Utiliities';
import { useNavigate } from 'react-router-dom';
import { setInitial } from '../utilities/Services';

interface ApplicationCardProps {
  application: {
    role: {
      role_id: number;
      role_name: string;
      dept: string;
      location: string;
      appl_close_date: string;
    }
    status: 'Applied' | 'Shortlisted' | 'Rejected'
  };
  staff_id: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, staff_id }) => {
  let [skill, setSkill] = useState([]);
  const navigate = useNavigate();
  const roleCardButton = () => {navigate(`/role-listing/${application.role.role_id}`)}
    useEffect(() => {
      setInitial(setSkill, `api/staff_role_skill?staff_id=${staff_id}&role_id=${application.role.role_id}`)
  }, []);

  const statusColorMap = {
    Applied: "text-black",
    Shortlisted: "text-green",
    Rejected: "text-red"
  }

    return (
      <>
        <div className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900/20 p-5 w-1/3 mb-4 mr-4 text-left" onClick={roleCardButton}>
          <div className="text-left">
            <div className="flex">
              <p className="w-1/2 text-sm text-gray-500 mb-1">{application.role.dept}</p>
              <p className={`w-1/2 text-right text-medium ${statusColorMap[application.status]}`}>{application.status}</p>
            </div>
            <h2 className="text-xl font-bold mb-1">{application.role.role_name}</h2>
            <div className="flex justify-start">
              <img src="https://wbsagjngbxrrzfktkvtt.supabase.co/storage/v1/object/public/assets/maps_pointer.png?t=2023-10-03T08%3A55%3A47.598Z" className="mr-2 h-4"></img>
              {application.role.location}
            </div>

            <div className="flex-col justify-between items-center mt-3">
            <p className="mb-2 text-sm">Skill - Match %</p>
            <ProgressBar
                percentage={skill.filter((s: any) => s.qualified).length/skill.length*100}
            />
            
            </div>
            <div className="flex-col items-center pt-3">
              <h4 className="mb-2 text-sm">Level</h4>
              <h2 className="font-bold text-base">Senior</h2>
            </div>
            <div className="flex-col items-center pt-3">
              <h4 className="mb-2 text-sm">Application Close Date</h4>
              <h2 className="font-bold">{formatDate(application.role.appl_close_date? new Date(application.role.appl_close_date): null)}</h2>
            </div>
        </div>
    </div>
    </>
    );
  };
  

export default ApplicationCard;
