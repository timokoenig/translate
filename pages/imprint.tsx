import HeroHeadline from '@/components/signin/hero-headline'
import { Box, Container, Flex, Link, VStack } from '@chakra-ui/react'
import DOMPurify from 'isomorphic-dompurify'
import { FaGithub } from 'react-icons/fa'

type Props = {
  imprintHtml: string
}

const Imprint = (props: Props) => {
  return (
    <VStack gap={8}>
      <Flex width="full" padding={4}>
        <Box marginLeft="auto">
          <Link href="https://github.com/timokoenig/translate" target="_blank">
            <FaGithub size={34} />
          </Link>
        </Box>
      </Flex>
      <Container textAlign="center">
        <HeroHeadline />
        <Box className="imprint-html" dangerouslySetInnerHTML={{ __html: props.imprintHtml }} />
      </Container>
    </VStack>
  )
}

export async function getServerSideProps() {
  const url = process.env.NEXT_PUBLIC_IMPRINT_URL
  if (!url) {
    return {
      redirect: { destination: '/' },
    }
  }

  const res = await fetch(url)
  if (!res.ok) {
    return {
      redirect: { destination: '/' },
    }
  }
  const html = await res.text()
  const imprintHtml = DOMPurify.sanitize(html)

  return {
    props: {
      imprintHtml,
    },
  }
}

export default Imprint
