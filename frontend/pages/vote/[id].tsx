import * as React from 'react'
import styled from 'styled-components'
import Header from '../../components/header'
import {
  Card,
  Button,
  Text,
  Grid,
  GridItem,
  Center,
  Input,
  Box,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { getAccount } from '@wagmi/core'
import { generateProof } from '../../components/generateProof'
import { castVote } from '../../components/castVote'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  useContract,
  useWaitForTransaction,
  useSigner,
  useContractRead,
} from 'wagmi'
import testABI from '../../components/abi/test.json'
import { Progress } from '@chakra-ui/react'
import styles from '../../styles/Home.module.css'
import { BsFillPeopleFill } from 'react-icons/bs'

interface IPoll {
  title: string
  author: string
  groupDescription: string
  description: string
  votes: number
  id: number
  createdAt: number
  deadline: number
  active: boolean
}

const account = getAccount()
const SEMAPHORE_CONTRACT = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT

function PollDisplay() {
  const [publicKey, setPublicKey] = useState<string>('')
  const [privateKey, setPrivateKey] = useState<string>('')
  const [yesSelected, setYesSelected] = useState(false)
  const [noSelected, setNoSelected] = useState(false)
  const [proofForTx, setProofForTx] = useState<string[]>([])
  const [nullifierHash, setNullifierHash] = useState<string>('')
  const [proofResponse, setProofResponse] = useState<string>('')
  const [loadingProof, setLoadingProof] = useState<boolean>(false)
  const [loadingSubmitVote, setLoadingSubmitVote] = useState<boolean>(false)
  const [yesVoteCount, setYesVoteCount] = useState<number>(0)
  const [noVoteCount, setNoVoteCount] = useState<number>(0)
  const [txHash, setTxHash] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()
  const router = useRouter()
  const { id } = router.query
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: `0x${txHash}`,
  })
  const [invalidKey, setInvalidKey] = useState<boolean>(false)
  const Wallet = require('ethereumjs-wallet')

  const {
    data: resultData,
    isError: isResultError,
    isLoading: isResultLoading,
  } = useContractRead({
    address: SEMAPHORE_CONTRACT,
    abi: testABI,
    functionName: 'getPollState',
    args: [id],
  })
  console.log('RESULT DATA', resultData)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setYesSelected(e.currentTarget.textContent === 'Yes' ? true : false)
    setNoSelected(e.currentTarget.textContent === 'No' ? true : false)
  }

  const [poll, setPoll] = useState<IPoll>({
    id: -1,
    title: '',
    groupDescription: '',
    description: '',
    createdAt: 0,
    deadline: 0,
    active: false,
    author: '',
    votes: 1,
  })

  // const handleKeys = async (e: string) => {
  //   setPrivateKey(e);
  //   // "64d87dfbf242dcbe088049ec74643da3fdd428be8e26974a76e4624ce3532117"
  //   const pubKey = Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex')).getAddress().toString('hex');
  //   console.log("pubkey", pubKey);
  //   setPublicKey(pubKey);
  // }

  useEffect(() => {
    try {
      setPublicKey(
        `0x${Wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
          .getAddress()
          .toString('hex')}`,
      )
      setInvalidKey(false)
    } catch (e) {
      setInvalidKey(true)
    }
    if (resultData) {
      setYesVoteCount(Number((resultData as number[])[0]))
      console.log('yes votes', yesVoteCount)
      setNoVoteCount(Number((resultData as number[])[1]))
      console.log('no votes', noVoteCount)
    }
    if (!id) return
    const postData = async () => {
      const body = {
        data: {
          id,
        },
      }
      // console.log("GOT INTO POST DATA", body);
      const response = await fetch('/api/getPoll', {
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => res.json())
      console.log(response)
      setPoll(response)
    }
    postData()
  }, [id, resultData, privateKey])

  const handleGenProof = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      // 1: Vote yes, 1: Poll ID
      setLoadingProof(true)
      // Hardcode these differently depending on pollID
      const response = await generateProof(
        `0x${privateKey}`,
        publicKey,
        yesSelected ? 1 : 0,
        Number(id),
      )
      const msgResponse = response[0]
      const proofForTx = response[1]
      const nullifierHash = response[2]

      // TOAST HANDLING
      if (msgResponse === '') {
        setProofForTx(proofForTx)
        setNullifierHash(nullifierHash)
        toast({
          title: 'Proof generated!',
          description: 'Find proof in console.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: '700px',
            maxWidth: '90%',
          },
        })
        console.log('Proof Details: ', proofForTx)
        setProofResponse(proofForTx)
      } else {
        toast({
          title: 'Failed to generate proof!',
          description: msgResponse,
          status: 'error',
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: '700px',
            maxWidth: '90%',
          },
        })
      }

      setLoadingProof(false)
      console.log('SET TO THIS PROOF RESPONSE', proofResponse)
    }
  }

  const handleSubmitVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      setLoadingSubmitVote(true)
      const response = await castVote(
        nullifierHash,
        proofForTx,
        yesSelected ? 1 : 0,
        Number(id),
      )
      const success = response[3]
      const txHash = response[1]
      setTxHash(txHash)
      if (success) {
        toast({
          title: 'Vote casted!',
          description: txHash,
          status: 'success',
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: '700px',
            maxWidth: '90%',
          },
        })
      } else {
        // TODO: Add error checking if the transaction fails due to proof verifying incorrectly
        toast({
          title: 'Transaction failed: Cannot vote twice!',
          description: txHash,
          status: 'error',
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: '700px',
            maxWidth: '90%',
          },
        })
      }

      setLoadingSubmitVote(false)
      setProofResponse('')
    }
  }

  return (
    <Card variant={'elevated'} margin={8} minH="xs">
      <Grid
        templateAreas={`"header header"
                        "main nav"
                        "footer nav"
                        "extra extra"
                        "extra extra"
                        `}
        gridTemplateRows={'8% 2em 16% 90%'}
        gridTemplateColumns={'95% 2em '}
        // h='150%'
        gap="1"
        padding={4}
        marginTop={4}
        marginLeft={2}
        marginRight={6}
        mb={2}
      >
        <GridItem pl="2" area={'header'}>
          <Flex>
            <Text
              fontSize="xs"
              fontFamily={
                '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu'
              }
            >
              POLL ID {poll.id} | {poll.createdAt}
            </Text>
            <Spacer />
            {poll.active ? (
              <Button
                disabled={true}
                _disabled={{ backgroundColor: '#651fff' }}
                _hover={{ backgroundColor: '#651fff' }}
                size="xs"
                backgroundColor="#651fff"
                color={'white'}
              >
                Active
              </Button>
            ) : (
              <Button
                disabled={true}
                size="xs"
                _disabled={{ backgroundColor: '#651fff' }}
                _hover={{ backgroundColor: '#651fff' }}
                backgroundColor="#651fff"
                color={'white'}
                opacity={0.3}
              >
                Complete
              </Button>
            )}
          </Flex>
        </GridItem>
        <GridItem pl="2" area={'main'}>
          <Text fontSize="2xl" fontWeight="700">
            {poll.title}
          </Text>
        </GridItem>
        <GridItem pl="2" area={'footer'}>
          <Text>{poll.description}</Text>
          <HStack mt={2}>
            <BsFillPeopleFill />
            <Text fontSize="xs">{poll.groupDescription}</Text>
          </HStack>
        </GridItem>

        <GridItem pl="2" area={'extra'} mt={4}>
          {yesVoteCount + noVoteCount > 0 ? (
            <>
              <Progress
                colorScheme={'green'}
                background={'red'}
                height="10px"
                rounded={'xl'}
                mb={'1%'}
                value={(100 * yesVoteCount) / (yesVoteCount + noVoteCount)}
              />
              <Text
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
              >
                Yes: {yesVoteCount} No: {noVoteCount}
              </Text>
            </>
          ) : null}
          <Spacer margin={6} />
          <Spacer />
          <Input
            mr={4}
            mb={6}
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            focusBorderColor={'#C4A7FF'}
          />
          <Center>
            <Flex>
              <Button
                size="md"
                variant="outline"
                isActive={yesSelected}
                colorScheme="green"
                mr={4}
                onClick={handleClick}
              >
                Yes
              </Button>
              <Button
                size="md"
                variant="outline"
                isActive={noSelected}
                colorScheme="red"
                onClick={handleClick}
              >
                No
              </Button>
              <Button
                ml={4}
                disabled={
                  account &&
                  (yesSelected || noSelected) &&
                  proofResponse == '' &&
                  !invalidKey
                    ? false
                    : true
                }
                onClick={handleGenProof}
                loadingText="Generating Proof"
                isLoading={loadingProof}
                colorScheme="teal"
                variant="outline"
              >
                Generate Proof
              </Button>
              <Button
                ml={4}
                disabled={
                  account && proofResponse && !invalidKey ? false : true
                }
                onClick={handleSubmitVote}
                loadingText="Submitting Vote"
                isLoading={loadingSubmitVote}
                colorScheme="teal"
                variant="outline"
              >
                Submit Vote
              </Button>
            </Flex>
          </Center>
          {proofResponse == '' ? null : (
            <>
              <Text onClick={onOpen} fontSize="xs" mt={2} textAlign={'center'}>
                ↗ Inspect ZK Proof
              </Text>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Modal Title</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>{proofResponse}</ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button variant="ghost">Secondary Action</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
          <Spacer />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default function GeneratePoll() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <PollDisplay />
        </main>
      </div>
    </>
  )
}
