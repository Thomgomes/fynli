"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";
import { usePeople } from "@/hooks/use-people"; 
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type PersonFormValues = {
  name: string;
  color: string;
};

const PersonSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Muito curto!').max(50, 'Muito longo!').required('O nome é obrigatório'),
  color: Yup.string().matches(/^#[0-9A-F]{6}$/i, 'Cor em formato hexadecimal inválido (ex: #RRGGBB)').required('Obrigatório'),
});

export default function PeoplePage() {
  const { people, isLoading, addPerson, updatePerson, deletePerson } = usePeople();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Tables<'people'> | null>(null);

  const handleFormSubmit = async (values: PersonFormValues, { setSubmitting, resetForm }: FormikHelpers<PersonFormValues>) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, values);
      } else {
        await addPerson(values);
      }
      resetForm();
      setIsModalOpen(false);
      setEditingPerson(null);
    } catch (error) {
      console.error("Falha ao salvar perfil:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (person: Tables<'people'>) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };
  
  const openNewModal = () => {
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Perfis (Pessoas)</h1>
          <p className="text-muted-foreground">Adicione, edite ou remova os perfis de gastos.</p>
        </div>
        <Button onClick={openNewModal} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Perfis</CardTitle>
          {!isLoading && <CardDescription>{people?.length || 0} perfil(s) encontrado(s).</CardDescription>}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : people && people.length > 0 ? (
            <div className="space-y-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full" style={{ backgroundColor: person.color || '#ccc' }} />
                    <span className="font-medium">{person.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModal(person)} className="gap-2 cursor-pointer"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                      <ConfirmDialog
                        title="Tem certeza que deseja deletar?"
                        description={`Esta ação não pode ser desfeita. Isso irá deletar permanentemente o perfil "${person.name}".`}
                        onConfirm={() => deletePerson(person.id)}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                      </ConfirmDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum perfil cadastrado. Adicione seu primeiro!</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPerson ? 'Editar Perfil' : 'Criar Novo Perfil'}</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              name: editingPerson?.name || '',
              color: editingPerson?.color || '#3b82f6',
            }}
            validationSchema={PersonSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Perfil</Label>
                  <Field as={Input} name="name" id="name" placeholder="Ex: Mãe, Viagem à Praia..." />
                  {errors.name && touched.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor de Destaque</Label>
                  <Field as={Input} name="color" id="color" type="color" className="p-1 h-10 w-full" />
                  {errors.color && touched.color ? <p className="text-sm text-destructive">{errors.color}</p> : null}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingPerson(null); }}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Perfil'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}