import { useQuery } from 'react-query';
import { supabase } from '../lib/supabase';
import type { Service } from '../types';

export function useServices(businessId?: string) {
  return useQuery(
    ['services', businessId],
    async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          business_profiles:business_id (
            business_name,
            category
          )
        `);

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Service[];
    },
    {
      enabled: true,
      staleTime: 1000 * 60, // 1 minute
    }
  );
}