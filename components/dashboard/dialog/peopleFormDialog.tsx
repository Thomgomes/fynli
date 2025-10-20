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
import { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { usePeople } from "@/hooks/use-people";

interface PersonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPerson?: Tables<"people"> | null;
  onSuccess?: () => void;
}

type PersonFormValues = {
  name: string;
  color: string;
};

const PersonSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Muito curto!")
    .max(50, "Muito longo!")
    .required("O nome é obrigatório"),
  color: Yup.string()
    .matches(
      /^#[0-9A-F]{6}$/i,
      "Cor em formato hexadecimal inválido (ex: #RRGGBB)"
    )
    .required("Obrigatório"),
});

export function PersonFormDialog({
  open,
  onOpenChange,
  editingPerson,
  onSuccess,
}: PersonFormDialogProps) {
  const { addPerson, updatePerson } = usePeople();

  const handleFormSubmit = async (
    values: PersonFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PersonFormValues>
  ) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, values as TablesUpdate<"people">);
      } else {
        await addPerson(values);
      }
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Falha ao salvar perfil:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingPerson ? "Editar Perfil" : "Criar Novo Perfil"}
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: editingPerson?.name || "",
            color: editingPerson?.color || "#3b82f6",
          }}
          validationSchema={PersonSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Perfil</Label>
                <Field
                  as={Input}
                  name="name"
                  id="name"
                  placeholder="Ex: Mãe, Viagem à Praia..."
                />
                {errors.name && touched.name ? (
                  <p className="text-sm text-destructive">{errors.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor de Destaque</Label>
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
