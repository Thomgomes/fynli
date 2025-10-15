import { ExpenseWithRelations } from "@/hooks/use-transactions";
import { Badge } from "@/components/ui/badge";
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

interface TransactionCardProps {
  transaction: ExpenseWithRelations;
  onEdit: (expense: ExpenseWithRelations) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const isInstallment = transaction.installments > 1;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex flex-col items-start gap-3 w-full">
        <div className="flex w-full justify-between">
          <p className="font-semibold text-foreground truncate">
            {transaction.description}
          </p>
          <div className="font-semibold text-foreground">
            {formatCurrency(transaction.amount)}
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {transaction.people?.name || "Desconhecido"} •{" "}
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </p>
          {transaction.categories && (
            <Badge variant="outline" className="font-normal">
              {transaction.categories.name}
            </Badge>
          )}
        </div>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(transaction)}
              disabled={isInstallment}
              className="gap-2 cursor-pointer"
            >
              <Edit className="h-4 w-4" />
              <span>Editar {isInstallment && "(N/A)"}</span>
            </DropdownMenuItem>
            <ConfirmDialog
              title="Deletar Transação?"
              description={`A despesa "${transaction.description}" será permanentemente deletada.`}
              onConfirm={() => onDelete(transaction.id)}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="gap-2 text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Deletar</span>
              </DropdownMenuItem>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
