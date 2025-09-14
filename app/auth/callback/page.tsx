"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // O listener onAuthStateChange do nosso AuthProvider vai detectar a sessão na URL.
    // Nós só precisamos esperar o estado ser atualizado.

    // Quando o carregamento inicial terminar e tivermos um usuário, o login foi bem-sucedido.
    if (!isLoading && user) {
      router.push("/dashboard");
    }

    // Se o carregamento terminar e não houver usuário, algo deu errado.
    if (!isLoading && !user) {
      // Poderíamos mostrar um erro, mas por enquanto vamos redirecionar para a página de login.
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  // Enquanto a verificação acontece, mostramos uma tela de carregamento.
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Autenticando e redirecionando...</p>
    </div>
  );
}
