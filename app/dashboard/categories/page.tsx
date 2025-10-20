"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, PlusCircle, Trash2, Edit, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";
import { useCategories } from "@/hooks/use-categories";
import { iconMap } from "@/lib/icons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryFormDialog } from "@/components/dashboard/dialog/categoryFormDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CategoriesPage() {
  const { categories, isLoading, deleteCategory } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Tables<"categories"> | null>(null);

  const handleEdit = (category: Tables<"categories">) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
            <p className="text-muted-foreground">
              Adicione, edite ou remova suas categorias de gastos.
            </p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Categorias</CardTitle>
            {!isLoading && (
              <CardDescription>
                {categories?.length || 0} categoria(s) encontrada(s).
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.map((cat) => {
                  const IconComponent = cat.icon ? iconMap[cat.icon] : null;
                  const isGlobal = !cat.user_id;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        {IconComponent && (
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: cat.color || "#ccc" }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      {isGlobal && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Lock className="h-4 w-4 text-muted-foreground mx-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Esta é uma categoria padrão e não pode ser editada
                              ou deletada.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {!isGlobal && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(cat)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <ConfirmDialog
                              title="Tem certeza?"
                              description={`Isso irá deletar permanentemente a categoria "${cat.name}".`}
                              onConfirm={() => deleteCategory(cat.id)}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="gap-2 text-destructive cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" /> Deletar
                              </DropdownMenuItem>
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma categoria cadastrada.
              </p>
            )}
          </CardContent>
        </Card>

        <CategoryFormDialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingCategory={editingCategory}
        />
      </div>
    </TooltipProvider>
  );
}
