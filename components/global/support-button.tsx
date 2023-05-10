import { Button, Image, Link, useColorModeValue } from '@chakra-ui/react'

type Props = {
  w?: string
}

const SupportButton = (props: Props) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, red.400,pink.400)',
    'linear(to-r, red.500,pink.500)'
  )
  const bgGradientHover = useColorModeValue(
    'linear(to-r, red.500,pink.500)',
    'linear(to-r, red.600,pink.600)'
  )
  const kofiUsername = process.env.NEXT_PUBLIC_KOFI_USERNAME
  if (!kofiUsername) return null
  return (
    <Button
      as={Link}
      href={`https://ko-fi.com/${kofiUsername}`}
      target="_blank"
      bgGradient={bgGradient}
      color="white"
      w={props.w ?? 'auto'}
      _hover={{
        bgGradient: bgGradientHover,
        textDecoration: 'none',
      }}
    >
      <Image src="/kofi_s_logo_nolabel.svg" height="36px" alt="Support this project on ko-fi.com" />
      Support this project
    </Button>
  )
}

export default SupportButton
