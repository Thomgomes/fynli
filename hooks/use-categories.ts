"use client";

import useSWR  from 'swr';
import { supabase } from '@/integrations/supabase/client';

import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const fetcher = async (userId: string): Promise<Tables<'categories'>[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error("SWR Fetcher Error:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

export function useCategories() {
  const { user } = useAuth();
  const key = user ? user.id : null;

  const { data: categories, error, isLoading, mutate: revalidate } = useSWR<Tables<'categories'>[]>(
    key, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const addCategory = async (name: string, icon: string) => {
    if (!user || !key) return;
    
    // --- INÍCIO DA CORREÇÃO ---
    // Adicionamos a tipagem explícita aqui para garantir que o objeto tenha a forma correta
    const newCategoryOptimistic: Tables<'categories'> = {
      id: `temp-${Math.random()}`, // ID temporário
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id,
      name,
      icon,
    };
    // --- FIM DA CORREÇÃO ---

    await revalidate((currentData = []) => [...currentData, newCategoryOptimistic], false);

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert({ name, icon, user_id: user.id } as TablesInsert<'categories'>)
      .select()
      .single();

    if (error) {
      toast.error("Erro ao criar categoria", { description: error.message });
      await revalidate(categories, false); // Reverte a UI em caso de erro
      throw error;
    }
    
    toast.success("Categoria criada com sucesso!");
    await revalidate(); // Revalida para pegar os dados corretos do banco (incluindo o ID real)
  };
  
  const updateCategory = async (id: string, updates: TablesUpdate<'categories'>) => {
    if (!key) return;
    await revalidate(categories?.map(c => c.id === id ? { ...c, ...updates } : c), false);

    const { error } = await supabase.from('categories').update(updates).eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar categoria", { description: error.message });
      await revalidate(categories, false);
      throw error;
    }

    toast.success("Categoria atualizada!");
    await revalidate();
  };

  const deleteCategory = async (id: string) => {
    if (!key) return;
    await revalidate(categories?.filter(c => c.id !== id), false);

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      toast.error("Erro ao deletar categoria", { description: error.message });
      await revalidate(categories, false);
      throw error;
    }
    
    toast.success("Categoria deletada.");
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