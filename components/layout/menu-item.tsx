import { Flex, Link } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  onClick: () => void;
  children: ReactNode;
};

const MenuItem = (props: Props) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      w="full"
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <Flex
        align="center"
        px="4"
        py="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.100",
          color: "gray.900",
        }}
      >
        {props.children}
      </Flex>
    </Link>
  );
};

export default MenuItem;
