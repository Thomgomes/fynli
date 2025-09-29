"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";
import { usePeople } from "@/hooks/use-people"; 
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PersonFormDialog } from "@/components/dashboard/dialog/peopleFormDialog"; 

export default function PeoplePage() {
  const { people, isLoading, deletePerson } = usePeople();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Tables<'people'> | null>(null);

  const handleEdit = (person: Tables<'people'>) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };
  
  const handleNew = () => {
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Perfis (Pessoas)</h1>
          <p className="text-muted-foreground">Adicione, edite ou remova os perfis de gastos.</p>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Novo Perfil
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Perfis</CardTitle>
          {!isLoading && <CardDescription>{people?.length || 0} perfil(s) encontrado(s).</CardDescription>}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : people && people.length > 0 ? (
            <div className="space-y-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full" style={{ backgroundColor: person.color || '#ccc' }} />
                    <span className="font-medium">{person.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(person)} className="gap-2 cursor-pointer"><Edit className="h-4 w-4" /> Editar</DropdownMenuItem>
                      <ConfirmDialog
                        title="Tem certeza que deseja deletar?"
                        description={`Esta ação não pode ser desfeita. Isso irá deletar permanentemente o perfil "${person.name}".`}
                        onConfirm={() => deletePerson(person.id)}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                      </ConfirmDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum perfil cadastrado. Adicione seu primeiro!</p>
          )}
        </CardContent>
      </Card>

      <PersonFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingPerson={editingPerson}
        onSuccess={() => setEditingPerson(null)} // Limpa o estado de edição ao fechar
      />
    </div>
  );
}