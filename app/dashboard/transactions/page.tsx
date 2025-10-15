/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  useTransactions,
  TransactionFilters,
  PaginationState,
  ExpenseWithRelations,
} from "@/hooks/use-transactions";
import { getColumns } from "@/components/dashboard/transactionsColums";
import { TransactionsDataTable } from "@/components/dashboard/transactionsDataTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeople } from "@/hooks/use-people";
import { useCategories } from "@/hooks/use-categories";
import { useFilterOptions } from "@/hooks/use-filter-options";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AddExpenseModal } from "@/components/dashboard/addExpanseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionCard } from "@/components/dashboard/transactionCard";

const monthLabels: { [key: number]: string } = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<ExpenseWithRelations | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString()
  );

  const { data, isLoading, deleteTransaction } = useTransactions(
    filters,
    pagination
  );

  const { people } = usePeople();
  const { categories } = useCategories();
  const { options: filterOptions, isLoadingOptions } = useFilterOptions();

  const handleFilterChange = useCallback(
    (key: keyof TransactionFilters, value: any) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    let dateRange: { from?: Date; to?: Date } | undefined = undefined;
    const yearNum = parseInt(selectedYear);
    const monthNum = parseInt(selectedMonth);

    if (!isNaN(yearNum) && selectedYear !== "todos") {
      if (!isNaN(monthNum) && selectedMonth !== "todos") {
        const from = new Date(Date.UTC(yearNum, monthNum - 1, 1));
        const to = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59));
        dateRange = { from, to };
      } else {
        const from = new Date(Date.UTC(yearNum, 0, 1));
        const to = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59));
        dateRange = { from, to };
      }
    }

    handleFilterChange("dateRange", dateRange);
  }, [selectedYear, selectedMonth, handleFilterChange]);

  const clearFilters = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setFilters({});
    setSelectedYear("todos");
    setSelectedMonth("todos");
  }, []);

  const availableMonths = useMemo(() => {
    if (selectedYear === "todos" || !filterOptions) return [];
    const yearData = filterOptions.find(
      (opt) => opt.year === parseInt(selectedYear)
    );
    return yearData ? yearData.months : [];
  }, [selectedYear, filterOptions]);

  const handleEdit = useCallback((expense: ExpenseWithRelations) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTransaction(id);
    },
    [deleteTransaction]
  );

  const columns = useMemo(
    () => getColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  );
  const transactionsData = useMemo(() => data?.transactions || [], [data]);
  const pageCount = useMemo(
    () => Math.ceil((data?.count || 0) / pagination.pageSize),
    [data, pagination.pageSize]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          Veja e gerencie todos os seus gastos registrados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Refine sua busca para encontrar transações específicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Select
              value={filters.personId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "personId",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por Perfil..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Perfis</SelectItem>
                {people?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "categoryId",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por Categoria..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isLoadingOptions ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              <>
                <Select
                  value={selectedYear}
                  onValueChange={(val) => {
                    setSelectedYear(val);
                    setSelectedMonth("todos");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ano..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Anos</SelectItem>
                    {filterOptions?.map((opt) => (
                      <SelectItem key={opt.year} value={opt.year.toString()}>
                        {opt.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                  disabled={selectedYear === "todos"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Mês..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Meses</SelectItem>
                    {availableMonths.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {monthLabels[month]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {Object.values(filters).some(
              (v) => v !== undefined && Object.keys(v).length !== 0
            ) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="w-full sm:w-auto"
              >
                <X className="mr-2 h-4 w-4" /> Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoading && transactionsData.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Carregando dados...
            </div>
          ) : (
            <>
              <div className="md:hidden flex flex-col gap-4">
                {transactionsData.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              <div className="hidden md:block">
                <TransactionsDataTable
                  columns={columns}
                  data={transactionsData}
                  pageCount={pageCount}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </div>
            </>
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
