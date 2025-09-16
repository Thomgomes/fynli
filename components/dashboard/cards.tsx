"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
 // 1. Importar o hook

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
  // Parâmetros para os filtros que o hook vai usar
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 2. TODA a lógica de state e fetch foi substituída por esta única linha!
  const { stats, isLoading, error } = useDashboardStats({ year: currentYear, month: currentMonth });

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  if (error) {
    // Uma forma simples de mostrar o erro na UI
    return <div className="text-sm text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-lg">Erro ao carregar dados dos cards.</div>;
  }

  // O esqueleto é exibido enquanto isLoading é true ou os dados (stats) ainda não chegaram.
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // 3. O restante do código usa 'stats' que vem diretamente do hook.
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