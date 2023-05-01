import React from "react";
import Layout from "@/components/layout";
import {
  Container,
  SimpleGrid,
  Heading,
  Stack,
  Center,
  Text,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";

const Index = () => {
  return (
    <Layout>
      <Container as={SimpleGrid} maxW={"xl"} spacing={10} mt={10}>
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
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/signin" },
    };
  }

  return { props: {} };
}

export default Index;
