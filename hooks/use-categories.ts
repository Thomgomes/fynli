"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// 1. REMOVEMOS O TIPO 'Category' customizado. Usaremos o tipo oficial 'Tables<'categories'>' diretamente.

const fetcher = async (userId: string): Promise<Tables<'categories'>[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*') // 2. CORRIGIDO: Buscamos TODAS as colunas com '*'
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error("SWR Fetcher Error (useCategories):", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export function useCategories() {
  const { user } = useAuth();
  const key = user ? `categories-${user.id}` : null;

  // 3. CORRIGIDO: Usamos o tipo completo Tables<'categories'>[] aqui.
  const { data: categories, error, isLoading, mutate: revalidate } = useSWR<Tables<'categories'>[]>(
    key, 
    () => fetcher(user!.id),
    {
      revalidateOnFocus: false,
    }
  );
  
  const addCategory = async (name: string, icon?: string) => {
    if (!user) return;
    const newCategoryPayload: TablesInsert<'categories'> = { name, icon: icon || 'ShoppingCart', user_id: user.id };
    const { error } = await supabase.from('categories').insert(newCategoryPayload);
    if (error) { toast.error("Erro ao criar categoria", {description: error.message}); throw error; }
    toast.success("Categoria criada com sucesso!");
    revalidate();
  };

  const updateCategory = async (id: string, updates: TablesUpdate<'categories'>) => {
    if (!user) return;
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) { toast.error("Erro ao atualizar categoria", {description: error.message}); throw error; }
    toast.success("Categoria atualizada!");
    revalidate();
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error("Erro ao deletar categoria", {description: error.message}); throw error; }
    toast.success("Categoria deletada.");
    revalidate();
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}