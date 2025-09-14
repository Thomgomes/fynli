"use client";

import React, { Suspense } from "react";
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
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .required("A nova senha é obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirme sua nova senha"),
});

interface FormValues {
  password: string;
  confirmPassword: string;
}

function UpdatePasswordComponent() {
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleUpdatePassword = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    const { error } = await updatePassword(values.password);

    if (error) {
      toast.error("Erro ao atualizar", {
        description:
          "Não foi possível atualizar sua senha. O token pode ter expirado.",
      });
    } else {
      toast.success("Senha atualizada!", {
        description: "Sua senha foi alterada com sucesso. Faça o login.",
      });
      router.push("/auth");
    }
    helpers.setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crie sua Nova Senha</CardTitle>
          <CardDescription>
            Sua sessão foi verificada. Agora, defina uma nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={UpdatePasswordSchema}
            onSubmit={handleUpdatePassword}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 ${
                        touched.password && errors.password
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={`pl-10 ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Salvar Nova Senha
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        <Link href="/auth" className="underline">
          Cancelar Redefinição
        </Link>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <UpdatePasswordComponent />
    </Suspense>
  );
}
