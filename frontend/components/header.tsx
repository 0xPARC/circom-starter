import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Image,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { CustomConnect } from "./CustomConnectButton";

export default function Header() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(!checked);
    toggleColorMode();
  };

  const { colorMode, toggleColorMode } = useColorMode();

  let pages: string[] = ["Home", "Create Poll"];
  let paths: string[] = ["/", "/createpoll"];

  return (
    <Box as="section" pb={{ base: "12", md: "25" }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }} maxWidth="100%">
          <HStack justify="space-between">
            <HStack justify="space-between">
              <Flex justify="space-between" flex="1">
                <Box width={12} mr={5} mt={2}>
                  <Image src="/zkpoll_logo.png" />
                </Box>
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
              </Flex>
            </HStack>
            <HStack alignContent={"center"}>
              <Heading as="h1" size="lg">
                zkPoll
              </Heading>
            </HStack>
            <HStack verticalAlign={"top"}>
              <HStack ml={4} mr={4}>
                <CustomConnect />
              </HStack>
              <DarkModeSwitch
                style={{ marginRight: "2", marginTop: "0" }}
                checked={colorMode === "light"}
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
