"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeButton } from "@/components/themeButton";

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // Lógica para pegar o nome de diferentes fontes (Google ou cadastro manual)
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || 'Usuário';

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            {/* Mensagem de boas-vindas personalizada */}
            <CardTitle>Bem-vindo, {displayName}!</CardTitle>
            <CardDescription>
              Este é seu dashboard seguro no Fynli.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome de Exibição:</p>
                <p className="text-lg font-semibold text-foreground">{displayName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-mail:</p>
                <p className="text-lg font-semibold text-foreground">{user.email}</p>
              </div>
            </div>
            <Button onClick={signOut} className="w-full" variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair (Logout)
            </Button>
            <ThemeButton/>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}