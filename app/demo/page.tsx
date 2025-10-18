"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, BarChart3, Users, GitBranch, ArrowRight, PackagePlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// --- Componente de Ação do Cabeçalho (com Verificação de Auth) ---
function HeaderActions() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-10 w-28" />;
  }

  if (user) {
    return (
      <Button asChild>
        <Link href="/dashboard">Aceder ao Dashboard</Link>
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" asChild>
        <Link href="/auth">Entrar</Link>
      </Button>
      <Button asChild>
        <Link href="/auth">Começar Grátis</Link>
      </Button>
    </div>
  );
}

// --- Componente Principal da Página de Demonstração ---
export default function DemoPage() {
  const features = [
    {
      icon: Users,
      title: "Organização por Perfil",
      description: "Crie perfis personalizados (Mãe, Pai, Casa) com cores e ícones para saber exatamente para onde seu dinheiro está indo."
    },
    {
      icon: "📅", // Usando um emoji para a "feature matadora"
      title: "Lógica de Parcelamento Real",
      description: "Lance um gasto de R$300 em 3x e o Fynli cria automaticamente três despesas de R$100 para os próximos meses. Seus relatórios finalmente estarão corretos."
    },
    {
      icon: BarChart3,
      title: "Dashboard Dinâmico e Interativo",
      description: "Filtre seus gastos por ano ou mês. Gráficos, cards e listas se atualizam instantaneamente, sem recarregar a página, graças à SWR e funções RPC no Supabase."
    },
    {
      icon: PackagePlus,
      title: "Criação Rápida",
      description: "Percebeu que falta uma categoria ou perfil? Crie-os na hora, de dentro do próprio formulário de despesa, sem interromper seu fluxo."
    }
  ];

  const roadmap = [
    { title: "Lançamento em Lote", description: "Adicione múltiplos gastos de uma só vez, perfeito para organizar seu extrato bancário." },
    { title: "Módulo de Orçamentos", description: "Defina limites de gastos por perfil ou categoria e acompanhe seu progresso." },
    { title: "Anexar Comprovantes", description: "Faça upload de recibos e notas fiscais para cada transação usando o Supabase Storage." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* --- Cabeçalho --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">Fynli</h1>
          </Link>
          <HeaderActions />
        </div>
      </header>

      {/* --- Seção Hero --- */}
      <main className="flex-1">
        <section className="py-20 md:py-32 border-b">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Misturando seus gastos com os da sua família?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              O Fynli organiza essa confusão. Crie perfis, registe despesas (incluindo parcelamentos!) e finalmente entenda para onde seu dinheiro está indo.
            </p>
            <div className="flex justify-center">
              <Button size="lg" asChild>
                <Link href="/auth" className="gap-2">
                  Começar a Organizar (Grátis)
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            {/* Aqui você pode adicionar um print do seu app */}
            <div className="mt-16">
              <img 
                src="/path/to/your/dashboard-screenshot.png" 
                alt="Dashboard do Fynli" 
                className="rounded-lg border shadow-lg mx-auto"
              />
            </div>
          </div>
        </section>

        {/* --- Seção de Funcionalidades --- */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold">Tudo que o Fynli faz por você</h3>
              <p className="text-lg text-muted-foreground mt-4">Construído com base em uma necessidade real, focado em performance.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    {typeof feature.icon === 'string' ? (
                      <span className="text-2xl">{feature.icon}</span>
                    ) : (
                      <feature.icon className="h-6 w-6" />
                    )}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- Seção de Roadmap (Próximas Atualizações) --- */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold">Próximas Atualizações</h3>
              <p className="text-lg text-muted-foreground mt-4">
                O Fynli é um projeto vivo. Aqui está o que vem por aí para tornar o controle financeiro ainda mais completo.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {roadmap.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <GitBranch className="h-6 w-6 text-primary mb-4" />
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- Seção Final de CTA --- */}
        <section className="py-20 md:py-32 border-t bg-gradient-to-t from-muted/50 to-background">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Pronto para organizar sua vida financeira?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Crie sua conta gratuita em 60 segundos. Comece a ter clareza sobre seus gastos hoje mesmo.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth" className="gap-2">
                Começar Grátis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* --- Rodapé --- */}
      <footer className="py-8 border-t">
        <div className="container mx-auto text-center text-muted-foreground px-4 md:px-6">
          <p>&copy; {new Date().getFullYear()} Fynli. Todos os direitos reservados.</p>
          <p>Desenvolvido por [Seu Nome Aqui]</p>
        </div>
      </footer>
    </div>
  );
}