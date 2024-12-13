import React from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { FilterBar } from '../components/search/FilterBar';
import { BusinessCard } from '../components/BusinessCard';
import { ServicesList } from '../components/services/ServicesList';
import { useSearch } from '../hooks/useSearch';

const categories = [
  'Home Services',
  'Professional Services',
  'Health & Wellness',
  'Automotive',
  'Technology',
  'Education',
];

export function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    results,
    loading,
    error,
  } = useSearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search businesses or services..."
          />
          <FilterBar
            categories={categories}
            selectedCategory={category}
            onCategoryChange={setCategory}
            onSortChange={setSortBy}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((business) => (
              <div key={business.id} className="space-y-4">
                <BusinessCard business={business} />
                <ServicesList businessId={business.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}