/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { useCategories } from "@/hooks/use-categories";
import { availableIcons } from "@/lib/icons";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: Tables<'categories'> | null;
  onSuccess?: () => void; // Callback opcional para quando a operação for bem-sucedida
}

type CategoryFormValues = {
  name: string;
  icon: string;
};

const CategorySchema = Yup.object().shape({
  name: Yup.string().min(2, 'Muito curto!').max(50, 'Muito longo!').required('O nome é obrigatório'),
  icon: Yup.string().required('Selecione um ícone'),
});

export function CategoryFormDialog({ open, onOpenChange, editingCategory, onSuccess }: CategoryFormDialogProps) {
  const { addCategory, updateCategory } = useCategories();

  const handleFormSubmit = async (values: CategoryFormValues, { setSubmitting, resetForm }: FormikHelpers<CategoryFormValues>) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
      } else {
        await addCategory(values.name, values.icon);
      }
      resetForm();
      onOpenChange(false);
      onSuccess?.(); // Chama o callback de sucesso, se existir
    } catch (error) {
      console.error("Falha ao salvar categoria:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}