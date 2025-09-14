"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  Session,
  AuthError,
  AuthResponse,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  signUpWithPassword: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<{ error: AuthError | null }>;
  verifyOtp: (
    params: VerifyOtpParams
  ) => Promise<{ session: Session | null; error: AuthError | null }>;
  refreshSession: () => Promise<void>;
  sendPasswordResetOtp: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    isLoading,

    signInWithPassword: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),

    signUpWithPassword: (email: string, password: string) =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      }),

    signInWithGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      if (error) console.error("Erro no login com Google:", error);
    },

    sendPasswordResetOtp: async (email: string) => {
      return supabase.auth.resetPasswordForEmail(email);
    },

    signOut: async () => {
      const result = await supabase.auth.signOut();
      router.push("/");
      return result;
    },

    verifyOtp: async (params: VerifyOtpParams) => {
      const { data, error } = await supabase.auth.verifyOtp(params);
      return { session: data.session, error };
    },

    refreshSession: async () => {
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
    },

    updatePassword: async (password: string) => {
      return supabase.auth.updateUser({ password });
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
