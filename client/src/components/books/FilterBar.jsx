import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'All Books' },
    { value: 'Want to Read', label: 'Want to Read' },
    { value: 'Currently Reading', label: 'Currently Reading' },
    { value: 'Completed', label: 'Completed' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;