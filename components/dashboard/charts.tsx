/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useChartData } from "@/hooks/useChartData";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

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
          <CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardCharts() {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("todos");

  // 2. A lógica de fetch foi substituída por uma única chamada ao nosso hook
  const { chartData, isLoading, error } = useChartData({
    year: parseInt(selectedYear),
    month: selectedMonth === 'todos' ? 0 : parseInt(selectedMonth),
  });

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { value: "todos", label: "Ano Inteiro" }, { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" }, { value: "03", label: "Março" },
    { value: "04", label: "Abril" }, { value: "05", label: "Maio" },
    { value: "06", label: "Junho" }, { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" }, { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" }, { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];
  
  // A lógica de processamento continua aqui, usando 'useMemo' para performance
  const lineChartData = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };
    
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyTotals = new Array(12).fill(0);
    chartData.monthly_expenses.forEach(item => {
        monthlyTotals[item.month - 1] = item.total;
    });

    return {
      labels: monthNames,
      datasets: [{
        label: 'Total de Gastos',
        data: monthlyTotals,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        tension: 0.4,
      }],
    };
  }, [chartData]);
  
  const doughnutChartData = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    return {
      labels: chartData.profile_distribution.map(p => p.name),
      datasets: [{
        data: chartData.profile_distribution.map(p => p.total),
        backgroundColor: chartData.profile_distribution.map(p => p.color || '#cccccc'),
        borderColor: 'hsl(var(--background))',
        borderWidth: 2,
      }],
    };
  }, [chartData]);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        callbacks: {
          label: (context: any) => `${context.dataset.label || context.label}: ${formatCurrency(context.parsed.y || context.parsed)}`
        }
      }
    },
    scales: {
      x: { ticks: { color: 'hsl(var(--muted-foreground))' }, grid: { color: 'hsl(var(--border))' } },
      y: { ticks: { color: 'hsl(var(--muted-foreground))', callback: (value: any) => formatCurrency(value) }, grid: { color: 'hsl(var(--border))' } }
    }
  };

  if (isLoading) return <ChartSkeleton />;
  if (error) return <div className="text-destructive">Erro ao carregar os gráficos.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="font-medium">Ano:</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-medium">Mês:</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Evolução Anual de Gastos</CardTitle>
            <CardDescription>Total de despesas registradas por mês em {selectedYear}.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <Line data={lineChartData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição por Perfil</CardTitle>
            <CardDescription>
              {selectedMonth === 'todos' ? `Total gasto por pessoa em ${selectedYear}` : `Total gasto em ${months.find(m => m.value === selectedMonth)?.label}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2 flex items-center justify-center">
             {doughnutChartData.datasets[0]?.data.length > 0 ? (
                <Doughnut data={doughnutChartData} options={{ ...chartOptions, scales: {} }} />
             ) : (
                <p className="text-muted-foreground text-sm">Nenhum dado para o período selecionado.</p>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}