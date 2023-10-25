import React from "react";
import ProgressBar from "./ProgressBar";
import { useState, useEffect } from "react";
import formatDate from "../utilities/Utiliities";
import { useNavigate } from "react-router-dom";
import { setInitial } from "../utilities/Services";
import { AiFillEnvironment } from "react-icons/ai";

interface ApplicationCardProps {
  application: {
    application_id: number;
    applied_at: string;
    withdrawn_at: string;
    staff_id: number;
    application_reason: string;
    application_status: "Applied" | "Shortlisted" | "Rejected" | "Withdrawn";
    updated_at: string;
    listing_id: number;
    listing: {
      listing_id: number;
      role_id: number;
      creation_date: string;
      updated_at: string;
      deleted_at: string;
      updated_from: string;
      listing_location: string;
      application_close_date: string;
    };
  };
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  let [skill, setSkill] = useState<any>({});
  let [role, setRole] = useState<any>({});
  const navigate = useNavigate();
  const roleCardButton = () => {
    navigate(`/listing-detail/${application.listing.listing_id}`);
  };
  useEffect(() => {
    setInitial(
      setSkill,
      `api/staff_role_skill?staff_id=${application.staff_id}&role_id=${application.listing?.role_id}`
    );
    setInitial(
      setRole,
      `api/role?role_id=${application.listing.role_id}`,
      false
    );
  }, []);

  const statusColorMap = {
    Applied: "text-black",
    Shortlisted: "text-green",
    Rejected: "text-red",
    Withdrawn: "text-gray-500",
  };

  return (
    <>
      <div
        className="rounded-lg shadow-md ring-2 ring-outset ring-emerald-900/20 p-5 w-1/3 mb-4 mr-4 text-left"
        onClick={roleCardButton}
      >
        <div className="text-left">
          <div className="flex">
            <p className="w-1/2 text-sm text-gray-500 mb-1">
              {role.role_department}
            </p>
            <p
              className={`w-1/2 text-right text-medium ${
                statusColorMap[application.application_status]
              }`}
            >
              {application.application_status}
            </p>
          </div>
          <h2 className="text-xl font-bold mb-1">{role.role_name}</h2>
          <div className="flex justify-start">
            <AiFillEnvironment className="h-6 mr-1" />
            {application.listing?.listing_location}
          </div>

          <div className="flex-col justify-between items-center mt-5 mb-3">
            <p className="mb-2 text-sm">Skill - Match %</p>
            {skill && <ProgressBar percentage={skill.match_percentage} />}
          </div>
          <div className="flex-col items-center pt-3">
            <h4 className="mb-2 text-sm">Application Close Date</h4>
            <h2 className="font-bold">
              {formatDate(
                application.listing?.application_close_date
                  ? new Date(application.listing.application_close_date)
                  : null
              )}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationCard;
