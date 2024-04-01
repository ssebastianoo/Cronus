import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useStore } from '@/utils/store';
import Login from '@/components/Login';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--fh',
      `${window.innerHeight - 56}px`,
    );
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty(
        '--fh',
        `${window.innerHeight - 56}px`,
      );
    });

    async function login() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    }
    login();
  }, [setUser]);

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
