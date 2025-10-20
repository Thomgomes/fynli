/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "next-themes";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const getThemeColor = (variableName: string): string => {
  if (typeof window === "undefined") return "#000000";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

export function DoughnutDemo() {
  const { theme } = useTheme();

  // 1. Dados mockados que você pediu
  const demoData = {
    labels: ["Mãe", "Pai", "Feira"],
    values: [283.0, 79.0, 642.98],
    colors: ["#3b82f6", "#22c55e", "#f97316"],
  };

  const doughnutChartData = useMemo(() => {
    return {
      labels: demoData.labels,
      datasets: [
        {
          data: demoData.values,
          backgroundColor: demoData.colors,
          borderColor: getThemeColor("--background"),
          borderWidth: 2,
        },
      ],
    };
  }, [theme]);

  const doughnutChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
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

  return <Doughnut data={doughnutChartData} options={doughnutChartOptions} />;
}
