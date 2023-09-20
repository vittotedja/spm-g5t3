import { useState } from "react";
import RoleDetails from "../components/RoleDetails";
import SkillsMapComponent from "../components/SkillsMap";

const RoleDetailsPage = () => {
  const jobsApplied = 4;
  const [appliedJobs, setAppliedJobs] = useState(jobsApplied);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMaxLimit, setShowMaxLimit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const roleName = "SPM Prof";
  const staffID = 1;
  const roleID = 1;


  const handleConfirm = () => {
    // Handle the apply action here
    // ...
    setShowSuccess(true);
    setAppliedJobs(appliedJobs + 1); // Increment applied jobs count
  };

  const closePage = () => {
    setShowConfirmation(false);
    setShowMaxLimit(false);
    setShowSuccess(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <div className="flex flex-col lg:flex-row">
        <RoleDetails roleID={roleID} />
        <SkillsMapComponent staffID={staffID} roleID={roleID}/>
      </div>


      {showConfirmation && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to apply?</p>
            <div className="mt-4 text-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
                onClick={handleConfirm}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full"
                onClick={closePage}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showMaxLimit && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>You have applied to max 5 Jobs</p>
            <div className="mt-4 text-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
                onClick={closePage}
              >
                Back to Page
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>You have successfully applied to the job {roleName}</p>
            <div className="mt-4 text-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
                onClick={closePage}
              >
                Back to Page
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
                onClick={closePage}
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default RoleDetailsPage;
