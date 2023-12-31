import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  results: Staff[];
  onSearchChange: (name: string) => void;
  placeholder?: string;
  listingId: string;
  roleId: string;
}
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

const SearchBar: React.FC<SearchBarProps> = ({
  results,
  onSearchChange,
  placeholder,
  listingId,
  roleId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showResults, setShowResults] = useState<boolean>(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  useEffect(() => {
    setShowResults(results.length > 0);
  }, [results]);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(e.target as Node)
    ) {
      setShowResults(false);
    }
  };
  const handleInputClick = () => {
    setShowResults(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative w-72" ref={searchInputRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
      />
      {showResults && (
        <div className="absolute top-full left-0 w-full mt-2 border border-t-0 rounded-b shadow-lg z-50">
          {results.length > 0 &&
            results.map((result) => (
              <div
                key={result?.staff_id}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/manager/applicants-list/${listingId}/applicant-detail/0`,
                    {
                      state: {
                        staff_id: result?.staff_id,
                        role_id: roleId,
                      },
                    }
                  );
                }}
                className="block p-2 hover:bg-gray-200 bg-white border-gray-400 border-b text-left"
              >
                {result?.staff_fname} {result?.staff_lname} - {result?.dept} -{" "}
                {result?.country}
              </div>
            ))}
          {results.length === 0 && searchTerm.length > 0 && (
            <div className="block p-2 hover:bg-gray-200 bg-white">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
