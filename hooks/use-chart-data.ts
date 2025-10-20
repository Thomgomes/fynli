"use client";

import useSWR from "swr";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ChartDataResponse = {
  monthly_expenses: { month: number; total: number }[];
  profile_distribution: { name: string; total: number; color: string }[];
  category_distribution_for_month: {
    name: string;
    total: number;
    color: string | null;
  }[];
};

const fetcher = async ([_key, userId, year, month]: [
  string,
  string,
  number,
  number
]): Promise<ChartDataResponse> => {
  const { data, error } = await supabase.rpc("get_chart_data", {
    user_id_param: userId,
    filter_year: year,
    filter_month: month,
  });

  if (error) {
    console.error("SWR Fetcher Error (useChartData):", error);
    throw new Error(error.message);
  }

  return data as ChartDataResponse;
};

export function useChartData({ year, month }: { year: number; month: number }) {
  const { user } = useAuth();
  const key = user ? ["chart_data", user.id, year, month] : null;

  const { data, error, isLoading } = useSWR<ChartDataResponse | null>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    chartData: data,
    isLoading,
    error,
  };
}
