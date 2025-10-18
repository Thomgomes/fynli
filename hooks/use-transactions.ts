/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWRInfinite from 'swr/infinite';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useMemo, useCallback } from 'react';

export interface TransactionFilters {
  personId?: string;
  categoryId?: string;
  dateRange?: { from?: Date; to?: Date };
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export type ExpenseWithRelations = Tables<'expenses'> & {
  people: Pick<Tables<'people'>, 'id' | 'name'> | null;
  categories: Pick<Tables<'categories'>, 'id' | 'name' | 'icon'> | null;
};

export interface TransactionsResponse {
  transactions: ExpenseWithRelations[];
  count: number;
}

const PAGE_SIZE = 10;

const fetcher = async (
  userId: string,
  filters: TransactionFilters,
  pageIndex: number,
  pageSize: number
): Promise<TransactionsResponse> => {
  let query = supabase
    .from('expenses')
    .select(`*, people(id, name), categories(id, name, icon)`, { count: 'exact' })
    .eq('user_id', userId);

  if (filters.personId) { query = query.eq('person_id', filters.personId); }
  if (filters.categoryId) { query = query.eq('category_id', filters.categoryId); }
  if (filters.dateRange?.from) { 
    query = query.gte('date', filters.dateRange.from.toISOString()); 
  }
  if (filters.dateRange?.to) { 
    query = query.lte('date', filters.dateRange.to.toISOString()); 
  }

  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);
  
  query = query.order('date', { ascending: false }).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  
  return { 
    transactions: (data as ExpenseWithRelations[]) || [], 
    count: count || 0 
  };
};

export function useTransactions(filters: TransactionFilters) {
  const { user } = useAuth();

  const filterKey = useMemo(() => {
    return JSON.stringify({
      personId: filters.personId,
      categoryId: filters.categoryId,
      dateFrom: filters.dateRange?.from?.toISOString(),
      dateTo: filters.dateRange?.to?.toISOString(),
    });
  }, [filters.personId, filters.categoryId, filters.dateRange?.from, filters.dateRange?.to]);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: TransactionsResponse | null) => {
      if (!user) return null;
      
      if (previousPageData && !previousPageData.transactions.length) return null;
      
      return `transactions_${user.id}_${filterKey}_page_${pageIndex}`;
    },
    [user, filterKey]
  );

  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite<TransactionsResponse>(
    getKey,
    (_key) => {
      if (!user) return Promise.resolve({ transactions: [], count: 0 });

      const match = _key.match(/_page_(\d+)$/);
      const pageIndex = match ? parseInt(match[1], 10) : 0;
      
      return fetcher(user.id, filters, pageIndex, PAGE_SIZE);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateFirstPage: false, 
      persistSize: true,         
      dedupingInterval: 5000,
    }
  );

  const transactions = useMemo(
    () => data ? data.flatMap(page => page.transactions) : [],
    [data]
  );
  
  const totalCount = data?.[0]?.count ?? 0;
  const hasMore = transactions.length < totalCount;

  const addTransaction = useCallback(
    async (values: any) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const expensesToInsert: TablesInsert<'expenses'>[] = [];
      const totalInstallments = values.installments > 1 ? values.installments : 1;
      const installmentAmount = (values.amount as number) / totalInstallments;

      for (let i = 0; i < totalInstallments; i++) {
        const expenseDate = new Date(values.date);
        expenseDate.setUTCMonth(expenseDate.getUTCMonth() + i);
        expensesToInsert.push({
          user_id: user.id,
          person_id: values.person_id,
          category_id: values.category_id,
          description: totalInstallments > 1 
            ? `${values.description} (${i + 1}/${totalInstallments})` 
            : values.description,
          amount: installmentAmount,
          date: expenseDate.toISOString().split('T')[0],
          payment_method: values.payment_method,
          reimbursement_status: values.reimbursement_status,
          installments: totalInstallments,
        });
      }

      const { error: insertError } = await supabase
        .from('expenses')
        .insert(expensesToInsert);
        
      if (insertError) {
        toast.error("Erro ao adicionar despesa", { description: insertError.message });
        throw insertError;
      }

      toast.success("Despesa adicionada com sucesso!");
      
      await mutate();
    },
    [user, mutate]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const optimisticData = data?.map(page => ({
        ...page,
        transactions: page.transactions.filter(t => t.id !== id),
        count: page.count - 1,
      }));

      await mutate(
        async () => {
          const { error } = await supabase.from('expenses').delete().eq('id', id);
          if (error) {
            toast.error("Erro ao deletar transação", { description: error.message });
            throw error;
          }
          toast.success("Transação deletada com sucesso.");
          
          return optimisticData;
        },
        {
          optimisticData,
          revalidate: true,
        }
      );
    },
    [data, mutate]
  );

  const updateTransaction = useCallback(
    async (id: string, updates: TablesUpdate<'expenses'>) => {
      const optimisticData = data?.map(page => ({
        ...page,
        transactions: page.transactions.map(t =>
          t.id === id ? { ...t, ...updates } : t
        ),
      }));

      await mutate(
        async () => {
          const { error } = await supabase
            .from('expenses')
            .update(updates)
            .eq('id', id);
            
          if (error) {
            toast.error("Erro ao atualizar transação", { description: error.message });
            throw error;
          }
          toast.success("Transação atualizada com sucesso.");
          
          return optimisticData;
        },
        {
          optimisticData,
          revalidate: true,
        }
      );
    },
    [data, mutate]
  );

  return {
    transactions,
    totalCount,
    isLoading: isLoading && !data,
    error,
    hasMore,
    loadMore: useCallback(() => setSize(size + 1), [setSize, size]),
    pageCount: Math.ceil(totalCount / PAGE_SIZE),
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
