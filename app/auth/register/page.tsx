'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { useCmsContent } from '@/hooks/useCmsContent';
import { COMPTE_DEFAULTS } from '@/lib/cms-defaults/compte';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, isConfigured } = useAuth();
  const c = useCmsContent('compte', COMPTE_DEFAULTS);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || !isConfigured) {
      setError(c.register_error_unavailable);
      return;
    }

    if (password.length < 8) {
      setError(c.register_error_short_password);
      return;
    }

    if (password !== confirmPassword) {
      setError(c.register_error_mismatch);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    if (data.session) {
      router.replace('/dashboard');
      return;
    }

    setSuccess(c.register_success);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-cloud-dancer">
      <Header />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <p className="text-xs tracking-[0.16em] uppercase text-eucalyptus mb-3">{c.get('compte_badge')}</p>
          <h1 className="text-3xl font-serif text-mahogany mb-2">{c.get('register_title')}</h1>
          <p className="text-stone-600 mb-8">
            {c.get('register_subtitle', undefined, { multiline: true })}
          </p>

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
              {c.get('login_not_configured')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-stone-700 mb-1.5">{c.get('login_email_label')}</label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={c.login_email_placeholder}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eucalyptus/30 focus:border-eucalyptus"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-stone-700 mb-1.5">{c.get('login_password_label')}</label>
              <input
                id="register-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={c.register_password_placeholder}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eucalyptus/30 focus:border-eucalyptus"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-stone-700 mb-1.5">{c.get('register_confirm_label')}</label>
              <input
                id="register-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={c.register_confirm_placeholder}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-eucalyptus/30 focus:border-eucalyptus"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !isConfigured}
              className="w-full bg-eucalyptus text-white font-medium py-3 rounded-lg hover:bg-eucalyptus/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? c.register_submitting : c.register_submit}
            </button>
          </form>

          <p className="text-sm text-stone-600 mt-6">
            {c.get('register_have_account')}{' '}
            <Link href="/auth/login" className="text-mahogany font-semibold hover:underline">
              {c.get('register_login_link')}
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
