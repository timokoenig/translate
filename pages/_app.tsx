import theme from '@/theme'
import AppStoreProvider from '@/utils/store/app/app-provider'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <AppStoreProvider>
          <Component {...pageProps} />
        </AppStoreProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}
