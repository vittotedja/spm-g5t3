import React, { useState } from "react";
import arrowDown from "../assets/down-arrow 1.svg";
import arrowUp from "../assets/down-arrow 2.svg";

interface Option {
  value: string;
  name: string;
}

interface SortProps {
  options: Option[];
  onSortFieldChange: (field: string) => void;
  onOrderChange: (order: string) => void;
}

const SortComponent: React.FC<SortProps> = ({
  options,
  onSortFieldChange,
  onOrderChange,
}) => {
  const [sortField, setSortField] = useState(options[0].value);
  const [order, setOrder] = useState("asc");

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortField(value);
    onSortFieldChange(value);
  };

  const toggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    onOrderChange(newOrder);
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        <label className="mr-2">Sort By</label>
        <select
          value={sortField}
          onChange={handleSortFieldChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={toggleOrder}
        className="flex items-center justify-between"
      >
        <img className="mr-2" src={order === "asc" ? arrowUp : arrowDown}></img>
        {order === "asc" ? "Ascending" : "Descending"}
      </button>
    </div>
  );
};

export default SortComponent;