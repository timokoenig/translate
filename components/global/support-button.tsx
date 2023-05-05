import { Button, Image, Link } from '@chakra-ui/react'

type Props = {
  w?: string
}

const SupportButton = (props: Props) => {
  const kofiUsername = process.env.NEXT_PUBLIC_KOFI_USERNAME
  if (!kofiUsername) return null
  return (
    <Button
      as={Link}
      href={`https://ko-fi.com/${kofiUsername}`}
      target="_blank"
      bgGradient="linear(to-r, red.400,pink.400)"
      color="white"
      w={props.w ?? 'auto'}
      _hover={{
        bgGradient: 'linear(to-r, red.500,pink.500)',
        textDecoration: 'none',
      }}
    >
      <Image src="/kofi_s_logo_nolabel.svg" height="36px" alt="Support this project on ko-fi.com" />
      Support this project
    </Button>
  )
}

export default SupportButton
