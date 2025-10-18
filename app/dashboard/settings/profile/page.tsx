"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schema para o formulário de atualização de nome
const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Muito curto!').required('O nome é obrigatório'),
});

// Schema para o formulário de atualização de senha
const PasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Obrigatório'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirme sua nova senha'),
});

export default function ProfileSettingsPage() {
  const { user, updatePassword } = useAuth();

  const handleUpdateName = async (values: { name: string }, { setSubmitting }: FormikHelpers<{ name: string }>) => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: values.name }
    });
    
    if (error) {
      toast.error("Erro ao atualizar o nome.", { description: error.message });
    } else {
      toast.success("Nome atualizado com sucesso!");
    }
    setSubmitting(false);
  };

  const handleUpdatePassword = async (values: { password: string }, { setSubmitting, resetForm }: FormikHelpers<{ password: string }>) => {
    const { error } = await updatePassword(values.password);

    if (error) {
      toast.error("Erro ao atualizar a senha.", { description: error.message });
    } else {
      toast.success("Senha atualizada com sucesso!");
      resetForm();
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {/* Card 1: Atualização de Perfil */}
      <Formik
        initialValues={{ name: user?.user_metadata?.display_name || '' }}
        validationSchema={ProfileSchema}
        onSubmit={handleUpdateName}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Atualize seu nome de exibição.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                  <p className="text-xs text-muted-foreground">O e-mail da conta não pode ser alterado.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome de Exibição</Label>
                  <Field as={Input} name="name" id="name" />
                  {errors.name && touched.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>

      {/* Card 2: Segurança (Alteração de Senha) */}
      <Formik
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={PasswordSchema}
        onSubmit={handleUpdatePassword}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Atualize sua senha de acesso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Field as={Input} name="password" id="password" type="password" />
                  {errors.password && touched.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Field as={Input} name="confirmPassword" id="confirmPassword" type="password" />
                  {errors.confirmPassword && touched.confirmPassword ? <p className="text-sm text-destructive">{errors.confirmPassword}</p> : null}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Atualizar Senha
                </Button>
              </CardFooter>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}