import { NextPageContext } from "next";
import {
  Stack,
  Heading,
  Button,
  Container,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  Link,
  Box,
  Center,
} from "@chakra-ui/react";
import { signIn, getSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useAppStore } from "@/utils/store/app/app-context";

const Signin = () => {
  const { setAuthenticated } = useAppStore();
  const onSignIn = async () => {
    const res = await signIn("github");
    if (res?.ok) {
      setAuthenticated(true);
    }
  };

  return (
    <VStack gap={10}>
      <Flex width="full" padding={4}>
        <Box marginLeft="auto">
          <Link href="https://github.com/timokoenig/translate" target="_blank">
            <FaGithub size={34} />
          </Link>
        </Box>
      </Flex>
      <Container as={SimpleGrid} maxW={"xl"} spacing={10}>
        <Stack spacing={2}>
          <Heading
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            textAlign="center"
            bgGradient="linear(to-r, red.400,pink.400)"
            bgClip="text"
          >
            Translate
          </Heading>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "xl", sm: "1xl", md: "2xl", lg: "3xl" }}
            textAlign="center"
          >
            Lightweight simple translation platform to manage your localizations
          </Heading>
        </Stack>
        <Button colorScheme="gray" leftIcon={<FaGithub />} onClick={onSignIn}>
          Sign In with GitHub
        </Button>
        <Center>
          <Text>
            Made with{" "}
            <Text as="span" color="red.400" display="inline">
              ♥
            </Text>{" "}
            for the community
          </Text>
        </Center>
      </Container>
    </VStack>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return { props: {} };
}

export default Signin;
