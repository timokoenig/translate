import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import AppStoreProvider from "@/utils/store/app/app-provider";
import theme from "@/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <AppStoreProvider>
          <Component {...pageProps} />
        </AppStoreProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
