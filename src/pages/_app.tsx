import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useStore } from '@/utils/store';
import Login from '@/components/Login';
import { supabase } from '@/utils/supabase';
import Header from '@/components/Header';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { Loader } from 'lucide-react';

export default function App({ Component, pageProps }: AppProps) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [loaded, setLoaded] = useState(false);
  const noAuthNeeded = ['PrivacyPolicy', 'NotFound'];

  console.log(Component.name);

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
      setLoaded(true);
    }
    login();
  }, [setUser]);

  return (
    <>
      <Analytics />
      <Head>
        <title>Cronus</title>
        <meta
          name='description'
          content='Track how much time you spend on projects with a simple minimalist dashboard'
        />
        <meta property='og:title' content='Cronus' />
        <meta
          property='og:description'
          content='Track how much time you spend on projects with a simple minimalist dashboard'
        />
        <meta property='og:image' content='/icon.png' />
        <meta property='og:url' content='https://cronus.lol' />
        <meta property='twitter:creator' content='@ssebastianoo' />
        <meta property='twitter:site' content='@ssebastianoo' />
        <link
          rel='apple-touch-icon'
          sizes='57x57'
          href='/icon/apple-icon-57x57.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='60x60'
          href='/icon/apple-icon-60x60.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='72x72'
          href='/icon/apple-icon-72x72.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href='/icon/apple-icon-76x76.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='114x114'
          href='/icon/apple-icon-114x114.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='/icon/apple-icon-120x120.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='144x144'
          href='/icon/apple-icon-144x144.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/icon/apple-icon-152x152.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icon/apple-icon-180x180.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/icon/android-icon-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='/icon/favicon-96x96.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icon/favicon-16x16.png'
        />
        <meta name='theme-color' content='#0a0a0a' />
      </Head>
      <Header />

      {loaded ? (
        user || noAuthNeeded.includes(Component.name) ? (
          <Component {...pageProps} />
        ) : (
          <Login />
        )
      ) : (
        <div className='w-full flex justify-center items-center h-[var(--fh)]'>
          <Loader size={30} className='animate-spin' />
        </div>
      )}
    </>
  );
}
