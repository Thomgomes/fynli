import { ExpenseWithRelations } from "@/hooks/use-transactions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-500/20 text-amber-700 border-amber-500/30" },
  reimbursed: { label: "Reembolsado", className: "bg-green-500/20 text-green-700 border-green-500/30" },
};

interface TransactionCardProps {
  transaction: ExpenseWithRelations;
  onEdit: (expense: ExpenseWithRelations) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const category = transaction.categories;
  const IconComponent = category?.icon ? iconMap[category.icon] : null;
  const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(transaction.amount);
  const isInstallment = transaction.installments > 1;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {IconComponent && (
              <div className="p-2 bg-muted rounded-md">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">{category?.name || "Sem Categoria"}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                <span className="text-muted-foreground">{transaction.people?.name}</span>
                <span className="text-muted-foreground">•</span>
                <span>{new Date(transaction.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span>
              </div>
              <div className="mt-2 font-semibold text-lg">{amount}</div>
              {transaction.reimbursement_status && (
                <Badge variant="outline" className={`mt-2 ${statusLabels[transaction.reimbursement_status].className}`}>
                  {statusLabels[transaction.reimbursement_status].label}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(transaction)} disabled={isInstallment} className="gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                <span>Editar {isInstallment && "(N/A)"}</span>
              </DropdownMenuItem>
              <ConfirmDialog
                title="Deletar Transação?"
                description={`A despesa "${transaction.description}" será permanentemente deletada.`}
                onConfirm={() => onDelete(transaction.id)}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-destructive cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                  <span>Deletar</span>
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
