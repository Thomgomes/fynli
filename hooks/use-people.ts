"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// 1. O tipo customizado 'Person' foi removido. Usaremos o tipo completo 'Tables<'people'>'.

const fetcher = async ([_key, userId]: [string, string]): Promise<Tables<'people'>[]> => {
  const { data, error } = await supabase
    .from('people')
    .select('*') // 2. Corrigido: Buscamos TODAS as colunas com '*'
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export function usePeople() {
  const { user } = useAuth();
  const key = user ? ['people', user.id] : null;

  // 3. Corrigido: Usamos o tipo completo Tables<'people'>[] aqui.
  const { data: people, error, isLoading, mutate } = useSWR<Tables<'people'>[]>(key, fetcher, {
    revalidateOnFocus: false,
  });
  
  const addPerson = async (values: { name: string; color: string }) => {
    if (!user) return;
    const payload: TablesInsert<'people'> = { ...values, user_id: user.id };
    const { error } = await supabase.from('people').insert(payload);
    if (error) { toast.error("Erro ao criar perfil", {description: error.message}); throw error; }
    toast.success("Perfil criado!");
    mutate();
  };

  const updatePerson = async (id: string, updates: TablesUpdate<'people'>) => {
    const { error } = await supabase.from('people').update(updates).eq('id', id);
    if (error) { toast.error("Erro ao atualizar perfil", {description: error.message}); throw error; }
    toast.success("Perfil atualizado!");
    mutate();
  };

  const deletePerson = async (id: string) => {
    const { error } = await supabase.from('people').delete().eq('id', id);
    if (error) { toast.error("Erro ao deletar perfil", {description: error.message}); throw error; }
    toast.success("Perfil deletado.");
    mutate();
  };

  return {
    people,
    isLoading,
    error,
    addPerson,
    updatePerson,
    deletePerson,
  };
}