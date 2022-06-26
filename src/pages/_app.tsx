import "styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("has to run this first on the browser");
  }, []);
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        {...{
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }}
      />
    </>
  );
}

export default MyApp;
