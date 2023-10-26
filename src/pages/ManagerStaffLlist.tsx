import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAsync, setInitial } from "../utilities/Services";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import { useAuth } from "../utilities/Auth";
import ProgressBar from "../components/ProgressBar";
import FilterBox from "../components/FilterBox";
import LoadingState from "../components/loadingState";
import confused_guy from "../assets/confused_guy.png";
import SortComponent from "../components/SortComponent";

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

interface ManagerListing {
  listing_id: number;
  listing: {
    listing_id: number;
    creation_date: string;
    updated_at: string;
    deleted_at: string;
    application_close_date: string;
    updated_from: string;
    listing_location: string;
    role_id: number;
    vacancy: number;
    role: {
      role_name: string;
      role_desc: string;
      role_id: number;
      role_department: string;
    };
  };
}

interface Filter {
  name: string;
  values: string[];
}
interface Option {
  value: string;
  name: string;
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
  const [filters, setFilters] = useState<Filter[]>([]);
  const [managerListings, setManagerListings] = useState<ManagerListing[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [validListings, setValidListings] = useState<ManagerListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<String>(
    options[0]?.value
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allStaff.length / itemsPerPage);
  const auth = useAuth();
  const staff_email = auth?.user?.email;

  useEffect(() => {
    setInitial(setStaff, `api/staff?email=${staff_email}`, false);
    setInitial(setListing, `api/listing?listing_id=${selectedListing}`, false);
  }, [staff_email]);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedStaff(allStaff.slice(startIndex, endIndex));
  };

  useEffect(() => {
    if (staff?.staff_id && selectedListing) {
      async function fetchData() {
        setLoading(true);
        const staff_reponse = await getAsync(
          `api/staff?isManager=${true}&staff_id=${
            staff?.staff_id
          }&listing_id=${selectedListing}&filters=${JSON.stringify(
            selectedFilters
          )}`
        );
        const staff_data = await staff_reponse.json();
        setAllStaff(staff_data.data);
        setFilters([
          { name: "Department", values: staff_data.unique_dept },
          { name: "Region", values: staff_data.unique_country },
        ]);
        setLoading(false);
      }
      fetchData();
    }
  }, [staff.staff_id, selectedListing, selectedFilters]);

  useEffect(() => {
    async function fetchManagerListings() {
      const manager_listing_response = await getAsync(
        `api/listing_manager?manager_id=${staff?.staff_id}`
      );
      const manager_listing_data = await manager_listing_response.json();
      setManagerListings(manager_listing_data);
    }
    fetchManagerListings();
  }, [staff.staff_id]);

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

  useEffect(() => {
    setLoading(true);
    const valid: ManagerListing[] = [];
    if (Array.isArray(managerListings)) {
      managerListings &&
        managerListings?.filter((item: ManagerListing) => {
          item?.listing?.deleted_at == null &&
            item?.listing?.vacancy > 0 &&
            item?.listing?.application_close_date > new Date().toISOString() &&
            valid.push(item);
        });
      setValidListings(valid);
    }
  }, [managerListings]);

  useEffect(() => {
    const validOptions = validListings.map((item: ManagerListing) => ({
      value: item?.listing_id.toString(),
      name: `#${item?.listing_id} - ${item?.listing?.role.role_name} - ${item?.listing?.role?.role_department}`,
    }));
    setOptions(validOptions);
    setSelectedListing(validOptions[0]?.value);
  }, [validListings]);

  const handleFilterChange = (name: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [name]: values }));
  };

  const handleSortFieldChange = (field: string) => {
    setSelectedListing(field);
  };

  return (
    <div className="container mx-auto mt-6">
      {validListings.length > 0? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-left">
              {validListings.length > 0 && (
                <h2 className="text-2xl font-bold text-left">
                  Head hunting for{" "}
                  {
                    validListings.find(
                      (item) => item.listing_id.toString() === selectedListing
                    )?.listing.role.role_name
                  }
                </h2>
              )}
              <h4 className="text-xl font-semibold italic">
                Listing ID: {selectedListing}
              </h4>
            </div>
            <SearchBar
              results={searchResults}
              onSearchChange={handleSearchChange}
              placeholder="Search staff..."
            />
          </div>
          <div className="flex overflow-x-auto">
            <div className="w-1/4 pr-4 pt-6">
              <FilterBox
                filters={filters}
                onFilterChange={handleFilterChange}
                selectedFilters={selectedFilters}
                className="mt-0"
              />
            </div>
            <div className="w-3/4">
              {options && (
                <div className="mb-4">
                  <SortComponent
                    options={options}
                    onSortFieldChange={handleSortFieldChange}
                  />
                </div>
              )}
              {!loading ? (
                <>
                  {!loading && allStaff.length === 0 ? (
                    <div className="flex flex-col items-center justify-center my-12 text-center">
                      <img src={confused_guy} width={500} alt="Confused Guy" />
                      <h2 className="text-2xl font-bold">
                        No staff match the selected filters, please try again.
                      </h2>
                    </div>
                  ) : (
                    <table className="min-w-full border border-collapse">
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
                                {staffMember.staff_fname}{" "}
                                {staffMember.staff_lname}
                              </td>
                              <td className="p-4">{staffMember.staff_id}</td>
                              <td className="p-4">{staffMember.email}</td>
                              <td className="p-4">{staffMember.dept}</td>
                              <td className="p-4">
                                <ProgressBar
                                  percentage={staffMember?.match_percentage}
                                />
                              </td>
                              <td className="p-4">{staffMember.country}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </table>
                  )}
                </>
              ) : (
                <LoadingState />
              )}
            </div>
          </div>
          {!loading && (
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
          )}
        </>
      ) : (
        <h1 className="my-auto mx-auto text-3xl text-bold w-1/2">
          You currently do not have any active / vacant listings managed by you, please try
          again.
        </h1>
      )}
    </div>
  );
};

export default ManagerStaffList;
