"use client";

import { AddExpenseModal } from "@/components/dashboard/addExpanseModal";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { cloneElement, ReactElement, useState } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey((prev) => prev + 1); // Força a atualização dos componentes que usam essa chave
    setIsAddExpenseOpen(false);
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
            {cloneElement(children as ReactElement, { key: refreshKey })}
          </main>
        </div>
      </div>
      
      {/* 3. O Modal agora vive no layout, disponível para todas as páginas do dashboard */}
      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onExpenseAdded={handleExpenseAdded}
      />
    </>
  );
}