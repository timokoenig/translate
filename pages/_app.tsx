import CookieBanner from '@/components/global/cookie-banner'
import theme from '@/theme'
import AppStoreProvider from '@/utils/store/app/app-provider'
import SettingsStoreProvider from '@/utils/store/settings/settings-provider'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/system'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <SettingsStoreProvider>
          <AppStoreProvider>
            <Component {...pageProps} />
            <CookieBanner />
          </AppStoreProvider>
        </SettingsStoreProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}
