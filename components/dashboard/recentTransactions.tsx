"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";


// Componente de esqueleto para o estado de carregamento
function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

export function RecentTransactions() {
  // 2. Lógica de dados substituída por uma única linha!
  const { transactions, isLoading, error } = useRecentTransactions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <TransactionSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
        return <div className="text-center py-8 text-sm text-destructive">Erro ao carregar transações.</div>;
    }

    if (transactions?.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma transação encontrada. Adicione seu primeiro gasto!
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {transactions?.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground truncate">{expense.description}</p>
                <p className="text-sm text-muted-foreground">
                  {expense.people?.name || 'Desconhecido'} • {new Date(expense.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="font-semibold text-foreground">{formatCurrency(expense.amount)}</div>
              {expense.categories && (
                <Badge 
                  variant="outline"
                  className="mt-1 font-normal"
                  style={{ 
                    backgroundColor: `${expense.categories.color}20`, // Cor com ~12% de opacidade
                    borderColor: expense.categories.color || undefined,
                    color: expense.categories.color || undefined
                  }}
                >
                  {expense.categories.name}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Seus últimos 5 gastos registrados.</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1 flex-shrink-0">
          <Link href="/dashboard/transactions">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}