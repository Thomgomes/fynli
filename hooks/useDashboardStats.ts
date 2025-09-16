import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


type DashboardStats = {
  total_selected_month: number;
  total_all_time: number;
  top_person_name: string | null;
  top_person_amount: number | null;
};

// O "fetcher" é uma função que busca os dados. SWR vai chamá-la.
const fetcher = async ([userId, year, month]: [string, number, number]): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc('get_dashboard_stats', { 
    user_id_param: userId,
    filter_year: year,
    filter_month: month
  });

  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
};

export function useDashboardStats({ year, month }: { year: number; month: number }) {
  const { user } = useAuth();
  
  const key = user ? [user.id, year, month] : null;

  const { data, error, isLoading } = useSWR<DashboardStats>(key, fetcher);

  return {
    stats: data,
    isLoading,
    error,
  };
}