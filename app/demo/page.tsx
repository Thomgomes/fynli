"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  PieChart,
  Receipt,
  ArrowRight,
  DollarSign,
  UserPlus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { FynliSVG } from "@/components/fynliSVG";
import { ThemeButton } from "@/components/themeButton";

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<
    "dashboard" | "expenses" | "people"
  >("dashboard");

  const demoData = {
    dashboard: {
      totalExpenses: "R$ 2.540,00",
      totalPeople: 4,
      avgPerPerson: "R$ 635,00",
      recentTransactions: [
        {
          person: "João",
          amount: "R$ 120,00",
          description: "Almoço",
          date: "Hoje",
        },
        {
          person: "Maria",
          amount: "R$ 85,00",
          description: "Mercado",
          date: "Ontem",
        },
        {
          person: "Pedro",
          amount: "R$ 200,00",
          description: "Combustível",
          date: "2 dias",
        },
      ],
    },
    expenses: [
      {
        id: 1,
        description: "Supermercado",
        amount: 150.0,
        person: "João",
        date: "2024-01-15",
      },
      {
        id: 2,
        description: "Restaurante",
        amount: 85.0,
        person: "Maria",
        date: "2024-01-14",
      },
      {
        id: 3,
        description: "Combustível",
        amount: 200.0,
        person: "Pedro",
        date: "2024-01-13",
      },
    ],
    people: [
      { id: 1, name: "João Silva", totalSpent: 450.0, transactions: 12 },
      { id: 2, name: "Maria Santos", totalSpent: 320.0, transactions: 8 },
      { id: 3, name: "Pedro Costa", totalSpent: 780.0, transactions: 15 },
      { id: 4, name: "Ana Oliveira", totalSpent: 290.0, transactions: 6 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FynliSVG className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Splity</h1>
          </div>
          <div className="flex gap-2">
            <ThemeButton />
            <Button variant="ghost" asChild>
              <Link href="/auth">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Gerenciamento de Gastos Inteligente
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-6xl min-h-20 font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Controle seus gastos compartilhados
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerencie despesas em grupo, divida contas de forma justa e acompanhe
            seus gastos com gráficos detalhados e relatórios inteligentes.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/auth" className="gap-2">
                Experimentar Grátis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Principais Funcionalidades
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Gestão de Pessoas</CardTitle>
                <CardDescription>
                  Adicione pessoas e acompanhe os gastos individuais de cada
                  membro do grupo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Gráficos Detalhados</CardTitle>
                <CardDescription>
                  Visualize tendências de gastos com gráficos interativos e
                  relatórios mensais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Receipt className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Controle de Despesas</CardTitle>
                <CardDescription>
                  Registre gastos facilmente e mantenha um histórico completo de
                  todas as transações
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Veja como funciona
          </h3>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={activeDemo === "dashboard" ? "default" : "outline"}
              onClick={() => setActiveDemo("dashboard")}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeDemo === "expenses" ? "default" : "outline"}
              onClick={() => setActiveDemo("expenses")}
              className="gap-2"
            >
              <Receipt className="h-4 w-4" />
              Gastos
            </Button>
            <Button
              variant={activeDemo === "people" ? "default" : "outline"}
              onClick={() => setActiveDemo("people")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Pessoas
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeDemo === "dashboard" && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Gastos
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {demoData.dashboard.totalExpenses}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% do mês passado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pessoas
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {demoData.dashboard.totalPeople}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ativos no grupo
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Média por Pessoa
                    </CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {demoData.dashboard.avgPerPerson}
                    </div>
                    <p className="text-xs text-muted-foreground">Este mês</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeDemo === "expenses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gastos Recentes</CardTitle>
                  <CardDescription>
                    Últimas transações registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoData.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.person} • {expense.date}
                          </p>
                        </div>
                        <div className="font-bold text-lg">
                          R$ {expense.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeDemo === "people" && (
              <Card>
                <CardHeader>
                  <CardTitle>Pessoas do Grupo</CardTitle>
                  <CardDescription>
                    Gastos por pessoa no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoData.people.map((person) => (
                      <div
                        key={person.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {person.transactions} transações
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            R$ {person.totalSpent.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão organizando seus gastos
            de forma inteligente
          </p>
          <Button size="lg" asChild>
            <Link href="/auth" className="gap-2">
              Criar Conta Grátis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t bg-card/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Splity. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
