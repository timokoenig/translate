import { useAppStore } from '@/utils/store/app/app-context'
import {
  Box,
  Button,
  Image,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import SupportButton from '../global/support-button'
import HeroHeadline from './hero-headline'

const HeroContainer = () => {
  const { setAuthenticated } = useAppStore()
  const onSignIn = async () => {
    const res = await signIn('github')
    if (res?.ok) {
      setAuthenticated(true)
    }
  }

  return (
    <SimpleGrid columns={2}>
      <VStack p={4}>
        <HeroHeadline />
        <Text pb={8} px={16} textAlign="center">
          Getting started is easy! Just sign in using your{' '}
          <Link href="https://github.com" isExternal textDecoration="underline">
            GitHub account
          </Link>
          , choose one of your{' '}
          <Link href="https://www.i18next.com" isExternal textDecoration="underline">
            i18next-powered
          </Link>{' '}
          projects, and begin translating right away. All your translations will be seamlessly
          committed directly to your repository.
        </Text>
        <Box pb={4}>
          <Button colorScheme="gray" leftIcon={<FaGithub />} onClick={onSignIn}>
            Sign In with GitHub
          </Button>
        </Box>
        <SupportButton />
      </VStack>
      <Image
        src={useColorModeValue('/browser-mockup-light.png', '/browser-mockup-dark.png')}
        alt="Translate Browser Mockup"
      />
    </SimpleGrid>
  )
}

export default HeroContainer
