import React from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    IconButton,
    useBreakpointValue,
    useColorModeValue,
  } from '@chakra-ui/react'
  import { FiMenu } from 'react-icons/fi'
//   import { Logo } from './Logo'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from 'next/router'


export default function Header() {
    const isDesktop = useBreakpointValue({ base: false, lg: true })
    const router = useRouter()

    return (
    <Box as="section" pb={{ base: '12', md: '24' }}>
      <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
    <Container py={{ base: '4', lg: '5' }}>
          <HStack spacing="10" justify="space-between">
            {/* <Logo /> */}
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {['Docs', 'Generate Poll'].map((item) => (
                    <Button key={item} onClick={() => router.push('/generatepoll')}>{item}</Button>
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
          </HStack>
        </Container>
      </Box>
    </Box>
        // // <div className={styles.header}>
        // // <div className={styles.hbutton}>
        // // <Link href="/">Docs</Link>
        // // </div>
        // // <div className={styles.hbutton}>
        // // <Link href="/">All Polls</Link>
        // // </div>
        // // <div className={styles.hbutton}>
        // // <Link href="/generatepoll">Generate Poll</Link>
        // // </div>
        // <ConnectButton />
        // // </div>
    )
}
