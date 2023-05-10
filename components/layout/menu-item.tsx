import { Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
  onClick: () => void
  isActive: boolean
  children: ReactNode
}

const MenuItem = (props: Props) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="full"
      onClick={e => {
        e.preventDefault()
        props.onClick()
      }}
    >
      <Flex
        align="center"
        px="4"
        py="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.700'),
          color: useColorModeValue('gray.900', 'gray.100'),
        }}
        bg={useColorModeValue(
          props.isActive ? 'gray.100' : 'transparent',
          props.isActive ? 'gray.800' : 'transparent'
        )}
      >
        {props.children}
      </Flex>
    </Link>
  )
}

export default MenuItem
