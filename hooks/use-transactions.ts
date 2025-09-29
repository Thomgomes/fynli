"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

// Tipo para os filtros que podemos aplicar
export interface TransactionFilters {
  personId?: string;
  categoryId?: string;
  dateRange?: { from: Date; to: Date };
}

// Tipo para a paginação
export interface PaginationState {
  pageIndex: number; // A página atual, começando em 0
  pageSize: number;  // Quantos itens por página
}

// Tipo para a resposta do fetcher, que inclui os dados e a contagem total
export interface TransactionsResponse {
  transactions: ExpenseWithRelations[];
  count: number;
}

export type ExpenseWithRelations = Tables<'expenses'> & {
  people: Pick<Tables<'people'>, 'name'> | null;
  categories: Pick<Tables<'categories'>, 'name' | 'icon'> | null;
};

const fetcher = async ([_key, userId, filters, pagination]: [string, string, TransactionFilters, PaginationState]): Promise<TransactionsResponse> => {
  let query = supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      date,
      payment_method,
      reimbursement_status,
      people ( name ),
      categories ( name, icon )
    `, { count: 'exact' }) // 'exact' nos dá a contagem total de itens que correspondem aos filtros
    .eq('user_id', userId);

  // Aplicar filtros
  if (filters.personId) {
    query = query.eq('person_id', filters.personId);
  }
  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters.dateRange?.from) {
    query = query.gte('date', filters.dateRange.from.toISOString());
  }
  if (filters.dateRange?.to) {
    query = query.lte('date', filters.dateRange.to.toISOString());
  }

  // Aplicar paginação
  const from = pagination.pageIndex * pagination.pageSize;
  const to = from + pagination.pageSize - 1;
  query = query.range(from, to);
  
  // Ordenar pelos mais recentes
  query = query.order('date', { ascending: false }).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error("SWR Fetcher Error (useTransactions):", error);
    throw new Error(error.message);
  }
  
  return { transactions: (data as ExpenseWithRelations[]) || [], count: count || 0 };
};

export function useTransactions(filters: TransactionFilters, pagination: PaginationState) {
  const { user } = useAuth();
  
  // A chave SWR agora inclui os filtros e a paginação como um objeto serializado
  const key = user ? ['transactions', user.id, filters, pagination] : null;

  const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true, // Importante para uma boa UX de paginação
  });

  return {
    data: data,
    isLoading,
    error,
    mutate,
  };
}