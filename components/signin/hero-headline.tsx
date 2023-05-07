import { Heading, Link, VStack } from '@chakra-ui/react'

const HeroHeadline = () => (
  <VStack spacing={2} mb={8}>
    <Heading
      as={Link}
      fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
      textAlign="center"
      bgGradient="linear(to-r, red.400,pink.400)"
      bgClip="text"
      href="/"
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
)

export default HeroHeadline
