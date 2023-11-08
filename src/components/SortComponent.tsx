import React, { useState } from "react";

interface Option {
  value: string;
  name: string;
}

interface SortProps {
  options: Option[];
  onSortFieldChange: (field: string) => void;
  onOrderChange?: (order: string) => void;
}

const SortComponent: React.FC<SortProps> = ({
  options,
  onSortFieldChange,
  onOrderChange,
}) => {
  const [sortField, setSortField] = useState(options[0]?.value);
  const [order, setOrder] = useState("asc");

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortField(value);
    onSortFieldChange(value);
  };

  const toggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    setOrder(newOrder);
    if (onOrderChange) {
      onOrderChange(newOrder);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        <label className="mr-2">Sort By</label>
        <select
          value={sortField}
          onChange={handleSortFieldChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="mx-4 my-4">
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {onOrderChange && (
        <button
          onClick={toggleOrder}
          className="flex items-center justify-between"
        >
          <img className="mr-2" src={order === "asc" ? 'https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/down-arrow%201.svg' : 'https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/down-arrow%201.svg'} alt="Order Icon"></img>
          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      )}
    </div>
  );
};

export default SortComponent;
