import { useAppStore } from '@/utils/store/app/app-context'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton, useColorModeValue } from '@chakra-ui/react'

const MobileHeader = () => {
  const { setMobileMenuOpen } = useAppStore()

  return (
    <Flex
      w="full"
      p={4}
      borderBottom="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      display={{ base: 'flex', md: 'none' }}
    >
      <Box flex={1} />
      <IconButton
        size="sm"
        aria-label="Close Menu"
        icon={<HamburgerIcon />}
        variant="ghost"
        onClick={async e => {
          e.preventDefault()
          setMobileMenuOpen(true)
        }}
      />
    </Flex>
  )
}

export default MobileHeader
