/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useTransactions, TransactionFilters, PaginationState } from "@/hooks/use-transactions";
import { columns } from "@/components/dashboard/transactionsColums"; 
import { TransactionsDataTable } from "@/components/dashboard/transactionsDataTable"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePeople } from "@/hooks/use-people";
import { useCategories } from "@/hooks/use-categories"; 
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TransactionsPage() {
  // Estados para controlar os filtros e a paginação
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Buscando os dados com nosso hook, passando os filtros e a paginação
  const { data, isLoading } = useTransactions(filters, pagination);

  // Buscando dados para preencher os seletores de filtro
  const { people } = usePeople();
  const { categories } = useCategories();

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    // Quando um filtro muda, voltamos para a primeira página
    setPagination({ ...pagination, pageIndex: 0 });
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPagination({ ...pagination, pageIndex: 0 });
    setFilters({});
  };

  // Memoizamos os dados para evitar re-renderizações desnecessárias da tabela
  const transactionsData = useMemo(() => data?.transactions || [], [data]);
  const pageCount = useMemo(() => {
    if (!data?.count || pagination.pageSize === 0) return 0;
    return Math.ceil(data.count / pagination.pageSize);
  }, [data, pagination.pageSize]);

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
            <Select
              value={filters.personId || ''}
              onValueChange={(value) => handleFilterChange('personId', value)}
            >
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Filtrar por Perfil..." />
              </SelectTrigger>
              <SelectContent>
                {people?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select
              value={filters.categoryId || ''}
              onValueChange={(value) => handleFilterChange('categoryId', value)}
            >
              <SelectTrigger className="w-full sm:w-auto">
                <SelectValue placeholder="Filtrar por Categoria..." />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Adicionar um filtro de data aqui seria o próximo passo, usando o Popover do Shadcn */}
            
            {(filters.personId || filters.categoryId) && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoading && transactionsData.length === 0 ? (
             <div className="text-center p-8">Carregando dados...</div>
          ) : (
            <TransactionsDataTable
              columns={columns}
              data={transactionsData}
              pageCount={pageCount}
              pagination={pagination}
              setPagination={setPagination}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}