import { Box } from '@chakra-ui/react'
import LoadingIndicator from './loading-indicator'

const LoadingIndicatorFull = () => (
  <Box w="full" h="full" pos="fixed" justifyContent="center" display="flex" alignItems="center">
    <LoadingIndicator />
  </Box>
)

export default LoadingIndicatorFull
