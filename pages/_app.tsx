import React, { useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import { DEFAULT_THEME } from 'config/theme';
import { pageview } from 'utils/ga';
import { GlobalStyles } from 'styles/GlobalStyles';

const Layout = dynamic(() => import('config/layout'), {
  ssr: false,
});

const NextNprogress = dynamic(() => import('nextjs-progressbar'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) pageview(url);

      // change focus to top on every page change
      if (url.includes('#')) {
        let idPresent = url.split('#').pop();
        (document.querySelector(`#${idPresent}`) as HTMLElement).focus();
      } else {
        (
          document.querySelector('#top-of-site-pixel-anchor') as HTMLElement
        ).focus();
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  });

  return (
    <>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <Script
            strategy="afterInteractive"
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </>
      )}
      <Layout>
        <NextNprogress
          color={DEFAULT_THEME.tertiary}
          startPosition={0.3}
          stopDelayMs={100}
          height={3}
          options={{ easing: 'ease', speed: 300, showSpinner: false }}
        />
        <GlobalStyles />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
