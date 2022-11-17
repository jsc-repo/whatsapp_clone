import { Button, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import React from "react";

const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={() => toggleColorMode()} pos="absolute" top="0" right="0">
      {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ToggleColorMode;
