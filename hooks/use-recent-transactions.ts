"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

// 1. O TIPO FOI AJUSTADO: trocamos 'color' por 'icon'.
export type ExpenseWithRelations = Pick<Tables<'expenses'>, 'id' | 'description' | 'amount' | 'date'> & {
  people: Pick<Tables<'people'>, 'name'> | null;
  categories: Pick<Tables<'categories'>, 'name' | 'icon'> | null; // <-- MUDANÇA AQUI
};

const fetcher = async (userId: string): Promise<ExpenseWithRelations[]> => {
  // 2. A QUERY FOI AJUSTADA: selecionamos 'icon' em vez de 'color'.
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      date,
      people ( name ),
      categories ( name, icon ) 
    `) // <-- MUDANÇA AQUI
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  
  return data as ExpenseWithRelations[] || [];
};

export function useRecentTransactions() {
  const { user } = useAuth();
  const key = user ? `recent-transactions-${user.id}` : null;

  const { data, error, isLoading } = useSWR<ExpenseWithRelations[]>(key, fetcher);

  return {
    transactions: data,
    isLoading,
    error,
  };
}