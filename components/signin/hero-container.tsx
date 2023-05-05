import { useAppStore } from '@/utils/store/app/app-context'
import { Box, Button, Heading, Image, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import SupportButton from '../global/support-button'

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
        <VStack spacing={2} mb={8}>
          <Heading
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            textAlign="center"
            bgGradient="linear(to-r, red.400,pink.400)"
            bgClip="text"
          >
            Translate
          </Heading>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: 'xl', sm: '1xl', md: '2xl', lg: '3xl' }}
            textAlign="center"
          >
            Lightweight simple translation platform to manage your localizations
          </Heading>
        </VStack>
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
      <Image src="/browser-mockup.png" alt="Translate Browser Mockup" />
    </SimpleGrid>
  )
}

export default HeroContainer
