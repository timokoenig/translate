import { Box, Spinner, useColorModeValue } from '@chakra-ui/react'

const LoadingIndicator = () => (
  <Box w="full" p={8} textAlign="center">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor={useColorModeValue('gray.200', 'gray.700')}
      color={useColorModeValue('pink.400', 'pink.500')}
      size="xl"
    />
  </Box>
)

export default LoadingIndicator
