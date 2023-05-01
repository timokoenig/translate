import React, { ReactNode } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import Sidebar from "./sidebar";
import { useAppStore } from "@/utils/store/app-context";
import LoadingIndicator from "../global/loading-indicator";

const Layout = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAppStore();

  // Show loading indicator as long as we load the initial data
  if (isLoading) {
    return (
      <Box
        w="full"
        h="full"
        pos="fixed"
        justifyContent="center"
        display="flex"
        alignItems="center"
      >
        <LoadingIndicator />
      </Box>
    );
  }

  return (
    <VStack gap={0}>
      <Box width="full" minH="100vh" style={{ marginTop: "0px" }}>
        <Sidebar />
        <Box ml={{ base: 0, md: 72 }} pb={16}>
          {children}
        </Box>
      </Box>
    </VStack>
  );
};

export default Layout;
