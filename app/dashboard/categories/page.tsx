/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { availableIcons, iconMap } from "@/lib/icons";
import { useCategories } from "@/hooks/use-categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type CategoryFormValues = {
  name: string;
  icon: string;
};

const CategorySchema = Yup.object().shape({
  name: Yup.string().min(2, 'Muito curto!').max(50, 'Muito longo!').required('O nome é obrigatório'),
  icon: Yup.string().required('Selecione um ícone'),
});

export default function CategoriesPage() {
  const { categories, isLoading, addCategory, deleteCategory, updateCategory } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Tables<'categories'> | null>(null);

  const handleFormSubmit = async (values: CategoryFormValues, { setSubmitting, resetForm }: FormikHelpers<CategoryFormValues>) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: values.name, icon: values.icon });
      } else {
        await addCategory(values.name, values.icon);
      }
      resetForm();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Falha ao salvar categoria:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (category: Tables<'categories'>) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };
  
  const openNewModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <p className="text-muted-foreground">Adicione, edite ou remova suas categorias de gastos.</p>
        </div>
        <Button onClick={openNewModal} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Categorias</CardTitle>
          {!isLoading && <CardDescription>{categories?.length || 0} categoria(s) encontrada(s).</CardDescription>}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon ? iconMap[cat.icon] : null;
                return (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(cat)} className="gap-2 cursor-pointer"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>

                        <ConfirmDialog
                          title="Tem certeza que deseja deletar?"
                          description={`Esta ação não pode ser desfeita. Isso irá deletar permanentemente a categoria "${cat.name}".`}
                          onConfirm={() => deleteCategory(cat.id)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </ConfirmDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma categoria cadastrada. Adicione sua primeira!</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              name: editingCategory?.name || '',
              icon: editingCategory?.icon || 'ShoppingCart',
            }}
            validationSchema={CategorySchema}
            onSubmit={handleFormSubmit}
            enableReinitialize 
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria</Label>
                  <Field as={Input} name="name" id="name" placeholder="Ex: Supermercado" />
                  {errors.name && touched.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Field name="icon">
                    {({ field }: any) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Selecione um ícone..." /></SelectTrigger>
                        <SelectContent>
                          {availableIcons.map(icon => (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center gap-2">
                                <icon.component className="h-4 w-4" />
                                <span>{icon.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.icon && touched.icon ? <p className="text-sm text-destructive">{errors.icon}</p> : null}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingCategory(null); }}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
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