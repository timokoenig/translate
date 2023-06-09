import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react'

const EmptyState = () => {
  const { setupRepository } = useRepoStore()

  const onConfirm = async () => {
    try {
      await setupRepository('en')
    } catch (err: unknown) {
      console.log(err)
    }
  }

  return (
    <Box p={8}>
      <Center>
        <VStack gap={7} maxW={400}>
          <Heading>Set up repository</Heading>
          <Text textAlign="center">
            This is a new repository without a translation file. Continue to create all necessary
            files.
          </Text>
          <Button variant="primary" w="full" onClick={onConfirm}>
            Continue
          </Button>
        </VStack>
      </Center>
    </Box>
  )
}

export default EmptyState
