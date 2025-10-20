"use client";

import { AddExpenseModal } from "@/components/dashboard/addExpanseModal";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ReactNode, useState } from "react";
import { useSWRConfig } from "swr";


export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { mutate } = useSWRConfig(); 

  const handleSuccess = () => {
    mutate((key) => Array.isArray(key) && key[0] === 'dashboard_stats');
    mutate((key) => Array.isArray(key) && key[0] === 'recent_transactions');
    mutate((key) => Array.isArray(key) && key[0] === 'transactions');
    mutate((key) => Array.isArray(key) && key[0] === 'chart_data');
    mutate((key) => Array.isArray(key) && key[0] === 'filter_options');
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader onAddExpenseClick={() => setIsAddExpenseOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
      
      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSuccess={handleSuccess}
        editingExpense={null}
      />
    </>
  );
}