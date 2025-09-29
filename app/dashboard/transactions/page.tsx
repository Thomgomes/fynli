/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTransactions, TransactionFilters, PaginationState } from "@/hooks/use-transactions";
import { columns } from "@/components/dashboard/transactionsColums";
import { TransactionsDataTable } from "@/components/dashboard/transactionsDataTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePeople } from "@/hooks/use-people";
import { useCategories } from "@/hooks/use-categories";
import { useFilterOptions } from "@/hooks/use-filter-options"; // 1. Importar o novo hook
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const monthLabels: { [key: number]: string } = {
  1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho",
  7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
};

export default function TransactionsPage() {
  // Estados para os filtros
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  // 2. Estados para controlar os seletores de data
  const [selectedYear, setSelectedYear] = useState<string>('todos');
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');

  // Buscando os dados
  const { data, isLoading: isLoadingTransactions } = useTransactions(filters, pagination);
  const { people } = usePeople();
  const { categories } = useCategories();
  const { options: filterOptions } = useFilterOptions(); // 3. Buscando as opções de filtro

  // 4. useEffect para construir o dateRange a partir dos seletores
  useEffect(() => {
    let dateRange: { from?: Date; to?: Date } = {};
    const yearNum = parseInt(selectedYear);
    const monthNum = parseInt(selectedMonth);

    if (!isNaN(yearNum) && selectedYear !== 'todos') {
      if (!isNaN(monthNum) && selectedMonth !== 'todos') {
        // Filtro por mês específico
        const from = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const to = new Date(Date.UTC(yearNum, monthNum, 0));
        dateRange = { from, to };
      } else {
        // Filtro pelo ano inteiro
        const from = new Date(Date.UTC(yearNum, 0, 1));
        const to = new Date(Date.UTC(yearNum, 11, 31));
        dateRange = { from, to };
      }
    }
    
    // Atualiza o filtro principal, o que dispara a busca de dados do useTransactions
    handleFilterChange('dateRange', dateRange);
  }, [selectedYear, selectedMonth]);


  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters({});
    setSelectedYear('todos');
    setSelectedMonth('todos');
  };

  const availableMonths = useMemo(() => {
    if (selectedYear === 'todos' || !filterOptions) return [];
    const yearData = filterOptions.find(opt => opt.year === parseInt(selectedYear));
    return yearData ? yearData.months : [];
  }, [selectedYear, filterOptions]);

  // Memoizando dados e contagem de páginas
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
            <Select value={filters.personId || ''} onValueChange={(value) => handleFilterChange('personId', value)}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Filtrar por Perfil..." /></SelectTrigger>
              <SelectContent>{people?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.categoryId || ''} onValueChange={(value) => handleFilterChange('categoryId', value)}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Filtrar por Categoria..." /></SelectTrigger>
              <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            
            {/* 5. Novos seletores de data dinâmicos */}
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
            
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" /> Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoadingTransactions && transactionsData.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground">Carregando dados...</div>
          ) : (
            <TransactionsDataTable
              columns={columns} data={transactionsData} pageCount={pageCount}
              pagination={pagination} setPagination={setPagination}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}