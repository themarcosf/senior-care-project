import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import Navbar from "@/components/Navbar/Navbar";

import "@/styles/globals.scss";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <>
      <Component {...pageProps} />
      {pathname !== "/" && <Navbar />}
    </>
  );
}

export default App; 