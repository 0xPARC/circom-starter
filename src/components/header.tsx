import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
//   import { Logo } from './Logo'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function Header() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(!checked);
    toggleColorMode();
  };

  const { colorMode, toggleColorMode } = useColorMode()

  let pages: string[] = ["Home", "Generate Poll"];
  let paths: string[] = ["/", "/generatepoll"];

  return (
    <Box as="section" pb={{ base: "12", md: "25" }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }}>
          <HStack spacing="10" justify="space-between">
            {/* <Logo /> */}
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {[0, 1].map((pageIndex) => (
                    <Button
                      key={pageIndex}
                      onClick={() => router.push(paths[pageIndex])}
                    >
                      {pages[pageIndex]}
                    </Button>
                  ))}
                </ButtonGroup>
                <HStack spacing="3">
                  <ConnectButton />
                </HStack>
              </Flex>
            ) : (
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
                <DarkModeSwitch
                  style={{ marginRight: '2' }}
                  checked={colorMode === 'light'}
                  onChange={toggleDarkMode}
                  size={30}
                  sunColor="white"
                  moonColor="black"
                />
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
