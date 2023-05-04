import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        primary: {
          bgGradient: "linear(to-r, red.400,pink.400)",
          color: "white",
          _hover: {
            bgGradient: "linear(to-r, red.500,pink.500)",
          },
        },
      },
    },
  },
});

export default theme;
