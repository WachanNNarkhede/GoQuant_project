'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '@/lib/redux/slice/mapSlice';
import { RootState } from '@/lib/redux/store';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.map);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    setLocalQuery(value);
    dispatch(setSearchQuery(value));
  };

  const clearSearch = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
    setIsExpanded(false);
  };

  return (
    <div className="relative w-full">
      {/* Mobile Collapsed Search */}
      <div className="lg:hidden">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm">Search exchanges...</span>
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search exchanges, regions..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              autoFocus
            />
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop Search */}
      <div className="hidden lg:block relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search exchanges, regions, cities..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {localQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;