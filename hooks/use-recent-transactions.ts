"use client";
import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export type ExpenseWithRelations = Tables<'expenses'> & {
  people: Pick<Tables<'people'>, 'name'> | null;
  categories: Pick<Tables<'categories'>, 'name' | 'icon'> | null;
};

const fetcher = async ([_key, userId]: [string, string]): Promise<ExpenseWithRelations[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      date,
      people ( name ),
      categories ( name, icon ) 
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  
  return (data as ExpenseWithRelations[]) || [];
};

export function useRecentTransactions() {
  const { user } = useAuth();
  const key = user ? ['recent_transactions', user.id] : null;

  const { data, error, isLoading } = useSWR<ExpenseWithRelations[]>(key, fetcher);

  return {
    transactions: data,
    isLoading,
    error,
  };
}