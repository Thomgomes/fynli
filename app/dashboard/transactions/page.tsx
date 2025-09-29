/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTransactions, TransactionFilters, PaginationState, ExpenseWithRelations } from "@/hooks/use-transactions";
import { getColumns } from "@/components/dashboard/transactionsColums"; 
import { TransactionsDataTable } from "@/components/dashboard/transactionsDataTable"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePeople } from "@/hooks/use-people"; 
import { useCategories } from "@/hooks/use-categories"; 
import { useFilterOptions } from "@/hooks/use-filter-options";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AddExpenseModal } from "@/components/dashboard/addExpanseModal"; 

const monthLabels: { [key: number]: string } = {
  1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho",
  7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseWithRelations | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');

  // 1. Corrigido: Chamada ÚNICA ao hook useTransactions para buscar todos os dados e funções.
  const { data, isLoading, deleteTransaction } = useTransactions(filters, pagination);

  const { people } = usePeople();
  const { categories } = useCategories();
  const { options: filterOptions } = useFilterOptions();

  // 2. Corrigido: Funções envolvidas em useCallback para evitar recriações desnecessárias.
  const handleFilterChange = useCallback((key: keyof TransactionFilters, value: any) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters({});
    setSelectedYear('todos');
    setSelectedMonth('todos');
  }, []);

  useEffect(() => {
    let dateRange: { from?: Date; to?: Date } | undefined = undefined;
    const yearNum = parseInt(selectedYear);
    const monthNum = parseInt(selectedMonth);

    if (!isNaN(yearNum) && selectedYear !== 'todos') {
      if (!isNaN(monthNum) && selectedMonth !== 'todos') {
        const from = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const to = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59)); // Garante pegar o dia todo
        dateRange = { from, to };
      } else {
        const from = new Date(Date.UTC(yearNum, 0, 1));
        const to = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59));
        dateRange = { from, to };
      }
    }
    
    handleFilterChange('dateRange', dateRange);
  }, [selectedYear, selectedMonth, handleFilterChange]);

  const availableMonths = useMemo(() => {
    if (selectedYear === 'todos' || !filterOptions) return [];
    const yearData = filterOptions.find(opt => opt.year === parseInt(selectedYear));
    return yearData ? yearData.months : [];
  }, [selectedYear, filterOptions]);

  const handleEdit = useCallback((expense: ExpenseWithRelations) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  }, []);
  
  const handleDelete = useCallback(async (id: string) => {
    await deleteTransaction(id);
  }, [deleteTransaction]);

  // 3. Corrigido: O useMemo para as colunas agora tem as dependências corretas.
  const columns = useMemo(() => getColumns({ onEdit: handleEdit, onDelete: handleDelete }), [handleEdit, handleDelete]);

  const transactionsData = useMemo(() => data?.transactions || [], [data]);
  const pageCount = useMemo(() => Math.ceil((data?.count || 0) / pagination.pageSize), [data, pagination.pageSize]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">Veja e gerencie todos os seus gastos registrados.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine sua busca para encontrar transações específicas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Select value={filters.personId || ''} onValueChange={(value) => handleFilterChange('personId', value || undefined)}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Filtrar por Perfil..." /></SelectTrigger>
              <SelectContent>{people?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.categoryId || ''} onValueChange={(value) => handleFilterChange('categoryId', value || undefined)}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Filtrar por Categoria..." /></SelectTrigger>
              <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={val => { setSelectedYear(val); setSelectedMonth('todos'); }}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Ano..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Anos</SelectItem>
                {filterOptions?.map(opt => <SelectItem key={opt.year} value={opt.year.toString()}>{opt.year}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === 'todos'}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Mês..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Meses</SelectItem>
                {availableMonths.map(month => <SelectItem key={month} value={month.toString()}>{monthLabels[month]}</SelectItem>)}
              </SelectContent>
            </Select>
            
            {Object.values(filters).some(v => v) && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoading && transactionsData.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground">Carregando dados...</div>
          ) : (
            <TransactionsDataTable
              columns={columns} data={transactionsData} pageCount={pageCount}
              pagination={pagination} setPagination={setPagination}
            />
          )}
        </CardContent>
      </Card>

      <AddExpenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingExpense={editingExpense}
        onSuccess={() => {
            if (editingExpense) setEditingExpense(null);
        }}
      />
    </div>
  );
}