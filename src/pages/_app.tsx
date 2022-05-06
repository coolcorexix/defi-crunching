import "styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("has to run this first on the browser");
  }, []);
  if (typeof window === "undefined") {
    return null;
  }
  return <Component {...pageProps} />;
}

export default MyApp;
