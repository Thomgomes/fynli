"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types"; // Importando tipos gerados
import { useAuth } from "@/contexts/AuthContext";

// Usando os tipos gerados para ter autocomplete e segurança
type ExpenseWithRelations = Tables<'expenses'> & {
  people: Pick<Tables<'people'>, 'name'> | null;
  categories: Pick<Tables<'categories'>, 'name' | 'color'> | null;
};

function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

export function RecentTransactions() {
  const [expenses, setExpenses] = useState<ExpenseWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
//   const router = useRouter();

  const fetchRecentExpenses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Query atualizada para buscar as relações com 'people' e 'categories'
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          id,
          description,
          amount,
          date,
          people ( name ),
          categories ( name, color )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setExpenses(data as ExpenseWithRelations[] || []);
    } catch (error) {
      console.error('Erro ao buscar gastos recentes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecentExpenses();

    const channel = supabase
      .channel('recent-expenses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, 
        (payload) => {
          console.log('Change received!', payload);
          fetchRecentExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchRecentExpenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Seus últimos 5 gastos registrados.</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1">
          <Link href="/dashboard/transactions">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <TransactionSkeleton key={i} />)}
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada. Adicione seu primeiro gasto!
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.people?.name || 'Desconhecido'} • {new Date(expense.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                      </p>
                    </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatCurrency(expense.amount)}</div>
                  {expense.categories && (
                    <Badge 
                      variant="outline"
                      className="mt-1"
                      style={{ 
                        backgroundColor: `${expense.categories.color}20`, // Cor com 20% de opacidade
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
        )}
      </CardContent>
    </Card>
  );
}