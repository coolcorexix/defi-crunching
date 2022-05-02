import "styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("has to run this first on the browser");
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
