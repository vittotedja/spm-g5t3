import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { postAsync, putAsync, setInitial } from "../utilities/Services";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Avatar from "react-avatar";
import { useLocation } from "react-router-dom";
import formatDate from "../utilities/Utiliities";

interface Application {
  application_id: number;
  staff_id: number;
  role_id: number;
  application_status: string;
  application_reason: string;
  created_at: string;
  updated_at: string;
  withdrawn_at: string;
  listing: {
    role: {
      role_id: number;
      role_name: string;
    };
  };
}

interface Applicant {
  staff_id: number;
  staff_fname: string;
  staff_lname: string;
  email: string;
  curr_role: {
    role_id: number;
    role_name: string;
    role_department: string;
    role_location: string;
  };
}

interface StaffRoleSkill {
  match_percentage: number;
  skill: Skill[];
}
interface Skill {
  skill_id: number;
  skill_name: string;
  qualified: boolean;
}
[];

interface Role {
  role_id: number;
  role_name: string;
  role_department: string;
  role_location: string;
}

interface Listing {
  listing_id: number;
  application_close_date: string;
}

export default function ApplicantDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams<{ listing_id: string; application_id: string }>();
  const application_id = param.application_id;
  const listing_id = param.listing_id;

  let [application, setApplication] = useState<Application>({} as Application);
  let [applicant, setApplicant] = useState<Applicant>({} as Applicant);
  let [staffRoleSkill, setStaffRoleSkill] = useState<StaffRoleSkill>(Object);
  let [loading, setLoading] = useState(true);
  let [role, setRole] = useState({} as Role);
  let [listing, setListing] = useState({} as Listing);

  useEffect(() => {
    if (application_id && application_id !== "0") {
      async function fetchData() {
        let application = await setInitial(
          setApplication,
          `api/application?application_id=${application_id}`,
          false
        );
        await setInitial(
          setApplicant,
          `api/staff?staff_id=${application.staff_id}`,
          false
        );
        setInitial(
          setStaffRoleSkill,
          `api/staff_role_skill?staff_id=${application.staff_id}&role_id=${application.listing.role.role_id}`
        );
        setLoading(false);
      }
      fetchData();
    } else {
      async function fetchData() {
        await setInitial(
          setApplicant,
          `api/staff?staff_id=${location?.state?.staff_id}`,
          false
        );
        setInitial(
          setStaffRoleSkill,
          `api/staff_role_skill?staff_id=${location?.state?.staff_id}&role_id=${location?.state?.role_id}`
        );
        setInitial(
          setRole,
          `api/role?role_id=${location?.state?.role_id}`,
          false
        );
        setInitial(setListing, `api/listing?listing_id=${listing_id}`, false);
        setLoading(false);
      }
      fetchData();
    }
  }, []);

  async function update_application(status: string) {
    let res = await putAsync("api/application", {
      application_id: application_id,
      application_status: status,
    });
    res.ok
      ? setApplication({ ...application, application_status: status })
      : alert("Error updating application status");
  }

  const inviteToApply = async () => {
    let res = await postAsync(`api/notification?listing_id=${listing_id}&staff_id=${location?.state?.staff_id}`,"");
    console.log(res)
    res.ok
      ? alert("Invitation sent!")
      : alert("Error sending invitation");
  }

  // TODO: show which role this application is for
  return (
    <>
      <div
        className="container flex w-4/5 h-6 px-4 mx-auto mt-10 space-x-2 text-left cursor-pointer"
        onClick={() => navigate(`/manager/applicants-list/${listing_id}`)}
        data-testid="back-to-applicants-list"
      >
        <AiOutlineArrowLeft className="text-2xl" />
        <p className="font-medium text-md">Back to Applicants List</p>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container w-4/5 px-4 mx-auto mt-10">
          {role && listing && !loading && (
            <div className="text-2xl font-bold text-left mb-8">
              <h2 className="text-xl font-bold text-left">
                Head hunting for {role?.role_name}
              </h2>
              <hr className="my-1 bg-slate-500" />
              <h4 className="text-base font-normal">
                Listing ID: {listing?.listing_id}
              </h4>
              <h4 className="text-base font-normal">
                Department:
                {role?.role_department}
              </h4>
              {listing && (
                <h4 className="text-base font-normal">
                  Application Close Date:{" "}
                  {formatDate(new Date(listing?.application_close_date))}{" "}
                </h4>
              )}
            </div>
          )}
          <div className="container space-y-6 md:flex">
           {<div className="container flex p-0 space-x-6 md:w-9/12">
              <div className="text-left">
                <Avatar
                  name={`${applicant.staff_fname} ${applicant.staff_lname}`}
                  size="100"
                  round={true}
                />
              </div>
              <div className="text-left">
                <p
                  className="text-2xl font-extrabold"
                  data-testid="applicant-details-name"
                >
                  {applicant.staff_fname + " " + applicant.staff_lname}
                </p>
                <p className="text-base italic font-bold">
                  {applicant.curr_role.role_name}
                </p>
                <p className="text-base italic font-medium">
                  {applicant.curr_role.role_department}
                </p>
                <p className="text-base italic font-light">
                  {applicant.curr_role.role_location}
                </p>
              </div>
            </div>}
            {application_id && application_id == "0" && (
              <div className="flex w-3/12 space-x-2 text-right md:justify-end">
                <Button
                  styleType="green"
                  id="shortlist-button"
                  onClick={() => inviteToApply()}
                >
                  Invite to Apply
                </Button>
              </div>
            )}
            {application_id && application_id !== "0" && (
              <div className="flex w-3/12 space-x-2 text-right md:justify-end">
                {application.application_status === "Applied" ? (
                  <>
                    <Button
                      styleType="green"
                      id="shortlist-button"
                      onClick={() => update_application("Shortlisted")}
                    >
                      Shortlist
                    </Button>
                    <Button
                      styleType="red"
                      id="reject-button"
                      onClick={() => update_application("Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  application_id &&
                  application_id !== "0" && (
                    <Badge
                      styleType={
                        ["Shortlisted", "Accepted"].includes(
                          application.application_status
                        )
                          ? "green"
                          : "red"
                      }
                    >
                      {application.application_status}
                    </Badge>
                  )
                )}
              </div>
            )}
          </div>

          <div className="container mt-8">
            <p className="mb-3 text-2xl font-extrabold text-left">
              Skills-Match %
            </p>
            <ProgressBar percentage={staffRoleSkill.match_percentage} />
          </div>

          <div className={ role ? "container mt-8 pb-8" : "container mt-8"}>
            <p className="mb-3 text-2xl font-extrabold text-left">Skills</p>
            <div className="text-left">
              {staffRoleSkill.skill &&
                staffRoleSkill.skill.map((sk) => (
                  <Badge
                    key={sk.skill_name}
                    styleType={sk.qualified ? "green" : "red"}
                  >
                    {sk.skill_name}
                  </Badge>
                ))}
            </div>
          </div>

          {application_id && application_id !== "0" && (
            <div className="container mt-8">
              <p className="font-extrabold text-left text-2xl mb-3">
                Reason for Applying
              </p>
              <p className="font-medium text-md text-left">
                {application.application_reason}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
