import { useRepoStore } from "@/utils/store/repo/repo-context";
import { Button, Center, Box, Heading, Text, VStack } from "@chakra-ui/react";

const EmptyState = () => {
  const { setupRepository } = useRepoStore();

  const onConfirm = async () => {
    try {
      await setupRepository();
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <Box p={8}>
      <Center>
        <VStack gap={7} maxW={400}>
          <Heading>Set up repository</Heading>
          <Text textAlign="center">
            This is a new repository without a translation file. Continue to
            create all necessary files.
          </Text>
          <Button
            bgGradient="linear(to-r, red.400,pink.400)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, red.500,pink.500)",
            }}
            variant="solid"
            w="full"
            onClick={onConfirm}
          >
            Continue
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};

export default EmptyState;
