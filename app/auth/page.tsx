"use client";

import React from "react";
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
import { Loader2, Mail, Lock, Chrome } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthSchema = Yup.object().shape({
  email: Yup.string()
    .email("Formato de e-mail inválido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
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

  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleAuthSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>,
    mode: "signin" | "signup"
  ) => {
    helpers.setSubmitting(true);

    const { error } =
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
        toast.success("Verifique seu E-mail!", {
          description:
            "Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail.",
        });
        helpers.resetForm();
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
          <h1 className="text-4xl font-bold text-primary mb-2">Fynli</h1>
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
              onSubmit={(values, helpers) => {}}
            >
              {({ isSubmitting, errors, touched, isValid, dirty }) => (
                <Form>
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Entrar</TabsTrigger>
                      <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                    </TabsList>

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

                    <TabsContent value="signin" className="space-y-4 pt-4">
                      <Button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAuthSubmit(
                            {
                              email: e.currentTarget.form?.email.value,
                              password: e.currentTarget.form?.password.value,
                            },
                            {
                              setSubmitting: (isSubmitting) => {},
                              resetForm: () => {},
                            } as FormikHelpers<FormValues>,
                            "signin"
                          );
                        }}
                        className="w-full"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Entrar
                      </Button>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 pt-4">
                      <Button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAuthSubmit(
                            {
                              email: e.currentTarget.form?.email.value,
                              password: e.currentTarget.form?.password.value,
                            },
                            {
                              setSubmitting: (isSubmitting) => {},
                              resetForm: () => {},
                            } as FormikHelpers<FormValues>,
                            "signup"
                          );
                        }}
                        className="w-full"
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Criar conta
                      </Button>
                    </TabsContent>
                  </Tabs>

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
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
