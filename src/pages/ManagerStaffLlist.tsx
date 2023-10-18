import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAsync, setInitial } from "../utilities/Services";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import { useAuth } from "../utilities/Auth";
import ProgressBar from "../components/ProgressBar";

interface Staff {
  staff_id: number;
  staff_fname: string;
  staff_lname: string;
  dept: string;
  country: string;
  email: string;
  control_access: number;
  link?: string;
  match_percentage: number;
}

const ManagerStaffList = () => {
  const param = useParams<{ listing_id: string }>();
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [paginatedStaff, setPaginatedStaff] = useState<Staff[]>([]);
  const [searchResults, setSearchResults] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [staff, setStaff] = useState<any>(Object);
  const [loading, setLoading] = useState<boolean>(false);
  const [listing, setListing] = useState<any>(Object);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allStaff.length / itemsPerPage);
  const auth = useAuth();
  const staff_email = auth?.user?.email;

  useEffect(() => {
    setInitial(setStaff, `api/staff?email=${staff_email}`, false);
    setInitial(
      setListing,
      `api/listing?listing_id=${param?.listing_id}`,
      false
    );
  }, [staff_email]);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedStaff(allStaff.slice(startIndex, endIndex));
  };

  useEffect(() => {
    if (staff?.staff_id && param?.listing_id) {
      async function fetchData() {
        setLoading(true);
        const staff_reponse = await getAsync(
          `api/staff?isManager=${true}&staff_id=${staff?.staff_id}&listing_id=${
            param?.listing_id
          }`
        );
        const staff_data = await staff_reponse.json();
        setAllStaff(staff_data);
        setLoading(false);
      }
      fetchData();
    }
  }, [staff.staff_id, param?.listing_id]);

  useEffect(() => {
    if (allStaff.length > 0) {
      setPaginatedStaff(allStaff.slice(0, itemsPerPage));
    }
  }, [allStaff]);

  const handleSearchChange = async (name: string) => {
    if (name.length > 0) {
      const response = await getAsync(
        `api/staff?name=${name}&staff_id=${staff?.staff_id}&listing_id=${param?.listing_id}`
      );
      const data = await response.json();
      setSearchResults(data);
    }
  };

  const getPaginationNumbers = () => {
    const numbers = [];
    numbers.push(currentPage);
    let beforeCurrent = currentPage - 1;
    let afterCurrent = currentPage + 1;

    while (
      numbers.length < 5 &&
      (beforeCurrent >= 1 || afterCurrent <= totalPages)
    ) {
      if (beforeCurrent >= 1) numbers.unshift(beforeCurrent--);
      if (numbers.length < 5 && afterCurrent <= totalPages)
        numbers.push(afterCurrent++);
    }
    return numbers;
  };

  return (
    <div className="container mx-auto mt-6">
      {!loading ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-left">
              Head hunting for {listing?.role?.role_name}
            </h2>
            <SearchBar
              results={searchResults}
              onSearchChange={handleSearchChange}
              placeholder="Search staff..."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-collapse">
              <thead className="border-b">
                <tr className="text-white bg-emerald-900">
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Skill Match</th>
                  <th className="p-3">Country</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((staffMember, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100"
                    onClick={() =>
                      navigate(
                        `/applicant-detail?user_id=${staffMember?.staff_id}`
                      )
                    }
                  >
                    <td className="p-2">
                      {staffMember.staff_fname} {staffMember.staff_lname}
                    </td>
                    <td className="p-4">{staffMember.staff_id}</td>
                    <td className="p-4">{staffMember.email}</td>
                    <td className="p-4">{staffMember.dept}</td>
                    <td className="p-4">
                      <ProgressBar percentage={staffMember?.match_percentage} />
                    </td>
                    <td className="p-4">{staffMember.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-1/2 mt-4 flex justify-between mx-auto mb-4">
              <Button
                onClick={() => handlePageChange(1)}
                styleType={"underline"}
                className={
                  currentPage === 1 ? "cursor-not-allowed" : "hover:underline"
                }
              >
                FIRST
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                styleType={"underline"}
                className={
                  currentPage === 1 ? "cursor-not-allowed" : "hover:underline"
                }
              >
                PREVIOUS
              </Button>
              {getPaginationNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={
                    number === currentPage
                      ? "bg-emerald-900 text-white px-2 rounded"
                      : ""
                  }
                >
                  {number}
                </button>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                styleType={"underline"}
                className={
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "hover:underline"
                }
              >
                NEXT
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                styleType={"underline"}
                className={
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "hover:underline"
                }
              >
                LAST
              </Button>
            </div>
          </div>
        </>
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default ManagerStaffList;
