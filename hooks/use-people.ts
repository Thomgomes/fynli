"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// O fetcher agora busca perfis do usuário E perfis globais
const fetcher = async ([_key, userId]: [string, string]): Promise<Tables<'people'>[]> => {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`) // AQUI ESTÁ A MUDANÇA
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export function usePeople() {
  const { user } = useAuth();
  const key = user ? ['people', user.id] : null;

  const { data: people, error, isLoading, mutate } = useSWR<Tables<'people'>[]>(key, fetcher, {
    revalidateOnFocus: false,
  });
  
  // O resto do hook (add, update, delete) não muda,
  // pois ele só vai operar em perfis que o usuário criar.
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