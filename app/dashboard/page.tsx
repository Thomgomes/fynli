"use client";

import { AddExpenseModal } from "@/components/dashboard/addExpanseModal";
import { DashboardCards } from "@/components/dashboard/cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { RecentTransactions } from "@/components/dashboard/recentTransactions";
import { useState } from "react";


// Renomeado para seguir o padrão PascalCase
export default function DashboardPage() {
  // O estado para controlar o modal de adicionar despesa fica aqui, na página principal.
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  // A 'refreshKey' é uma ótima estratégia para forçar a re-renderização dos componentes filhos.
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setIsAddExpenseOpen(false); // Fecha o modal após adicionar
  };

  // O botão de "Adicionar Gasto" agora vive no Header,
  // mas ele ainda vai controlar o estado `isAddExpenseOpen` desta página.
  // Vamos passar a função `setIsAddExpenseOpen` para o Header através do layout.
  // Por enquanto, a estrutura dos componentes está correta.
  return (
    <div className="space-y-6">
      {/* Passamos a refreshKey para os componentes que precisam recarregar os dados */}
      <DashboardCards key={`cards-${refreshKey}`} />
      <DashboardCharts key={`charts-${refreshKey}`} />
      <RecentTransactions key={`transactions-${refreshKey}`} />

      {/* O Modal continua sendo controlado por esta página */}
      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onExpenseAdded={handleExpenseAdded}
      />
    </div>
  );
}