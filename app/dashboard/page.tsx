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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Bem-vindo ao Dashboard do Fynli!</CardTitle>
            <CardDescription>
              Esta é sua área segura. O login está funcionando corretamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted">
              <p className="text-sm font-medium text-muted-foreground">
                Usuário Logado:
              </p>
              <p className="text-lg font-semibold text-foreground">
                {user.email}
              </p>
            </div>
            <Button
              onClick={signOut}
              className="w-full"
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair (Logout)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se o useEffect ainda não redirecionou, retornamos null para não renderizar nada
  return null;
}
