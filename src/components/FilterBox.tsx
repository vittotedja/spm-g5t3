import { useState } from "react";

interface FilterItem {
  name: string;
  values: string[];
}

interface FilterBoxProps {
  filters: FilterItem[];
  onFilterChange: (name: string, value: string[]) => void;
  selectedFilters: Record<string, string[]>;
  className?: string;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  filters,
  onFilterChange,
  selectedFilters,
  className
}) => {
  const [openFilters, setOpenFilters] = useState<string[]>([]);

  const toggleFilter = (filterName: string) => {
    if (openFilters.includes(filterName)) {
      setOpenFilters((prev) => prev.filter((name) => name !== filterName));
    } else {
      setOpenFilters((prev) => [...prev, filterName]);
    }
  };

  const clearAllFilters = () => {
    filters.forEach((filter) => {
      onFilterChange(filter.name, []);
    });
  };

  return (
    <div className={`mt-14 border w-72 shadow-md h-min pb-8 rounded-xl ${className}`}>
      <div className="bg-emerald-900 text-white p-2 mb-4 font-bold rounded-t-xl text-xl">
        Filter
      </div>
      <div
        className="text-xs cursor-pointer mr-4 text-right"
        onClick={clearAllFilters}
      >
        Clear All
      </div>
      {filters.map((filter) => (
        <div key={filter.name}>
          <div
            className="cursor-pointer py-2 flex justify-between px-4"
            onClick={() => toggleFilter(filter.name)}
          >
            {filter.name}
            <img
              src={openFilters.includes(filter.name) ? 'https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/down-arrow%201.svg' : 'https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/down-arrow%201.svg'}
            ></img>
          </div>
          {openFilters.includes(filter.name) && (
            <>
              {filter.values.length === 0 && (
                <div className="text-center text-xs mt-2">
                  No filters available currently
                </div>
              )}
              <div className="pl-4 py-2">
                {filter.values.length > 0 &&
                  filter.values.map((value) => (
                    <div key={value} className="my-2 text-left">
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          className="bg-transparent border border-2 border-olive-green accent-olive-green rounded w-5 h-5 cursor-pointer outline-none mr-2"
                          value={value}
                          checked={(
                            selectedFilters[filter.name] || []
                          ).includes(value)}
                          onChange={(e) => {
                            const updatedValues = e.target.checked
                              ? [...(selectedFilters[filter.name] || []), value]
                              : (selectedFilters[filter.name] || []).filter(
                                  (v) => v !== value
                                );
                            onFilterChange(filter.name, updatedValues);
                          }}
                        />
                        {value}
                      </label>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterBox;
