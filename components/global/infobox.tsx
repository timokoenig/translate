import { HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'

type Props = {
  text: string
}

const Infobox = (props: Props) => (
  <HStack
    gap={4}
    borderWidth={1}
    borderColor="orange"
    borderRadius={8}
    backgroundColor="orange.100"
    p={4}
  >
    <FiAlertTriangle size={48} color="orange" />
    <Text color={useColorModeValue('white', 'black')}>{props.text}</Text>
  </HStack>
)

export default Infobox
