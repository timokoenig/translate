import { Box, Heading, Text, VStack } from '@chakra-ui/react'

const SettingsHeader = () => {
  return (
    <VStack gap={4} w="full" align="flex-start" py={8}>
      <Box>
        <Heading size="lg">Settings</Heading>
        <Text>Change app settings or user preferences</Text>
      </Box>
    </VStack>
  )
}

export default SettingsHeader
