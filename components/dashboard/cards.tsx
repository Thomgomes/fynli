"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

// 1. O componente agora espera 'year' e 'month' como props.
interface DashboardCardsProps {
  year: number;
  month: number; // 0 para "ano inteiro"
}

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

export function DashboardCards({ year, month }: DashboardCardsProps) {
  // 2. O hook agora usa os filtros dinâmicos recebidos via props.
  const { stats, isLoading, error } = useDashboardStats({ year, month });

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  if (error) {
    return <div className="text-sm text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-lg">Erro ao carregar dados dos cards.</div>;
  }

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // 3. Os títulos e descrições agora são dinâmicos com base no filtro.
  const periodLabel = month === 0 ? "neste ano" : "neste mês";

  const cards = [
    { 
      title: month === 0 ? "Gasto Total do Ano" : "Gasto Total do Mês", 
      value: formatCurrency(stats.total_in_period), 
      icon: TrendingUp, 
      description: `no período selecionado` 
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
      description: `com ${formatCurrency(stats.top_person_amount)} ${periodLabel}`
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