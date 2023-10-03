import RoleDetails from "../components/RoleDetails";
import SkillsMapComponent from "../components/SkillsMap";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";


const RoleDetailsPage = () => {

  //const user.staffId = typeof session?.user === 'string' ? session?.user : undefined;
  const staffID = "1"
  console.log(staffID)
  const role_ID = useParams<{ role_ID: string | undefined }>();
  

  return (
    <div className="container mx-auto p-4 max-w-screen-xl">
      <div className="flex items-start mb-4">
        <button
          className="flex items-center text-emerald-900 hover:underline"
          onClick={() => window.history.back()}
        >
          <AiOutlineArrowLeft />
          Back to Role Listings
        </button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <RoleDetails roleID={role_ID.role_ID} />
        <SkillsMapComponent staffID={staffID} roleID={role_ID.role_ID} />
      </div>
    </div>
  );
};

export default RoleDetailsPage;
