import { Button, HStack, Link, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const LOCAL_STORAGE_COOKIE_NOTICE = 'cookie-notice'

const CookieBanner = () => {
  const [cookieNoticeAccepted, setCookieNoticeAccepted] = useState<boolean>(true)
  const bgColor = useColorModeValue('gray.300', 'gray.700')
  const bgGradient = useColorModeValue(
    'linear(to-r, red.400,pink.400)',
    'linear(to-r, red.500,pink.500)'
  )
  const bgGradientHover = useColorModeValue(
    'linear(to-r, red.500,pink.500)',
    'linear(to-r, red.600,pink.600)'
  )

  const onAccept = () => {
    localStorage.setItem(LOCAL_STORAGE_COOKIE_NOTICE, 'true')
    setCookieNoticeAccepted(true)
  }

  useEffect(() => {
    setCookieNoticeAccepted(localStorage.getItem(LOCAL_STORAGE_COOKIE_NOTICE) == 'true')
  }, [])

  if (!process.env.NEXT_PUBLIC_IMPRINT_URL || cookieNoticeAccepted) return <></>

  return (
    <VStack
      w="350px"
      pos="fixed"
      left={4}
      bottom={4}
      padding={4}
      backgroundColor={bgColor}
      borderRadius={8}
      gap={2}
    >
      <Text>We use cookies to ensure you get the best experience with this service</Text>
      <HStack w="full">
        <Button
          w="full"
          variant="ghost"
          as={Link}
          href="/imprint"
          _hover={{ textDecoration: 'none', backgroundColor: 'gray.600' }}
        >
          Learn more
        </Button>
        <Button
          w="full"
          variant="solid"
          bgGradient={bgGradient}
          _hover={{
            bgGradient: bgGradientHover,
            textDecoration: 'none',
          }}
          color="white"
          onClick={onAccept}
        >
          Okay
        </Button>
      </HStack>
    </VStack>
  )
}

export default CookieBanner
