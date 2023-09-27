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
      <select
        value={sortField}
        onChange={handleSortFieldChange}
        className="border p-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      <button onClick={toggleOrder} className="flex items-center justify-between">
        <img className="mr-2" src={order === "asc" ? arrowUp : arrowDown}></img>
        {order === "asc" ? "Ascending" : "Descending"}
      </button>
    </div>
  );
};

export default SortComponent;
