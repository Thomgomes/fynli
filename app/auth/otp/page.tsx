"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

function VerifyOtpPageContent() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp } = useAuth();

  // Pega o e-mail da URL para usar na verificação
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast.error("Erro", {
        description:
          "Nenhum e-mail fornecido. Voltando para a página de login.",
      });
      router.push("/auth");
    }
  }, [email, router]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Código inválido", {
        description: "O código precisa ter 6 dígitos.",
      });
      return;
    }
    if (!email) return;

    setIsLoading(true);

    const { error } = await verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (error) {
      toast.error("Erro na verificação", {
        description: "O código está incorreto ou expirou. Tente novamente.",
      });
    } else {
      toast.success("E-mail verificado!", {
        description: "Sua conta foi confirmada com sucesso. Redirecionando...",
      });
      // O onAuthStateChange vai detectar a nova sessão e o useEffect no dashboard
      // vai cuidar do resto, mas podemos forçar o redirecionamento aqui.
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col gap-6 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">Verifique seu E-mail</CardTitle>
          <CardDescription>
            Enviamos um código de 6 dígitos para <strong>{email}</strong>. Por
            favor, insira-o abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verificar e Entrar
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center text-sm text-muted-foreground gap-1">
        <p>Digitou o Email errado?</p>
        <Link href="/auth" className="text-primary">
        <Button variant="link">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}

// O Suspense é importante para garantir que o useSearchParams funcione corretamente
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyOtpPageContent />
    </Suspense>
  );
}
