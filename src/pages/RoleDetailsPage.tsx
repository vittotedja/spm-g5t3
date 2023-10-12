import RoleDetails from "../components/RoleDetails";
import SkillsMapComponent from "../components/SkillsMap";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { getAsync, postAsync, setInitial } from "../utilities/Services";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/Auth";

interface Staff{
  staff_id: number;
  staff_name: string;
  curr_role: string;
  curr_dept: string;
  location: string;
}

const RoleDetailsPage = () => {
  //const user.staffId = typeof session?.user === 'string' ? session?.user : undefined;
  //TODO: change staffID to be dynamic
  const auth = useAuth();
  const param = useParams<{ listing_id: string }>();
  const [applyLoading, setApplyLoading] = useState<any>(null);
  const [haveAppliedModal, setHaveAppliedModal] = useState(false);
  const [maxLimitModal, setMaxLimitModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [staff, setStaff] = useState<Staff>(Object);
  const staff_email = auth?.user?.email;
  const navigate = useNavigate();
  let listing_id;

  //error handling the id
  if (param.listing_id) {
    if (/^\d+$/.test(param.listing_id)) {
      listing_id = parseInt(param.listing_id);
    } else {
      return <div>Error 404 There is no role Listing Id</div>;
    }
  }

  //fetch staff_id
  useEffect(() => {
    async function fetchFirst() {
      setInitial(setStaff, `api/staff?email=${staff_email}`,false);
    }
    fetchFirst();
  }, []);


  const staff_id = staff.staff_id;
  const listing_ID = listing_id;

  const handleApply = async () => {
    try {
      setApplyLoading(true);
      const response = await getAsync(
        `api/application?staff_id=${staff_id}&role_id=${listing_ID}`
      );
      const data = await response.json();
      const response2 = await getAsync(`api/application?staff_id=${staff_id}`);
      const data2 = await response2.json();
      //check if user has applied to this role
      console.log(data.length);
      if (data.length > 0) {
        // show have applied modal
        setHaveAppliedModal(true);
        //check if user has reached max limit
      } else if (data2.length >= 5) {
        // show max limit modal
        setMaxLimitModal(true);
      } else {
        // show reason modal
        setReasonModal(true);
      }
    } catch (error) {
      // Handle any potential errors here
      console.error(error);
    } finally {
      setApplyLoading(false);
    }
  };

  //handle reason submit, before confirm
  const handleReasonSubmit = async (text: string) => {
    setReason(text);
    setConfirmModal(true);
    setReasonModal(false);
  };
  //handle confirm, and insert to db
  const handleConfirm = async () => {
    const applyResponse = await postAsync("api/application", {
      application_id: (Math.floor(Math.random() * 100000) + 1).toString(),
      staff_id: staff_id,
      listing_id: listing_ID,
      application_status: "Applied",
      application_reason: reason,
    });
    const applyData = await applyResponse.json();
    console.log(applyData);
    if (applyData) {
      setConfirmModal(false);
      setSuccessModal(true);
    }
  };

  if (!staff_id) {
    return null; // or a loading indicator
  }
  
  return (
    <div className="container">
      <div className="flex items-start mb-4 mt-8">
        <button
          className="flex items-center text-emerald-900 hover:underline"
          onClick={() => navigate(`/role-listing`)}
        >
          <AiOutlineArrowLeft />
          Back to Role Listings
        </button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-5/8">
          <RoleDetails role_id={listing_id} />
        </div>
        <div className="lg:w-4/8">
          <SkillsMapComponent staff_id={staff_id} role_id={listing_id} />
          <Button
            styleType="green"
            className="bg-emerald-600 text-white py-2 px-6 mt-4 rounded-md text-lg font-semibold hover:bg-emerald-900 w-full"
            onClick={handleApply}
            loading={applyLoading}
          >
            Apply
          </Button>
        </div>
      </div>
      <Modal
        modalType="fail"
        message="You Have Applied to this Role"
        isOpen={haveAppliedModal}
        onClose={() => setHaveAppliedModal(false)}
      />
      <Modal
        modalType="fail"
        message="You Have Reached the Maximum Applications Limit "
        isOpen={maxLimitModal}
        onClose={() => setMaxLimitModal(false)}
      />
      <Modal
        modalType="reason"
        message="Enter your Reason for Applying to this role "
        isOpen={reasonModal}
        onClose={() => setReasonModal(false)}
        onSubmit={handleReasonSubmit}
      ></Modal>
      <Modal
        modalType="confirmation"
        message="Are you sure you want to apply to this role?"
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onSubmit={handleConfirm}
      ></Modal>
      <Modal
        modalType="success"
        message="You have successfully Applied to the Role"
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
      ></Modal>
    </div>
  );
};

export default RoleDetailsPage;
