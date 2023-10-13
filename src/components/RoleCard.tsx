import React from "react";
import ProgressBar from "./ProgressBar";
import maps_pointer from "../assets/maps_pointer.svg";
import { Link } from "react-router-dom";
import formatDate from "../utilities/Utiliities";

interface RoleCardProps {
  listing_id: number;
  role_id: number;
  role_name: string;
  role_location?: string | null;
  role_deadline?: string | null;
  role_dept: string;
  role_percentage_match: number;
}

const RoleCard: React.FC<RoleCardProps> = ({
  listing_id,
  role_name,
  role_deadline,
  role_location,
  role_dept,
  role_percentage_match,
}) => {
  var role_deadline_string = formatDate(role_deadline ? new Date(role_deadline) : null);
  return (
    <Link to={`/listing-detail/${listing_id}`}>
      <div className="w-100 border rounded-lg p-6 shadow-md flex justify-between content-center my-6">
        <div className="text-left w-48 items-center my-auto">
          <p className="text-sm text-gray-500 mb-2">{role_dept}</p>
          <h2 className="text-xl font-bold mb-2">{role_name}</h2>
          {role_location && (
            <div className="flex justify-start">
              <img src={maps_pointer} className="mr-2"></img> {role_location}
            </div>
          )}
        </div>
        <div className="w-64 flex-col justify-between items-center mt-3 my-auto">
          <p className="mb-2">Skill - Match %</p>
          <ProgressBar
            percentage={parseFloat(role_percentage_match.toFixed(0))}
          />
        </div>
        <div className="flex-col items-center pt-3 my-auto">
          <h4 className="mb-2 font-bold">Level</h4>
          <h2>Senior</h2>
        </div>
        <div className="flex-col items-center pt-3 my-auto">
          <h4 className="mb-2 font-bold">Application Close Date</h4>
          <h2>{role_deadline ? role_deadline_string : "N.A."}</h2>
        </div>
      </div>
    </Link>
  );
};

export default RoleCard;
