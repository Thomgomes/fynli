"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowRight,
  Smartphone,
  TrendingUp,
  Calendar,
  Zap,
  Eye,
  CheckCircle2,
  Circle,
  Tags,
  GitBranch,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import { DoughnutDemo } from "@/components/DoughnutDemo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DemoHeader } from "@/components/dashboard/headerDemo";

export default function DemoPage() {
  const features = [
    {
      icon: Users,
      title: "Perfis Personalizados",
      description:
        "Crie perfis para cada membro da família, amigos ou algo unico (ex: casa, viagem) e organize seus gastos de forma clara.",
    },
    {
      icon: Tags,
      title: "Categorias Flexíveis",
      description:
        "Use as categorias já existentes ou crie novas para saber onde aquele gasto foi direcionado.",
    },
    {
      icon: TrendingUp,
      title: "Gráficos em Tempo Real",
      description:
        "Visualize seus gastos com gráficos e totais atualizados instantaneamente.",
    },
    {
      icon: Calendar,
      title: "Parcelamentos Inteligentes",
      description:
        "Valores de parcelas distribuídos automaticamente mês a mês para uma visão precisa.",
    },
    {
      icon: Zap,
      title: "Atualização Rápida",
      description:
        "Interface leve e segura usando SWR e Supabase para máxima performance.",
    },
    {
      icon: Eye,
      title: "Interface Intuitiva",
      description:
        "Design pensado para o uso diário, simples e direto ao ponto.",
    },
  ];

  const roadmapItems = [
    {
      title: "MVP 1.0: A Fundação Completa",
      status: "completed",
      description: [
        "Sistema de autenticação completo com login social, e-mail/senha e recuperação via OTP.",
        "Banco de dados PostgreSQL robusto com Segurança a Nível de Linha (RLS) ativada.",
        "CRUDs completos para Perfis (Pessoas) e Categorias (com ícones e cores).",
        "Implementação da lógica de parcelamento, a funcionalidade principal do app.",
        "Dashboard dinâmico com SWR e Funções RPC.",
      ],
    },
    {
      title: "Organização de Múltiplos Gastos",
      status: "in-progress",
    },
    // {
    //   title: "Módulo de teste",
    //   status: "upcoming",
    // },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <DemoHeader />

      <main className="flex-1">
        <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
          <div className=" max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Fynli
                </motion.h1>

                <motion.h2
                  className="text-2xl md:text-3xl font-semibold text-primary mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Seu controle financeiro na palma da mão.
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Você divide seus gastos com família ou amigos? No Fynli é
                  fácil de organizar. Crie Perfis, registre despesas e
                  finalmente entenda para onde seu dinheiro está indo.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/auth">
                      Organizar Meus Gastos Agora
                      <ArrowRight size={20} className="ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative w-full"
              >
                <div className="max-w-sm mx-auto">
                  <div className="relative bg-card rounded-3xl shadow-2xl p-4 xs:p-6 border overflow-hidden">
                    <div className="flex items-center gap-2 xs:gap-3 mb-4">
                      <Smartphone
                        className="text-primary flex-shrink-0"
                        size={24}
                      />
                      <span className="text-base xs:text-lg font-semibold text-foreground">
                        Distribuição por Perfil
                      </span>
                    </div>

                    {/* Container com aspect ratio fixo */}
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "1/1", maxHeight: "256px" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <DoughnutDemo />
                      </div>
                    </div>

                    <div className="mt-4 xs:mt-6 pt-4 xs:pt-6 border-t">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs xs:text-sm font-medium text-muted-foreground whitespace-nowrap">
                          Total do Período
                        </span>
                        <span className="text-xl xs:text-2xl font-bold text-foreground whitespace-nowrap">
                          R$ 1.005,98
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
          </div>
        </section>

        <section
          id="funcionalidades"
          className="py-20 px-6 lg:px-8 bg-muted/50"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Feito para quem quer entender seus gastos de verdade.
              </h2>
            </motion.div>

            <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-card rounded-2xl p-6 xs:p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all border flex flex-col items-center text-center"
                  >
                    <div className="flex flex-col md:flex-row  justify-center items-center w-full gap-2">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/10 to-success/10 rounded-2xl mb-6">
                        <Icon className="text-primary" size={28} />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 lg:text-left">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-20 px-6 lg:px-8 bg-background">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                O Fynli está só começando.
              </h2>
              <p className="text-lg text-muted-foreground">
                Recursos que vão tornar sua organização financeira ainda mais
                poderosa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {roadmapItems.map((item, index) => {
                  const hasDescription =
                    item.description && item.description.length > 0;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <AccordionItem
                        value={`item-${index}`}
                        className={`rounded-2xl border transition-all ${
                          item.status === "completed"
                            ? "bg-success/5 border-success/30"
                            : item.status === "in-progress"
                            ? "bg-primary/5 border-primary/30"
                            : "bg-muted/50 border-border"
                        }`}
                      >
                        <AccordionTrigger
                          disabled={!hasDescription}
                          className="p-6 text-left hover:no-underline [&[data-state=open]>svg]:rotate-180"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex-shrink-0">
                              {item.status === "completed" ? (
                                <CheckCircle2
                                  className="text-success"
                                  size={24}
                                />
                              ) : item.status === "in-progress" ? (
                                <GitBranch className="text-primary" size={24} />
                              ) : (
                                <Circle
                                  className="text-muted-foreground/50"
                                  size={24}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-lg font-medium ${
                                  item.status === "completed"
                                    ? "text-foreground"
                                    : item.status === "in-progress"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.title}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <ul className="list-disc space-y-2 pl-10 text-muted-foreground">
                            {item.description?.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  );
                })}
              </Accordion>
            </motion.div>
          </div>
        </section>

        <section
          id="comecar"
          className="py-20 px-6 lg:px-8 bg-muted/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Pronto para organizar sua vida financeira?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Crie sua conta gratuita agora mesmo e comece a ter clareza sobre
                seus gastos hoje.
              </p>

              <Button
                asChild
                size="lg"
                className="rounded-xl shadow-lg hover:shadow-xl transition-all text-lg py-6 px-8"
              >
                <Link href="/auth">
                  Começar Agora
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
