/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useAuth } from "@/contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Tipagem para a resposta completa da nossa função SQL
type ChartDataResponse = {
  monthly_expenses: { month: number; total: number }[];
  profile_distribution: { name: string; total: number; color: string }[];
};

function ChartSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardCharts() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Estados para os filtros
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("todos"); // "todos" para o ano inteiro

  // Estado para os dados brutos vindos do backend
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );
  const months = [
    { value: "todos", label: "Ano Inteiro" },
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const fetchChartData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("get_chart_data", {
        user_id_param: user.id,
        filter_year: parseInt(selectedYear),
        filter_month: selectedMonth === "todos" ? 0 : parseInt(selectedMonth),
      });

      if (error) throw error;
      setChartData(data as ChartDataResponse);
    } catch (err: any) {
      console.error("Erro ao buscar dados dos gráficos:", err);
      toast.error("Erro ao carregar os gráficos", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Usamos 'useMemo' para processar os dados apenas quando eles mudam, otimizando a performance
  const lineChartData = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const monthlyTotals = new Array(12).fill(0);
    chartData.monthly_expenses.forEach((item) => {
      monthlyTotals[item.month - 1] = item.total;
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Total de Gastos",
          data: monthlyTotals,
          borderColor: "hsl(var(--primary))",
          backgroundColor: "hsl(var(--primary) / 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [chartData]);

  const doughnutChartData = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    return {
      labels: chartData.profile_distribution.map((p) => p.name),
      datasets: [
        {
          data: chartData.profile_distribution.map((p) => p.total),
          backgroundColor: chartData.profile_distribution.map(
            (p) => p.color || "#cccccc"
          ),
          borderColor: "hsl(var(--background))",
          borderWidth: 2,
        },
      ],
    };
  }, [chartData]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label || context.label}: ${formatCurrency(
              context.parsed.y || context.parsed
            )}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "hsl(var(--muted-foreground))" },
        grid: { color: "hsl(var(--border))" },
      },
      y: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
          callback: (value: any) => formatCurrency(value),
        },
        grid: { color: "hsl(var(--border))" },
      },
    },
  };

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="font-medium">Ano:</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-medium">Mês:</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Evolução Anual de Gastos</CardTitle>
            <CardDescription>
              Total de despesas registradas por mês em {selectedYear}.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <Line data={lineChartData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição por Perfil</CardTitle>
            <CardDescription>
              {selectedMonth === "todos"
                ? `Total gasto por pessoa em ${selectedYear}`
                : `Total gasto em ${
                    months.find((m) => m.value === selectedMonth)?.label
                  }`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2 flex items-center justify-center">
            {doughnutChartData.datasets[0]?.data.length > 0 ? (
              <Doughnut
                data={doughnutChartData}
                options={{ ...chartOptions, scales: {} }}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum dado para o período selecionado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
