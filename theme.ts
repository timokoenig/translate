import { StyleFunctionProps, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        primary: {
          bgGradient: (props: StyleFunctionProps) => {
            return props.colorMode === 'light'
              ? 'linear(to-r, red.400,pink.400)'
              : 'linear(to-r, red.500,pink.500)'
          },
          color: 'white',
          _hover: {
            bgGradient: (props: StyleFunctionProps) => {
              return props.colorMode === 'light'
                ? 'linear(to-r, red.500,pink.500)'
                : 'linear(to-r, red.600,pink.600)'
            },
          },
        },
      },
    },
  },
})

export default theme
