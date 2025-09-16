/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, PiggyBank } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Tipagem para os dados que esperamos da nossa função SQL
type DashboardStats = {
  total_selected_month: number;
  total_all_time: number;
  top_person_name: string | null;
  top_person_amount: number | null;
};

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Vamos usar o mês e ano atuais como padrão para o filtro inicial
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JS months são 0-11

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Corrigimos a chamada RPC, passando os parâmetros necessários
      const { data, error } = await supabase.rpc('get_dashboard_stats', { 
        user_id_param: user.id,
        filter_year: currentYear,
        filter_month: currentMonth
      });

      if (error) throw error;
      
      // A função RPC retorna um array com um único objeto, então pegamos o primeiro.
      const fetchedStats = data[0]; 
      setStats(fetchedStats);

    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast.error("Erro ao carregar os cards", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [user, currentYear, currentMonth]); // Adicionamos as dependências corretas

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const cards = [
    { 
      title: "Gasto Total do Mês", 
      value: formatCurrency(stats.total_selected_month), 
      icon: TrendingUp, 
      description: "no mês atual" 
    },
    { 
      title: "Gasto Total (Geral)", 
      value: formatCurrency(stats.total_all_time), 
      icon: PiggyBank, 
      description: "desde o início" 
    },
    { 
      title: "Perfil com Mais Gastos", 
      value: stats.top_person_name || 'Nenhum', 
      icon: Users, 
      description: `com ${formatCurrency(stats.top_person_amount)} este mês` 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}