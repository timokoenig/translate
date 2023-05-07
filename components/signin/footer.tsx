import { Center, Text, VStack } from '@chakra-ui/react'
import License from '../global/license'

const Footer = () => (
  <VStack>
    <Center>
      <Text>
        Made with{' '}
        <Text as="span" color="red.400" display="inline">
          ♥
        </Text>{' '}
        for the community
      </Text>
    </Center>
    <License />
  </VStack>
)

export default Footer
