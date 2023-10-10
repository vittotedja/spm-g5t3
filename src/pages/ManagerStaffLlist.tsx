import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAsync } from "../utilities/Services";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";

interface Staff {
  staff_id: number;
  staff_fname: string;
  staff_lname: string;
  dept: string;
  country: string;
  email: string;
  control_access: number;
  link?: string;
}

const ManagerStaffList = () => {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [paginatedStaff, setPaginatedStaff] = useState<Staff[]>([]);
  const [searchResults, setSearchResults] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allStaff.length / itemsPerPage);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedStaff(allStaff.slice(startIndex, endIndex));
  };

  useEffect(() => {
    async function fetchData() {
      const staff_reponse = await getAsync(`api/staff?isManager=${true}`);
      const staff_data = await staff_reponse.json();
      setAllStaff(staff_data);
      setPaginatedStaff(staff_data.slice(0, itemsPerPage));
    }
    fetchData();
  }, []);

  const handleSearchChange = async (name: string) => {
    const response = await getAsync(`api/staff?name=${name}`);
    const data = await response.json();
    setSearchResults(data);
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
      <div className="flex items-center justify-between mb-4">
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
              <th className="p-3">Country</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.map((staffMember, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100"
                onClick={() => navigate(`/applicantdetail?user_id=${staffMember?.staff_id}`)}
              >
                <td className="p-2">
                  {staffMember.staff_fname} {staffMember.staff_lname}
                </td>
                <td className="p-4">{staffMember.staff_id}</td>
                <td className="p-4">{staffMember.email}</td>
                <td className="p-4">{staffMember.dept}</td>
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
          {currentPage > 1 && (
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              styleType={"underline"}
              className={
                currentPage === 1 ? "cursor-not-allowed" : "hover:underline"
              }
            >
              PREV
            </Button>
          )}
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
          {currentPage < totalPages && (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              styleType={"underline"}
              className={
                currentPage === totalPages ? "cursor-not-allowed" : "hover:underline"
              }
            >
              NEXT
            </Button>
          )}
          <Button
            onClick={() => handlePageChange(totalPages)}
            styleType={"underline"}
            className={
              currentPage === totalPages ? "cursor-not-allowed" : "hover:underline"
            }
          >
            LAST
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManagerStaffList;
