'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error === 'access_denied') {
      

      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div>
      <h1>Meu Dashboard</h1>
      <p>Bem-vindo ao Fynli!</p>
    </div>
  );
}