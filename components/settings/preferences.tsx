import useColorMode from '@/utils/color-mode'
import { Container, HStack, Heading, Switch, Text, VStack } from '@chakra-ui/react'

const Preferences = () => {
  const { toggleColorMode, newColorMode } = useColorMode()
  return (
    <Container py={8}>
      <VStack gap={4} alignItems="left">
        <Heading as="h2" size="md">
          Preferences
        </Heading>
        <HStack w="full">
          <Text flex={1}>Dark / Light Mode</Text>
          <Switch size="lg" onChange={toggleColorMode} isChecked={newColorMode == 'light'} />
        </HStack>
      </VStack>
    </Container>
  )
}

export default Preferences
