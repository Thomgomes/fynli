"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';


// Tipagem para a resposta completa da nossa função SQL get_chart_data
export type ChartDataResponse = {
  monthly_expenses: { month: number; total: number }[];
  profile_distribution: { name: string; total: number; color: string }[];
};

// O "fetcher" para a SWR. Ele recebe a chave (key) e busca os dados.
const fetcher = async ([userId, year, month]: [string, number, number]): Promise<ChartDataResponse> => {
  const { data, error } = await supabase.rpc('get_chart_data', { 
    user_id_param: userId,
    filter_year: year,
    filter_month: month,
  });

  if (error) {
    console.error("SWR Fetcher Error:", error);
    throw new Error(error.message);
  }
  
  return data as ChartDataResponse;
};

// Nosso hook customizado que usa a SWR
export function useChartData({ year, month }: { year: number; month: number }) {
  const { user } = useAuth();
  
  // A chave é um array com os parâmetros que, se mudarem, disparam um novo fetch.
  // Se o usuário não estiver logado, a chave é nula e a SWR não fará a busca.
  const key = user ? [user.id, year, month] : null;

  // Usamos o hook useSWR para buscar, cachear e revalidar os dados.
  const { data, error, isLoading } = useSWR<ChartDataResponse | null>(key, fetcher, {
    // Opcional: Desativa a revalidação em foco se você achar que atualiza demais.
    // revalidateOnFocus: false, 
  });

  return {
    chartData: data,
    isLoading,
    error,
  };
}