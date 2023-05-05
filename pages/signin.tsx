import { NextPageContext } from "next";
import { VStack, Flex, Link, Box, Container } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import HeroContainer from "@/components/signin/hero-container";
import FeatureContainer from "@/components/signin/feature-container";
import Footer from "@/components/signin/footer";

const Signin = () => {
  return (
    <VStack gap={8}>
      <Flex width="full" padding={4}>
        <Box marginLeft="auto">
          <Link href="https://github.com/timokoenig/translate" target="_blank">
            <FaGithub size={34} />
          </Link>
        </Box>
      </Flex>
      <Container maxWidth="8xl">
        <VStack>
          <HeroContainer />
          <FeatureContainer />
          <Footer />
        </VStack>
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
