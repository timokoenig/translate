import { Box, Spinner } from "@chakra-ui/react";

const LoadingIndicator = () => (
  <Box w="full" p={8} textAlign="center">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="pink.400"
      size="xl"
    />
  </Box>
);

export default LoadingIndicator;
