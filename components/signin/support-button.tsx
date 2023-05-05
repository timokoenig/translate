import { Button, Link, Image } from "@chakra-ui/react";

const SupportButton = () => (
  <Button
    as={Link}
    href="https://ko-fi.com/timokoenig"
    target="_blank"
    bgGradient="linear(to-r, red.400,pink.400)"
    color="white"
    _hover={{
      bgGradient: "linear(to-r, red.500,pink.500)",
      textDecoration: "none",
    }}
  >
    <Image
      src="/kofi_s_logo_nolabel.svg"
      height="36px"
      alt="Support this project on ko-fi.com"
    />
    Support this project
  </Button>
);

export default SupportButton;
