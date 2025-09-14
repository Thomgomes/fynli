'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';


export default function LoginPage() {
  async function handleLoginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">Bem-vindo ao Fynli</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLoginWithGoogle} className="w-full">
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}