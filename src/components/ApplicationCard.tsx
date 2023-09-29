
import React from 'react';
import ProgressBar from './ProgressBar';
import { useState, useEffect } from 'react';
import formatDate from '../utilities/Utiliities';
import maps_pointer from "../assets/maps_pointer.svg"
import { useNavigate } from 'react-router-dom';

interface ApplicationCardProps {
  application: {
    role_id: number;
    role_name: string;
    dept: string;
    location: string;
    appl_close_date: string;
  };
  staff_id: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, staff_id }) => {
  let [skill, setSkill] = useState([]);
  const navigate = useNavigate();
  const roleCardButton = () => {navigate(`/role-listing/${application.role_id}`)}
    useEffect(() => {
      
      fetch(`http://localhost:8000/api/get_staff_role_skill?staff_id=${staff_id}&role_id=${application.role_id}`)
          .then((res) => res.json())
          .then((data) => {
              setSkill(data);
              console.log(Object.entries(data))
          });
  }, []);


    return (
      <>
        <div className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900/20 p-5 w-1/3 mb-4 mr-4 text-left" onClick={roleCardButton}>
        <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">{application.dept}</p>
            <h2 className="text-xl font-bold mb-1">{application.role_name}</h2>
            <div className="flex justify-start">
            <img src={maps_pointer} className="mr-2"></img>
            {application.location}
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
            <h2 className="font-bold">{formatDate(application.appl_close_date? new Date(application.appl_close_date): null)}</h2>
            </div>
        </div>
    </div>
    </>
    );
  };
  

export default ApplicationCard;
