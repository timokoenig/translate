import Layout from '@/components/layout'
import { useAppStore } from '@/utils/store/app/app-context'
import {
  Button,
  Center,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'

const Index = () => {
  const { setMobileMenuOpen } = useAppStore()
  return (
    <Layout>
      <Container as={SimpleGrid} maxW={'xl'} gap={10} mt={10}>
        <Stack gap={2}>
          <Heading
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            textAlign="center"
            bgGradient={useColorModeValue(
              'linear(to-r, red.400,pink.400)',
              'linear(to-r, red.500,pink.500)'
            )}
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
          <Center py={8}>
            <Button variant="solid" onClick={() => setMobileMenuOpen(true)}>
              Select Repository
            </Button>
          </Center>
        </Stack>
        <Center>
          <Text>
            Made with{' '}
            <Text as="span" color="red.400" display="inline">
              ♥
            </Text>{' '}
            for the community
          </Text>
        </Center>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: { destination: '/signin' },
    }
  }

  return { props: {} }
}

export default Index
