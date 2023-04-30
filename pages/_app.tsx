import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import AppStoreProvider from "@/utils/store/app-provider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <AppStoreProvider>
          <Component {...pageProps} />
        </AppStoreProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
