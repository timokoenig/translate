import React from "react";
import {
  Button,
  Flex,
  useColorModeValue,
  Link,
  Avatar,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const bottomBarColor = useColorModeValue("gray.200", "gray.700");
  const { data: session, status } = useSession();

  if (status == "loading" || !session?.user) return null;

  return (
    <Flex
      width="full"
      padding={4}
      pos="fixed"
      backgroundColor="white"
      zIndex="1"
      borderBottom="1px"
      borderBottomColor={bottomBarColor}
    >
      <Flex w="full">
        <HStack flex={1}>
          <Avatar
            size="sm"
            name={session.user.name ?? undefined}
            src={session.user.image ?? undefined}
            mr={2}
          />
          <Heading as="h2" size="md">
            {session.user.name}
          </Heading>
        </HStack>
        <HStack mr={5}>
          <Button
            colorScheme="red"
            color="red.400"
            variant="ghost"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </HStack>
        <HStack>
          <Link href="https://github.com/timokoenig/translate" target="_blank">
            <FaGithub size={34} />
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Header;
