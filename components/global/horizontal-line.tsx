import { Box, useColorModeValue } from '@chakra-ui/react'

const HorizontalLine = () => {
  return <Box backgroundColor={useColorModeValue('gray.200', 'gray.700')} w="full" h="1px" />
}

export default HorizontalLine
