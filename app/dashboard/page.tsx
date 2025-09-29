"use client";

import { DashboardCards } from "@/components/dashboard/cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { RecentTransactions } from "@/components/dashboard/recentTransactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardCards />
      <DashboardCharts />
      <RecentTransactions />
    </div>
  );
}
