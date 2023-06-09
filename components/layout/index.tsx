import { useAppStore } from '@/utils/store/app/app-context'
import { Box, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import CookieBanner from '../global/cookie-banner'
import LoadingIndicatorFull from '../global/loading-indicator-full'
import MobileHeader from './mobile-header'
import Sidebar from './sidebar'

const Layout = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAppStore()

  // Show loading indicator as long as we load the initial data
  if (isLoading) {
    return <LoadingIndicatorFull />
  }

  return (
    <VStack gap={0}>
      <Box width="full" minH="100vh" style={{ marginTop: '0px' }}>
        <Sidebar />
        <MobileHeader />
        <Box ml={{ base: 0, md: 72 }} pb={16}>
          {children}
        </Box>
      </Box>
      <CookieBanner />
    </VStack>
  )
}

export default Layout
