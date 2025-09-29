"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  CreditCard,
  Landmark,
  Smartphone,
  HandCoins,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseWithRelations } from "@/hooks/use-recent-transactions";
import { Badge } from "../ui/badge";
import { iconMap } from "@/lib/icons";

// Mapa para traduzir os status para texto e cor
const statusLabels: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pendente",
    className: "bg-amber-500/20 text-amber-700 border-amber-500/30",
  },
  reimbursed: {
    label: "Reembolsado",
    className: "bg-green-500/20 text-green-700 border-green-500/30",
  },
  not_applicable: { label: "N/A", className: "bg-muted text-muted-foreground" },
};

const paymentMethodMap: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  credito: { label: "Crédito", icon: CreditCard },
  debito: { label: "Débito", icon: Landmark },
  pix: { label: "Pix", icon: Smartphone },
  dinheiro: { label: "Dinheiro", icon: HandCoins },
  outro: { label: "Outro", icon: CircleDollarSign },
};

// Esta é a definição das nossas colunas
export const columns: ColumnDef<ExpenseWithRelations>[] = [
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const category = row.original.categories;
      const IconComponent = category?.icon ? iconMap[category.icon] : null;
      return (
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className="p-2 bg-muted rounded-md">
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium">{row.getValue("description")}</div>
            <div className="text-sm text-muted-foreground">
              {category?.name || "Sem Categoria"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "people",
    header: "Perfil",
    cell: ({ row }) => row.original.people?.name || "N/A",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full justify-end"
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "payment_method",
    header: "Pagamento",
    cell: ({ row }) => {
      const paymentMethod = row.original.payment_method;
      if (!paymentMethod)
        return <span className="text-muted-foreground">N/A</span>;

      const { label, icon: Icon } =
        paymentMethodMap[paymentMethod] || paymentMethodMap.outro;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reimbursement_status",
    header: "Reembolso",
    cell: ({ row }) => {
      const status = row.original.reimbursement_status;
      const { label, className } =
        statusLabels[status] || statusLabels.not_applicable;
      return (
        <Badge variant="outline" className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      new Date(row.original.date).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(expense.id)}
            >
              Copiar ID do Gasto
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
