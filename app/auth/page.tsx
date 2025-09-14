"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const AuthSchema = Yup.object().shape({
  email: Yup.string()
    .email("Formato de e-mail inválido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(8, "A senha deve ter no mínimo 6 caracteres")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .required("A senha é obrigatória"),
});

interface FormValues {
  email: string;
  password: string;
}

export default function AuthPage() {
  const { signInWithPassword, signUpWithPassword, signInWithGoogle, user } =
    useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleAuthSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const { data, error } =
      mode === "signin"
        ? await signInWithPassword(values.email, values.password)
        : await signUpWithPassword(values.email, values.password);

    if (error) {
      const description =
        error.message === "Invalid login credentials"
          ? "Credenciais inválidas. Verifique seu e-mail e senha."
          : error.message === "User already registered"
          ? "Este e-mail já está cadastrado. Tente fazer login."
          : "Ocorreu um erro. Tente novamente.";
      toast.error("Erro na Autenticação", { description });
    } else {
      if (mode === "signup") {
        if (data.session === null) {
          toast.info("Cadastro realizado!", {
            description: "Enviamos um código de verificação para o seu e-mail.",
          });
          router.push(`/auth/otp?email=${encodeURIComponent(values.email)}`);
        }
      } else {
        toast.success("Bem-vindo de volta!", {
          description: "Login realizado com sucesso.",
        });
      }
    }
    helpers.setSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-primary mb-2">Fynli</h1>
          </Link>
          <p className="text-muted-foreground">
            Organize seus gastos de forma inteligente
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Entre com sua conta ou crie uma nova para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik<FormValues>
              initialValues={{ email: "", password: "" }}
              validationSchema={AuthSchema}
              onSubmit={handleAuthSubmit}
            >
              {({ errors, touched, isSubmitting, isValid, dirty }) => (
                <Tabs
                  defaultValue="signin"
                  className="w-full"
                  onValueChange={(value) =>
                    setMode(value as "signin" | "signup")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                  </TabsList>

                  <Form>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            className={`pl-10 ${
                              touched.email && errors.email
                                ? "border-destructive"
                                : ""
                            }`}
                            disabled={isSubmitting}
                          />
                        </div>
                        {touched.email && errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Field
                            as={Input}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Sua senha"
                            className={`pl-10 ${
                              touched.password && errors.password
                                ? "border-destructive"
                                : ""
                            }`}
                            disabled={isSubmitting}
                          />
                        </div>
                        {touched.password && errors.password && (
                          <p className="text-sm text-destructive">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right mb-4 mt-2">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-muted-foreground hover:text-primary underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <TabsContent value="signin" className="mt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        {isSubmitting && mode === "signin" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Entrar
                      </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="mt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        {isSubmitting && mode === "signup" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Criar conta
                      </Button>
                    </TabsContent>
                  </Form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleGoogleAuth}
                    className="w-full"
                    disabled={isSubmitting}
                    type="button"
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Google
                  </Button>
                </Tabs>
              )}
            </Formik>
          </CardContent>
        </Card>
        <div className="mt-8 flex justify-center">
          <Link href="/demo">
            <Button variant="link">Ir para tela de Demonstração</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
