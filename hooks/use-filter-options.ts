"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type FilterOption = {
  year: number;
  months: number[];
};

const fetcher = async ([_key, userId]: [string, string]): Promise<FilterOption[]> => {
  const { data, error } = await supabase.rpc('get_filter_options', { 
    user_id_param: userId
  });

  if (error) {
    console.error("SWR Fetcher Error (useFilterOptions):", error);
    throw new Error(error.message);
  }
  
  return (data as FilterOption[]) || [];
};

export function useFilterOptions() {
  const { user } = useAuth();
  const key = user ? ['filter_options', user.id] : null;

  const { data, error, isLoading } = useSWR<FilterOption[]>(key, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    options: data,
    isLoadingOptions: isLoading,
    error,
  };
}