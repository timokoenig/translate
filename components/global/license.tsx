import { Center, Link, Text } from '@chakra-ui/react'

const License = () => (
  <Center>
    <Text fontSize={14}>
      MIT License © 2023
      {process.env.NEXT_PUBLIC_IMPRINT_URL ? ' - ' : null}
      {process.env.NEXT_PUBLIC_IMPRINT_URL ? <Link href="/imprint">Imprint</Link> : null}
    </Text>
  </Center>
)

export default License
