"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


// 1. O TIPO FOI AJUSTADO PARA REFLETIR EXATAMENTE O QUE A QUERY 'select' RETORNA.
export type ExpenseWithRelations = {
  id: string;
  description: string;
  amount: number;
  date: string;
  people: { name: string } | null;
  categories: { name: string; color: string | null } | null;
};

const fetcher = async (userId: string): Promise<ExpenseWithRelations[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      date,
      people ( name ),
      categories ( name, color )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  
  // Agora o tipo 'data' corresponde perfeitamente ao nosso tipo customizado.
  return data || [];
};

export function useRecentTransactions() {
  const { user } = useAuth();
  const key = user ? user.id : null;

  const { data, error, isLoading } = useSWR<ExpenseWithRelations[]>(key, fetcher);

  return {
    transactions: data,
    isLoading,
    error,
  };
}