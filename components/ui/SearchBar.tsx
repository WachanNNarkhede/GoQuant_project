'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '@/lib/redux/slice/mapSlice';
import { RootState } from '@/lib/redux/store';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.map);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (value: string) => {
    setLocalQuery(value);
    dispatch(setSearchQuery(value));
  };

  const clearSearch = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search exchanges, regions, cities..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/95 backdrop-blur-sm"
        />
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;