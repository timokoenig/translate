import { Center, Text } from '@chakra-ui/react'

const Footer = () => (
  <Center>
    <Text>
      Made with{' '}
      <Text as="span" color="red.400" display="inline">
        ♥
      </Text>{' '}
      for the community
    </Text>
  </Center>
)

export default Footer
