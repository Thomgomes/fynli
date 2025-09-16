"use server";

import { createClient } from "@supabase/supabase-js";

export async function deleteUnverifiedUser(email: string) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Variáveis de ambiente do Supabase não configuradas no servidor."
    );
  }
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email_confirmed_at")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.log(
        `Usuário com e-mail ${email} não encontrado para exclusão. Nenhum erro gerado.`
      );
      return { success: true };
    }

    if (user.email_confirmed_at) {
      console.log(
        `Tentativa de excluir usuário já verificado (${email}) foi bloqueada.`
      );
      return { success: true };
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    console.log(`Usuário não verificado (${email}) excluído com sucesso.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar usuário não verificado:", error);
    return {
      success: false,
      error: "Não foi possível processar o cancelamento.",
    };
  }
}
