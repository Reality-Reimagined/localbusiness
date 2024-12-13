import React from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export function SearchFilters({ onSearch, onCategoryChange }: SearchFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search businesses..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="home">Home Services</option>
          <option value="professional">Professional Services</option>
          <option value="health">Health & Wellness</option>
          <option value="automotive">Automotive</option>
          <option value="tech">Technology</option>
        </select>
      </div>
    </div>
  );
}