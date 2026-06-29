'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TemoignagesPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/coaching'); }, [router]);
  return null;
}
