import { Heading, Link, VStack } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/system'
import NextLink from 'next/link'

const HeroHeadline = () => {
  return (
    <VStack gap={2} mb={8}>
      <Link
        as={NextLink}
        href="/"
        _hover={{ textDecoration: 'none' }}
      >
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
      </Link>
      <Heading
        lineHeight={1.1}
        fontSize={{ base: 'xl', sm: '1xl', md: '2xl', lg: '3xl' }}
        textAlign="center"
      >
        Lightweight simple translation platform to manage your localizations
      </Heading>
    </VStack>
  )
}

export default HeroHeadline
