/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useChartData } from "@/hooks/use-chart-data";
import { useTheme } from "next-themes";
import { useFilterOptions } from "@/hooks/use-filter-options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardChartsProps {
  selectedYear: string | undefined;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return "#000000";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const monthLabels: { [key: number]: string } = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
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

export function DashboardCharts({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: DashboardChartsProps) {
  const { theme } = useTheme();
  const { options: filterOptions, isLoadingOptions } = useFilterOptions();

  const { chartData, isLoading, error } = useChartData({
    year: selectedYear ? parseInt(selectedYear) : new Date().getFullYear(),
    month: selectedMonth === "todos" ? 0 : parseInt(selectedMonth),
  });

  const availableMonths = useMemo(() => {
    if (!selectedYear || !filterOptions) return [];
    const yearData = filterOptions.find(
      (opt) => opt.year.toString() === selectedYear
    );
    return yearData ? yearData.months : [];
  }, [selectedYear, filterOptions]);

  const monthColors = [
    "#3b82f6",
    "#16a34a",
    "#f97316",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#6366f1",
    "#d946ef",
    "#0ea5e9",
    "#e11d48",
  ];

  const barChartData = useMemo(() => {
    if (!chartData || !chartData.monthly_expenses)
      return { labels: [], datasets: [] };
    if (selectedMonth === "todos") {
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
            label: "Gasto Mensal",
            data: monthlyTotals,
            backgroundColor: monthColors,
          },
        ],
      };
    } else {
      if (!chartData.category_distribution_for_month)
        return { labels: [], datasets: [] };
      const categoryData = chartData.category_distribution_for_month;
      return {
        labels: categoryData.map((c) => c.name),
        datasets: [
          {
            label: "Gasto na Categoria",
            data: categoryData.map((c) => c.total),
            backgroundColor: categoryData.map((c) => c.color || "#94a3b8"),
          },
        ],
      };
    }
  }, [chartData, selectedMonth]);

  const doughnutChartData = useMemo(() => {
    if (!chartData || !chartData.profile_distribution)
      return { labels: [], datasets: [] };
    return {
      labels: chartData.profile_distribution.map((p) => p.name),
      datasets: [
        {
          data: chartData.profile_distribution.map((p) => p.total),
          backgroundColor: chartData.profile_distribution.map(
            (p) => p.color || "#cccccc"
          ),
          borderColor: getThemeColor("--background"),
          borderWidth: 2,
        },
      ],
    };
  }, [chartData, theme]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getThemeColor("--card"),
          borderColor: getThemeColor("--border"),
          borderWidth: 1,
          titleColor: getThemeColor("--foreground"),
          bodyColor: getThemeColor("--foreground"),
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
          ticks: { color: getThemeColor("--muted-foreground") },
          grid: { color: getThemeColor("--border") },
        },
        y: {
          ticks: {
            color: getThemeColor("--muted-foreground"),
            callback: (value: any) => formatCurrency(value),
          },
          grid: { color: getThemeColor("--border") },
        },
      },
    }),
    [theme]
  );
  const doughnutChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getThemeColor("--card"),
          borderColor: getThemeColor("--border"),
          borderWidth: 1,
          titleColor: getThemeColor("--foreground"),
          bodyColor: getThemeColor("--foreground"),
          callbacks: {
            label: (context: any) => {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce(
                (acc: number, val: number) => acc + val,
                0
              );
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            },
          },
        },
      },
    }),
    [theme]
  );

  if (isLoading || isLoadingOptions) return <ChartSkeleton />;
  if (error)
    return (
      <div className="text-destructive p-4 border border-destructive/50 bg-destructive/10 rounded-md">
        Erro ao carregar os gráficos.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
        <div className="flex items-center gap-2">
          <Label className="font-medium">Ano:</Label>
          <Select
            value={selectedYear || ""}
            onValueChange={(val) => {
              onYearChange(val);
              onMonthChange("todos");
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Ano..." />
            </SelectTrigger>
            <SelectContent>
              {filterOptions?.map((opt) => (
                <SelectItem key={opt.year} value={opt.year.toString()}>
                  {opt.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-medium">Mês:</Label>
          <Select
            value={selectedMonth}
            onValueChange={onMonthChange}
            disabled={!selectedYear}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Mês..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Ano Inteiro</SelectItem>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {monthLabels[month]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedMonth === "todos"
                ? `Evolução de Gastos em ${selectedYear}`
                : `Gastos por Categoria em ${
                    monthLabels[parseInt(selectedMonth)]
                  }`}
            </CardTitle>
            <CardDescription>
              {selectedMonth === "todos"
                ? "Total de despesas registradas por mês."
                : "Soma de todas as despesas por categoria no mês selecionado."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <Bar data={barChartData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição por Perfil</CardTitle>
            <CardDescription>
              {selectedMonth === "todos"
                ? `Total gasto por pessoa em ${selectedYear}`
                : `Total gasto em ${monthLabels[parseInt(selectedMonth)]}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2 flex items-center justify-center">
            {doughnutChartData.datasets[0]?.data.length > 0 ? (
              <Doughnut
                data={doughnutChartData}
                options={doughnutChartOptions}
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
