/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { usePeople } from "@/hooks/use-people";
import { useCategories } from "@/hooks/use-categories";
import { Loader2, PlusCircle } from "lucide-react";
import { CategoryFormDialog } from "./dialog/categoryFormDialog"; 
import { PersonFormDialog } from "./dialog/peopleFormDialog"; 
import { ExpenseWithRelations, useTransactions } from "@/hooks/use-transactions"; // Importando o tipo

// --- INÍCIO DA CORREÇÃO ---
interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  editingExpense?: ExpenseWithRelations | null; // Prop para a despesa em edição
}
// --- FIM DA CORREÇÃO ---

const ExpenseSchema = Yup.object().shape({
  description: Yup.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.').max(100, 'A descrição é muito longa.').required('Obrigatório'),
  amount: Yup.number().positive('O valor deve ser maior que zero.').required('Obrigatório'),
  date: Yup.date().required('Obrigatório'),
  person_id: Yup.string().required('Selecione um perfil.'),
  category_id: Yup.string().required('Selecione uma categoria.'),
  payment_method: Yup.string().oneOf(['credito', 'debito', 'pix', 'dinheiro', 'outro']).required('Obrigatório'),
  reimbursement_status: Yup.string().oneOf(['pending', 'reimbursed', 'not_applicable']).required('Obrigatório'),
  installments: Yup.number().integer('Deve ser um número inteiro.').min(1, 'Mínimo de 1 parcela.').max(48, 'Máximo de 48 parcelas.').required('Obrigatório'),
});

interface ExpenseFormValues {
  description: string; amount: number | ''; date: string;
  person_id: string; category_id: string; payment_method: 'credito' | 'debito' | 'pix' | 'dinheiro' | 'outro';
  reimbursement_status: 'pending' | 'reimbursed' | 'not_applicable'; installments: number;
}

export function AddExpenseModal({ open, onOpenChange, onSuccess, editingExpense }: AddExpenseModalProps) {
  const { people } = usePeople();
  const { categories } = useCategories();
  const { addTransaction, updateTransaction } = useTransactions({}, { pageIndex: 0, pageSize: 10 }); // Apenas para ter a função de update
  
  const [isCreatingPerson, setIsCreatingPerson] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleSubmit = async (values: ExpenseFormValues, { setSubmitting, resetForm }: FormikHelpers<ExpenseFormValues>) => {
    try {
      if (editingExpense) {
        await updateTransaction(editingExpense.id, {
          description: values.description,
          amount: values.amount as number,
          date: values.date,
          person_id: values.person_id,
          category_id: values.category_id,
          payment_method: values.payment_method,
          reimbursement_status: values.reimbursement_status,
        });
      } else {
        await addTransaction(values);
      }
      toast.success(`Gasto ${editingExpense ? 'atualizado' : 'adicionado'} com sucesso!`);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      // O hook já mostra o toast de erro, apenas logamos aqui
      console.error("Falha ao salvar despesa", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Editar Gasto' : 'Adicionar Novo Gasto'}</DialogTitle>
            <DialogDescription>{editingExpense ? 'Ajuste os detalhes da sua despesa.' : 'Registre uma nova despesa detalhadamente.'}</DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{
              description: editingExpense?.description || '',
              amount: editingExpense?.amount || '',
              date: editingExpense ? new Date(editingExpense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              person_id: editingExpense?.person_id || '',
              category_id: editingExpense?.category_id || '',
              payment_method: editingExpense?.payment_method || 'credito',
              reimbursement_status: editingExpense?.reimbursement_status || 'not_applicable',
              installments: editingExpense?.installments || 1,
            }}
            validationSchema={ExpenseSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
              <Form className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Field as={Input} name="description" id="description" placeholder="Ex: Compras do mês" />
                  {errors.description && touched.description ? <p className="text-sm text-destructive">{errors.description}</p> : null}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor Total (R$)</Label>
                    <Field as={Input} name="amount" id="amount" type="number" placeholder="100.00" />
                    {errors.amount && touched.amount ? <p className="text-sm text-destructive">{errors.amount}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da 1ª Parcela</Label>
                    <Field as={Input} name="date" id="date" type="date" />
                    {errors.date && touched.date ? <p className="text-sm text-destructive">{errors.date}</p> : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Para quem?</Label>
                    <Field name="person_id">
                      {({ field }: any) => (
                        <Select onValueChange={(value) => setFieldValue('person_id', value)} defaultValue={field.value}>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                            {people?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            <SelectSeparator />
                            <div className="flex items-center gap-2 p-2 cursor-pointer text-sm text-primary hover:bg-muted" onMouseDown={(e) => { e.preventDefault(); setIsCreatingPerson(true); }}>
                              <PlusCircle className="h-4 w-4" /> Adicionar novo perfil...
                            </div>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.person_id && touched.person_id ? <p className="text-sm text-destructive">{errors.person_id}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Field name="category_id">
                      {({ field }: any) => (
                        <Select onValueChange={(value) => setFieldValue('category_id', value)} defaultValue={field.value}>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                            {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            <SelectSeparator />
                            <div className="flex items-center gap-2 p-2 cursor-pointer text-sm text-primary hover:bg-muted" onMouseDown={(e) => { e.preventDefault(); setIsCreatingCategory(true); }}>
                              <PlusCircle className="h-4 w-4" /> Adicionar nova categoria...
                            </div>
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.category_id && touched.category_id ? <p className="text-sm text-destructive">{errors.category_id}</p> : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <Field name="payment_method">{({ field }: any) => (<Select onValueChange={(value) => setFieldValue('payment_method', value)} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="credito">Crédito</SelectItem><SelectItem value="debito">Débito</SelectItem><SelectItem value="pix">Pix</SelectItem><SelectItem value="dinheiro">Dinheiro</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select>)}</Field>
                  </div>
                  <div className="space-y-2">
                    <Label>Status do Reembolso</Label>
                    <Field name="reimbursement_status">{({ field }: any) => (<Select onValueChange={(value) => setFieldValue('reimbursement_status', value)} defaultValue={field.value}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="not_applicable">Não se aplica</SelectItem><SelectItem value="pending">Pendente</SelectItem><SelectItem value="reimbursed">Reembolsado</SelectItem></SelectContent></Select>)}</Field>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installments">Número de Parcelas</Label>
                  <Field as={Input} name="installments" id="installments" type="number" min="1" max="48" disabled={!!editingExpense} />
                  {editingExpense && <p className="text-xs text-muted-foreground">Não é possível editar o número de parcelas.</p>}
                  {errors.installments && touched.installments ? <p className="text-sm text-destructive">{errors.installments}</p> : null}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingExpense ? 'Salvar Alterações' : 'Adicionar Gasto'}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <CategoryFormDialog open={isCreatingCategory} onOpenChange={setIsCreatingCategory} onSuccess={() => { /* SWR vai revalidar a lista automaticamente */ }} />
      <PersonFormDialog open={isCreatingPerson} onOpenChange={setIsCreatingPerson} onSuccess={() => { /* SWR vai revalidar a lista automaticamente */ }} />
    </>
  );
}