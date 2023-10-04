import ProgressBar from "../components/ProgressBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import Button from "../components/Button";
import { setInitial } from "../utilities/Services";
import { useNavigate } from "react-router-dom";


interface Role {
  role_id: number,
  role_name: string,
  created_at: string,
  appl_close_date: string,
  dept: string,
  level: string,
  location: string
}

const ApplicantsListPage = () => {
  const navigate = useNavigate()
  const role_ID = useParams<{ role_ID: string | undefined }>();
  const [roleData, setRoleData] = useState<Role>(Object);
  const roleid = role_ID.role_ID;
  const [applicantsData, setApplicantsData] = useState<String>(Object);
  const [view, setView] = useState<string>("Pending");

  /*useEffect(() => {
    async function fetchData() {
        let role = await setInitial(setRoleData,`api/get_role?roleid=${roleid}`)
        console.log(role);
      }

    }
    fetchData()
    const fetchApplicants = async () => {
      try {
        const response = await getAsync(`api/get_applicants?roleid=${roleid}`);
        const data = await response.json();
        setApplicantsData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., set an error state)
      }
    };

    if (roleid) {
      fetchApplicants();
    }

    
  }, [roleid]);*/
  
  useEffect(() => {
    async function fetchData() {
        setInitial(setRoleData, `api/get_role?roleid=${roleid}`, false);
    }
    fetchData();
  }, []);

  console.log(roleData);


  if (!applicantsData) {
    return <div>Loading...</div>;
  }

  if (!roleData) {
    return (
      <div className="text-3xl">
        Error 404 There is no Role with the ID {roleid}
      </div>
    );
  }

  let totalRows = 0;

  for (const key in applicantsData) {
    if (applicantsData.hasOwnProperty(key)) {
      totalRows++;
    }
  }

  /*const close_date = new Date(roleData.appl_close_date)
    .toISOString()
    .split("T")[0];

  const create_date = new Date(roleData.created_at).toISOString().split("T")[0];*/

  const selectShortlist = async () => {
    setView("Shortlisted");
  };
  const selectApplicants = async () => {
    setView("Pending");
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <button
          className="flex items-center text-emerald-900 hover:underline"
          onClick={() => window.history.back()}
        >
          <AiOutlineArrowLeft />
          Back to Role Listings
        </button>
        <Button
          styleType="green"
          className="mr-10"
          onClick={() => (window.location.href = `/update-role/${roleid}`)}
        >
          Update Role
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg lg:mb-0">
          <section className="rounded-lg m-2 border border-solid border-gray-200 mb-10 overflow">
            <div className="max-w-4xl p-8 pl-10 pb-0 flex flex-col lg:flex-row">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:pr-96 lg:mr-60">
                  <h2 className="text-3xl font-bold text-gray-800 text-left mb-3 whitespace-normal max-h-16">
                    {roleData.role_name}
                  </h2>
                  <p className="text-l text-gray-600 text-left mb-1 whitespace-nowrap">
                    {"create_date"}
                  </p>
                  <div className="flex items-center">
                    <FaLocationDot className="text-gray-400" />
                    <p className="text-l text-emerald-900 italic text-left ml-2">
                      {roleData.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 p-4 mb-3 lg:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  No of Applicants
                </h3>
                <p className="text-l text-gray-600 text-left">{totalRows}</p>
              </div>
              <div className="w-full lg:w-1/3 p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-left">
                  Department
                </h3>
                <p className="text-l text-gray-600 text-left">
                  {roleData.dept}
                </p>
              </div>
              <div className="w-full lg:w-1/3 p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-left">
                  Application Close Date
                </h3>
                <p className="text-l text-emerald-900 mb-4 font-bold italic">
                  {"close_date"}
                </p>
              </div>
            </div>
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "-1px",
            }}
          >
            <button
              className={`hover:bg-gray-500 ${
                view === "Pending" ? "bg-emerald-900" : "bg-gray-200"
              } text-white py-2 px-6 rounded-md text-lg font-semibold`}
              style={{
                borderBottomRightRadius: "0",
                borderBottomLeftRadius: "0",
                marginLeft: "1px",
              }}
              onClick={selectApplicants}
            >
              Applicants
            </button>
            <button
              className={`hover:bg-gray-500 ${
                view === "Shortlisted" ? "bg-emerald-900" : "bg-gray-300"
              } text-white py-2 px-6 rounded-md text-lg font-semibold`}
              style={{
                borderBottomRightRadius: "0",
                borderBottomLeftRadius: "0",
              }}
              onClick={selectShortlist}
            >
              Shortlisted
            </button>
          </div>
          <div className="overflow-x-auto">
            <div
              className="rounded overflow-hidden border"
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                borderTopLeftRadius: "0",
              }}
            >
              <table
                className="min-w-full border-collapse border"
                style={{
                  borderRadius: "10px",
                  borderTopLeftRadius: "0",
                  overflow: "hidden",
                  border: "green",
                  borderTop: "none",
                }}
              >
                <thead className="border-b">
                  <tr className="bg-emerald-900 text-white">
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Staff ID</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Current Role</th>
                    <th className="p-3">Current Department</th>
                    <th className="p-3">Location</th>
                    <th className="p-4">Skill Match (%)</th>
                  </tr>
                </thead>
                {/*<tbody>
                  {(() => {
                    if (applicantsData.length === 0) {
                      return (
                        <tr className="border-b">
                          <td colSpan={7} className="p-4 text-center">
                            No Applicants Yet
                          </td>
                        </tr>
                      );
                    } else {
                      const rows = [];
                      for (let i = 0; i < totalRows; i++) {
                        const applicant = applicantsData[i];
                        const staff_id = applicant.staff.staff_id;
                        const applicationId = applicant.application_id;
                        if (applicant.status === view) {
                          rows.push(
                            <tr
                              key={i}
                              className="border-b hover:bg-gray-100"
                              onClick={() => navigate(`/applicant-detail/${applicationId}`)}
                            >
                              <td className="p-2">
                                {applicant.staff.staff_name}
                              </td>
                              <td className="p-4">{staff_id}</td>
                              <td className="p-4">{applicant.staff.email}</td>
                              <td className="p-4">
                                {applicant.staff.curr_role}
                              </td>
                              <td className="p-4">
                                {applicant.staff.curr_dept}
                              </td>
                              <td className="p-4">
                                {applicant.staff.location}
                              </td>
                              <td className="p-4">
                                <ProgressBar
                                  percentage={parseInt(
                                    applicant.percentage_match
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        }
                      }
                      if (!roleData && !applicantsData) {
                        return <div>Loading...</div>;
                      }
                      return rows;
                    }
                  })()}
                </tbody>*/}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsListPage;
