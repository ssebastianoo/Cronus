import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
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
  }, []);

  return <Component {...pageProps} />;
}
