"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile-settings";
import { Skeleton } from "@/components/ui/skeleton";

// Schema para o formulário de atualização de nome
const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Nome muito curto!').required('O nome é obrigatório'),
});

// Schema para o formulário de atualização de senha
const PasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, 'A senha deve ter no mínimo 8 caracteres').required('Obrigatório'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirme sua nova senha'),
});

interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

export default function ProfileSettingsPage() {
  const { user, updatePassword } = useAuth(); 
  const { profile, isLoading, updateProfile } = useProfile();

  // O nome do Google é apenas um fallback para o valor inicial
  const googleName = user?.user_metadata?.display_name || user?.user_metadata?.full_name;

  const handleUpdateName = async (values: { name: string }, { setSubmitting }: FormikHelpers<{ name: string }>) => {
    // Agora só atualizamos o 'display_name' na nossa tabela 'profiles'
    await updateProfile({ 
      display_name: values.name,
    });
    setSubmitting(false);
  };

  const handleUpdatePassword = async (
    values: PasswordFormValues, 
    { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>
  ) => {
    const { error } = await updatePassword(values.password); 
    if (error) {
      toast.error("Erro ao atualizar a senha.", { description: error.message });
    } else {
      toast.success("Senha atualizada com sucesso!");
      resetForm();
    }
    setSubmitting(false);
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-8">
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    )
  }
  
  // O nome de exibição é o do nosso 'profile' ou, como fallback, o do Google.
  const currentDisplayName = profile?.display_name || googleName || '';

  return (
    <div className="space-y-8">
      {/* Card 1: Atualização de Perfil (AGORA SÓ UM FORMULÁRIO) */}
      <Formik
        initialValues={{ name: currentDisplayName }}
        validationSchema={ProfileSchema}
        onSubmit={handleUpdateName}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Atualize seu nome de usuário.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" value={user.email || ''} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome de Usuário</Label>
                  <Field as={Input} name="name" id="name" placeholder="Digite seu nome..." />
                  <ErrorMessage name="name" component="p" className="text-sm text-destructive" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Perfil
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
        {({ isSubmitting }) => (
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
                  <ErrorMessage name="password" component="p" className="text-sm text-destructive" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Field as={Input} name="confirmPassword" id="confirmPassword" type="password" />
                  <ErrorMessage name="confirmPassword" component="p" className="text-sm text-destructive" />
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