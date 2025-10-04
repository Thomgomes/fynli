"use client";

import { AddExpenseModal } from "@/components/dashboard/addExpanseModal";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useState } from "react";
import { useSWRConfig } from "swr";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { mutate } = useSWRConfig(); 

  const handleSuccess = () => {
    // Dizemos para a SWR buscar novamente os dados de todas as chaves que começam com 'dashboard_stats'
    mutate((key) => Array.isArray(key) && key[0] === 'dashboard_stats');
    
    // E também para as chaves que começam com 'recent_transactions'
    mutate((key) => Array.isArray(key) && key[0] === 'recent_transactions');
    
    // E também para a tabela principal de transações
    mutate((key) => Array.isArray(key) && key[0] === 'transactions');

    mutate((key) => Array.isArray(key) && key[0] === 'chart_data');

    mutate((key) => Array.isArray(key) && key[0] === 'filter_options');
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          {/* 1. Passamos a função para abrir o modal como uma prop para o Header */}
          <DashboardHeader onAddExpenseClick={() => setIsAddExpenseOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">
            {/* 2. Usamos React.cloneElement para passar a refreshKey para os filhos (a página) */}
            {children}
          </main>
        </div>
      </div>
      
      {/* 3. O Modal agora vive no layout, disponível para todas as páginas do dashboard */}
      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSuccess={handleSuccess}
        editingExpense={null} // Passamos null pois este botão é apenas para CRIAR
      />
    </>
  );
}