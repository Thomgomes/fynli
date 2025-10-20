/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { useCategories } from "@/hooks/use-categories";
import { availableIcons } from "@/lib/icons";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory?: Tables<"categories"> | null;
  onSuccess?: () => void;
}

type CategoryFormValues = {
  name: string;
  icon: string;
  color: string;
};

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Muito curto!")
    .max(50, "Muito longo!")
    .required("O nome é obrigatório"),
  icon: Yup.string().required("Selecione um ícone"),
  color: Yup.string()
    .matches(/^#[0-9A-F]{6}$/i, "Cor inválida")
    .required("Obrigatório"),
});

export function CategoryFormDialog({
  open,
  onOpenChange,
  editingCategory,
  onSuccess,
}: CategoryFormDialogProps) {
  const { addCategory, updateCategory } = useCategories();

  const handleFormSubmit = async (
    values: CategoryFormValues,
    { setSubmitting, resetForm }: FormikHelpers<CategoryFormValues>
  ) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
      } else {
        await addCategory(values.name, values.icon, values.color);
      }
      resetForm();
      onOpenChange(false);
      onSuccess?.();
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
          <DialogTitle>
            {editingCategory ? "Editar Categoria" : "Criar Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: editingCategory?.name || "",
            icon: editingCategory?.icon || "ShoppingCart",
            color: editingCategory?.color || "#3b82f6",
          }}
          validationSchema={CategorySchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Field
                  as={Input}
                  name="name"
                  id="name"
                  placeholder="Ex: Supermercado"
                />
                {errors.name && touched.name ? (
                  <p className="text-sm text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone</Label>
                <Field name="icon">
                  {({ field, form }: any) => (
                    <Select
                      onValueChange={(value) => form.setFieldValue('icon', value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.key} value={icon.key}>
                            <div className="flex items-center gap-2">
                              <icon.component className="h-4 w-4" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                {errors.icon && touched.icon ? (
                  <p className="text-sm text-destructive">{errors.icon}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Field
                  as={Input}
                  name="color"
                  id="color"
                  type="color"
                  className="p-1 h-10 w-full"
                />
                {errors.color && touched.color ? (
                  <p className="text-sm text-destructive">{errors.color}</p>
                ) : null}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
