import React from 'react';

interface ApplicationCardProps {
  application: object;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {

    return (
        <div className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900/20 p-5 w-1/3 text-left">
        <div className="text-left w-48">
            <p className="text-sm text-gray-500 mb-1">{application.dept}</p>
            <h2 className="text-xl font-bold mb-1">{application.role_name}</h2>
            <div className="flex justify-start">
            {/* <img src={maps_pointer} className="mr-2"></img> */}
            {application.location}
            </div>

            <div className="w-64 flex-col justify-between items-center mt-3">
            <p className="mb-2 text-sm">Skill - Match %</p>
            {/* <ProgressBar
                percentage={parseFloat(role_percentage_match.toFixed(0))}
            /> */}
            </div>
            <div className="flex-col items-center pt-3">
            <h4 className="mb-2 text-sm">Level</h4>
            <h2 className="font-bold text-base">Senior</h2>
            </div>
            <div className="flex-col items-center pt-3">
            <h4 className="mb-2 text-sm">Application Close Date</h4>
            <h2 className="font-bold">{application.appl_close_date}</h2>
            </div>
        </div>
    </div>
    );
  };
  

export default ApplicationCard;
