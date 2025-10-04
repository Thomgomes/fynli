"use client";

import { DashboardCards } from "@/components/dashboard/cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { RecentTransactions } from "@/components/dashboard/recentTransactions";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>("todos");

  const { options: filterOptions } = useFilterOptions();

  useEffect(() => {
    if (filterOptions && filterOptions.length > 0 && !selectedYear) {
      setSelectedYear(filterOptions[0].year.toString());
    }
  }, [filterOptions, selectedYear]);

  const yearAsNumber = selectedYear
    ? parseInt(selectedYear)
    : new Date().getFullYear();
  const monthAsNumber = selectedMonth === "todos" ? 0 : parseInt(selectedMonth);

  return (
    <div className="space-y-6">
      <DashboardCards year={yearAsNumber} month={monthAsNumber} />
      <DashboardCharts
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />
      <RecentTransactions />
    </div>
  );
}
