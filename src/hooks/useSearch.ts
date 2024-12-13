import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('business_profiles')
          .select(`
            *,
            services (*),
            reviews (
              rating
            )
          `);

        // Apply search filter
        if (searchQuery) {
          query = query.or(`business_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        // Apply category filter
        if (category) {
          query = query.eq('category', category);
        }

        // Apply sorting
        switch (sortBy) {
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'reviews':
            // This would need a count of reviews in the actual implementation
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) throw supabaseError;

        setResults(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, category, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    results,
    loading,
    error,
  };
}