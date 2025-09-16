/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

// Tipagem para os dados que buscamos
type Person = Pick<Tables<"people">, "id" | "name">;
type Category = Pick<Tables<"categories">, "id" | "name">;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: () => void;
}

// Schema de validação com Yup
const ExpenseSchema = Yup.object().shape({
  description: Yup.string()
    .min(3, "Descrição muito curta")
    .max(100, "Descrição muito longa")
    .required("A descrição é obrigatória"),
  amount: Yup.number()
    .positive("O valor deve ser maior que zero")
    .required("O valor é obrigatório"),
  date: Yup.date().required("A data é obrigatória"),
  person_id: Yup.string().required("Selecione uma pessoa"),
  category_id: Yup.string().required("Selecione uma categoria"),
  payment_method: Yup.string()
    .oneOf(["credit_card", "debit_card", "pix", "cash", "other"])
    .required("Obrigatório"),
  reimbursement_status: Yup.string()
    .oneOf(["not_applicable", "pending", "reimbursed"])
    .required("Obrigatório"),
  installments: Yup.number()
    .integer("Deve ser um número inteiro")
    .min(1, "Mínimo de 1 parcela")
    .max(48, "Máximo de 48 parcelas")
    .required("Obrigatório"),
});

export function AddExpenseModal({
  open,
  onOpenChange,
  onExpenseAdded,
}: AddExpenseModalProps) {
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Busca os dados de Pessoas e Categorias quando o modal abre
  useEffect(() => {
    if (open && user) {
      const fetchData = async () => {
        const { data: peopleData } = await supabase
          .from("people")
          .select("id, name")
          .eq("user_id", user.id);
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name")
          .eq("user_id", user.id);
        setPeople(peopleData || []);
        setCategories(categoriesData || []);
      };
      fetchData();
    }
  }, [open, user]);

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    if (!user) return;

    try {
      const expensesToInsert = [];
      const totalInstallments =
        values.installments > 1 ? values.installments : 1;

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
          amount: values.amount / totalInstallments,
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
        description: `Sua despesa "${values.description}" foi registrada com sucesso.`,
      });
      resetForm();
      onOpenChange(false);
      onExpenseAdded?.();
    } catch (error: any) {
      toast.error("Erro ao salvar", { description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Campos do formulário com <Field> */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Field
                  as={Input}
                  name="description"
                  id="description"
                  placeholder="Ex: Supermercado"
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
                    placeholder="100,00"
                  />
                  {errors.amount && touched.amount ? (
                    <p className="text-sm text-destructive">{errors.amount}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {people.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
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
                        onValueChange={field.onChange}
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
                  {errors.payment_method && touched.payment_method ? (
                    <p className="text-sm text-destructive">
                      {errors.payment_method}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label>Status do Reembolso</Label>
                  <Field name="reimbursement_status">
                    {({ field }: any) => (
                      <Select
                        onValueChange={field.onChange}
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
                  {errors.reimbursement_status &&
                  touched.reimbursement_status ? (
                    <p className="text-sm text-destructive">
                      {errors.reimbursement_status}
                    </p>
                  ) : null}
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
                  max="24"
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
                  {isSubmitting ? "Salvando..." : "Adicionar Gasto"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
