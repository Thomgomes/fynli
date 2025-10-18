"use client";

import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// O fetcher que busca o perfil na nossa tabela 'profiles'
const fetcher = async (userId: string): Promise<Tables<'profiles'> | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("SWR Fetcher Error (useProfile):", error);
    throw new Error(error.message);
  }
  
  return data;
};

export function useProfile() {
  const { user } = useAuth();
  
  const key = user ? ['profile', user.id] : null;

  const { data: profile, error, isLoading, mutate } = useSWR<Tables<'profiles'> | null>(key, fetcher, {
    revalidateOnFocus: false, // Isto impede o pisca-pisca ao trocar de aba
  });

  // 1. A função de update agora espera o tipo correto
  const updateProfile = async (updates: TablesUpdate<'profiles'>) => {
    if (!user) throw new Error("Usuário não autenticado.");

    const profileData: TablesInsert<'profiles'> = {
      ...updates,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    // 2. Usamos 'upsert' para garantir que funcione para usuários novos e antigos
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single(); // Pedimos ao Supabase para nos retornar o dado salvo

    if (profileError) {
      toast.error("Erro ao atualizar o perfil na tabela.", { description: profileError.message });
      throw profileError;
    }

    // 3. Atualizamos os metadados de autenticação, como você pediu
    const { error: authError } = await supabase.auth.updateUser({
      data: { display_name: updates.display_name }
    });
    
    if (authError) {
      toast.error("Erro ao atualizar metadados do usuário.", { description: authError.message });
      throw authError;
    }

    // 4. A CORREÇÃO DO PISCA-PISCA
    // Em vez de mutate(), atualizamos o cache local da SWR com os dados que acabamos de salvar.
    // O 'false' no final significa: "Não faça uma nova busca, confie nestes dados."
    mutate(updatedProfile, false);

    toast.success("Perfil atualizado com sucesso!");
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}