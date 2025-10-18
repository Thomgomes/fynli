"use client";

import useSWR from "swr";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useMemo } from "react";

const fetcher = async (userId: string): Promise<Tables<"profiles"> | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("SWR Fetcher Error (useProfile):", error);
    throw new Error(error.message);
  }

  return data;
};

export function useProfile() {
  const { user } = useAuth();

  const key = user ? `profile-${user.id}` : null;

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR<Tables<"profiles"> | null>(
    key,
    () => (user ? fetcher(user.id) : null),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 2000,
    }
  );

  const updateProfile = useMemo(
    () => async (updates: TablesUpdate<"profiles">) => {
      if (!user) throw new Error("Usuário não autenticado.");

      const profileData: TablesInsert<"profiles"> = {
        ...updates,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "user_id" })
        .select()
        .single();

      if (profileError) {
        toast.error("Erro ao atualizar o perfil na tabela.", {
          description: profileError.message,
        });
        throw profileError;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: updates.display_name },
      });

      if (authError) {
        toast.error("Erro ao atualizar metadados do usuário.", {
          description: authError.message,
        });
        throw authError;
      }

      await mutate(updatedProfile, { revalidate: false });

      toast.success("Perfil atualizado com sucesso!");
    },
    [user, mutate]
  );

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
