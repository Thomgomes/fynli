/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TablesInsert } from "@/integrations/supabase/types";
import { usePeople } from "@/hooks/use-people";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, PlusCircle } from "lucide-react";
import { CategoryFormDialog } from "./dialog/categoryFormDialog";
import { PersonFormDialog } from "./dialog/peopleFormDialog";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: () => void;
}

// 1. Schema de Validação robusto com Yup
const ExpenseSchema = Yup.object().shape({
  description: Yup.string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres.")
    .max(100, "A descrição é muito longa.")
    .required("Obrigatório"),
  amount: Yup.number()
    .positive("O valor deve ser maior que zero.")
    .required("Obrigatório"),
  date: Yup.date().required("Obrigatório"),
  person_id: Yup.string().required("Selecione um perfil."),
  category_id: Yup.string().required("Selecione uma categoria."),
  payment_method: Yup.string()
    .oneOf(["credit_card", "debit_card", "pix", "cash", "other"])
    .required("Obrigatório"),
  reimbursement_status: Yup.string()
    .oneOf(["pending", "reimbursed", "not_applicable"])
    .required("Obrigatório"),
  installments: Yup.number()
    .integer("Deve ser um número inteiro.")
    .min(1, "Mínimo de 1 parcela.")
    .max(48, "Máximo de 48 parcelas.")
    .required("Obrigatório"),
});

// Tipagem para os valores do formulário
interface ExpenseFormValues {
  description: string;
  amount: number | "";
  date: string;
  person_id: string;
  category_id: string;
  payment_method: "credit_card" | "debit_card" | "pix" | "cash" | "other";
  reimbursement_status: "pending" | "reimbursed" | "not_applicable";
  installments: number;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const { user } = useAuth();
  // 2. Usando nossos hooks com SWR para buscar os dados dos seletores
  const { people } = usePeople();
  const { categories } = useCategories();

  const [isCreatingPerson, setIsCreatingPerson] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleSubmit = async (
    values: ExpenseFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ExpenseFormValues>
  ) => {
    if (!user) return;

    try {
      const expensesToInsert: TablesInsert<"expenses">[] = [];
      const totalInstallments =
        values.installments > 1 ? values.installments : 1;
      const installmentAmount = (values.amount as number) / totalInstallments;

      // 3. Lógica de parcelamento que planejamos
      for (let i = 0; i < totalInstallments; i++) {
        const expenseDate = new Date(values.date);
        expenseDate.setUTCMonth(expenseDate.getUTCMonth() + i);

        expensesToInsert.push({
          user_id: user.id,
          person_id: values.person_id,
          category_id: values.category_id,
          description:
            totalInstallments > 1
              ? `${values.description} (${i + 1}/${totalInstallments})`
              : values.description,
          amount: installmentAmount,
          date: expenseDate.toISOString().split("T")[0],
          payment_method: values.payment_method,
          reimbursement_status: values.reimbursement_status,
          installments: totalInstallments,
        });
      }

      const { error } = await supabase
        .from("expenses")
        .insert(expensesToInsert);
      if (error) throw error;

      toast.success("Gasto adicionado!", {
        description: `Sua despesa "${values.description}" foi registrada.`,
      });
      resetForm();
      onOpenChange(false);
      onExpenseAdded?.();
    } catch (error: any) {
      toast.error("Erro ao salvar despesa", { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Gasto</DialogTitle>
            <DialogDescription>
              Registre uma nova despesa detalhadamente.
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{
              description: "",
              amount: "",
              date: new Date().toISOString().split("T")[0],
              person_id: "",
              category_id: "",
              payment_method: "credit_card",
              reimbursement_status: "not_applicable",
              installments: 1,
            }}
            validationSchema={ExpenseSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Field
                    as={Input}
                    name="description"
                    id="description"
                    placeholder="Ex: Compras do mês"
                  />
                  {errors.description && touched.description ? (
                    <p className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor Total (R$)</Label>
                    <Field
                      as={Input}
                      name="amount"
                      id="amount"
                      type="number"
                      placeholder="100.00"
                    />
                    {errors.amount && touched.amount ? (
                      <p className="text-sm text-destructive">
                        {errors.amount}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da 1ª Parcela</Label>
                    <Field as={Input} name="date" id="date" type="date" />
                    {errors.date && touched.date ? (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Para quem?</Label>
                    <Field name="person_id">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("person_id", value)
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {people?.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                            <SelectSeparator />
                            {/* 3. Opção de "Adicionar Novo" */}
                            <div
                              className="flex items-center gap-2 p-2 cursor-pointer text-sm text-primary hover:bg-muted"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setIsCreatingPerson(true);
                              }}
                            >
                              <PlusCircle className="h-4 w-4" /> Adicionar
                              perfil...
                            </div>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.person_id && touched.person_id ? (
                      <p className="text-sm text-destructive">
                        {errors.person_id}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Field name="category_id">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("category_id", value)
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                            <SelectSeparator />
                            {/* 3. Opção de "Adicionar Novo" */}
                            <div
                              className="flex items-center gap-2 p-2 cursor-pointer text-sm text-primary hover:bg-muted"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setIsCreatingCategory(true);
                              }}
                            >
                              <PlusCircle className="h-4 w-4" /> Adicionar
                              categoria...
                            </div>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.category_id && touched.category_id ? (
                      <p className="text-sm text-destructive">
                        {errors.category_id}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <Field name="payment_method">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("payment_method", value)
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">
                              Cartão de Crédito
                            </SelectItem>
                            <SelectItem value="debit_card">
                              Cartão de Débito
                            </SelectItem>
                            <SelectItem value="pix">Pix</SelectItem>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <Label>Status do Reembolso</Label>
                    <Field name="reimbursement_status">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("reimbursement_status", value)
                          }
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_applicable">
                              Não se aplica
                            </SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="reimbursed">
                              Reembolsado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installments">Número de Parcelas</Label>
                  <Field
                    as={Input}
                    name="installments"
                    id="installments"
                    type="number"
                    min="1"
                    max="48"
                  />
                  {errors.installments && touched.installments ? (
                    <p className="text-sm text-destructive">
                      {errors.installments}
                    </p>
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
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Adicionar Gasto
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <CategoryFormDialog
        open={isCreatingCategory}
        onOpenChange={setIsCreatingCategory}
      />
      <PersonFormDialog
        open={isCreatingPerson}
        onOpenChange={setIsCreatingPerson}
      />
    </>
  );
}
