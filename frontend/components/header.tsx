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
  Image
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
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
        <Container py={{ base: "4", lg: "5" }} marginLeft={0}>
          <HStack justify="space-between" style={{'width': '300%'}}>
          <Image src='https://i.imgur.com/tfKjK4c.png' width={24} h={6} alt="ZKPoll"/>
          {/* <img src={require(logo).def} width={20} alt="ZKPoll"/> */}
          <HStack justify="space-between">
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
                <HStack ml={4} mr={4}>
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
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
