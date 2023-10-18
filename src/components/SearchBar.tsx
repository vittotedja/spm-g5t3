import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface SearchBarProps {
  results: Staff[];
  onSearchChange: (name: string) => void;
  placeholder?: string;
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
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showResults, setShowResults] = useState<boolean>(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
        <div className="absolute top-full left-0 w-full mt-2 border border-t-0 rounded-b shadow-lg">
          {results.length > 0 &&
            results.map((result) => (
              <Link
                key={result?.staff_id}
                to={`${result?.link}`}
                className="block p-2 hover:bg-gray-200 bg-white border-black border-b text-left"
              >
                {result?.staff_fname} {result?.staff_lname} - {result?.dept} - {result?.country}
              </Link>
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
