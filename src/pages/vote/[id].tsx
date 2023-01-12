import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import * as React from 'react'
import styles from '../../styles/Home.module.css'
import styled from 'styled-components'
import { BsFillPeopleFill } from 'react-icons/bs'
import Header from '../../components/header'
import { Card, CardHeader, CardBody, CardFooter, Heading, Button, Text, Grid, GridItem, Center, Input, Textarea } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { useState } from 'react'
import { getAccount } from "@wagmi/core";
import { generateProof } from '../../components/generateProof'
import { castVote } from '../../components/castVote'


interface IPoll {
  title: string
  author: string
  gdes: string
  des: string
  votes: number
  id: number
  createdAt: number
  deadline: number
}

const examplePoll: IPoll = {
  title: 'Does pineapple belong on pizza?',
  author: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  gdes: 'A group for all pizza lovers',
  des: 'A decade long debate, Pineapple on pizza remains a contentious. ',
  votes: 10,
  id: 1,
  createdAt: 40234850,
  deadline: 12345678,
}
const account = getAccount();
console.log("ACCCOUNT");
console.log(account.address);

function PollDisplay({ poll }: { poll: IPoll }) {

  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [yesSelected, setYesSelected] = useState(false);
  const [noSelected, setNoSelected] = useState(false);
  const [proofForTx, setProofForTx] = useState<string[]>([]);
  const [nullifierHash, setNullifierHash] = useState<string>("");
  const [proofResponse, setProofResponse] = useState<string>("");
  const [loadingProof, setLoadingProof] = useState<boolean>(false);
  const [loadingSubmitVote, setLoadingSubmitVote] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [submitVoteResponse, setSubmitVoteResponse] = useState<string>("");






  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setYesSelected(e.currentTarget.textContent === "Yes" ? true : false);
    setNoSelected(e.currentTarget.textContent === "No" ? true : false);
  }

  const handleGenProof = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      // 1: Vote yes, 1: Poll ID
      setLoadingProof(true);
      // Hardcode these differently depending on pollID
      const response = await generateProof(privateKey, publicKey as `0x${string}`, 1, 1)
      const proofForTx = response[0];
      const nullifierHash = response[1];
      setProofForTx(proofForTx);
      setNullifierHash(nullifierHash);
      setProofResponse("Proof generated! Check console for proof")
      setLoadingProof(false);
      // console.log("Proof in frontend", proofForTx)
    }
  }

  const handleSubmitVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      // 1: Vote yes, 2: Poll ID
      setLoadingSubmitVote(true);
      const response = await castVote(nullifierHash, proofForTx, 1, 1)
      const txHash = response[1];
      setTxHash(txHash);
      setSubmitVoteResponse("Vote submitted! Tx below")
      // setProofResponse("Proof generated! Check console for proof")
      setLoadingSubmitVote(false);
      // console.log("Proof in frontend", proofForTx)
    }
  }


  return (
    <Card backgroundColor={'#f4f4f8'} variant={"elevated"} margin={8}>
    <Grid
        templateAreas={`"header header"
                        "main nav"
                        "footer nav"
                        "extra extra"
                        "extra extra"
                        `}
        gridTemplateRows={'18% 2em 20% 9em'}
        gridTemplateColumns={'95% 2em '}
        // h='150%'
        gap='1'
        color='#242124'
        padding={4}
        margin={2}
        marginLeft={0}
        >
        <GridItem pl='2' area={'header'} >
            <Flex>
            <Text fontSize='xs' color={'#666666'} fontFamily={'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu'}>POSTED {poll.createdAt} | POLL ID {poll.id}</Text> 
            <Spacer/>              
            <Button size='xs' colorScheme='green'>Active</Button>
            </Flex>
        </GridItem>
        <GridItem pl='2' area={'main'}>
            <Text fontSize='2xl' fontWeight='700'>{poll.title}</Text>
        </GridItem>
        <GridItem pl='2' area={'footer'}>
            <Text>{poll.des}</Text>
            <Text fontSize='xs'>{poll.gdes}</Text>
        </GridItem>
        <GridItem pl='2' area={'nav'} marginTop={2}>
            <BsFillPeopleFill color="black"/>
            {poll.votes}
        </GridItem>
        <GridItem pl='2' area={'extra'}>
        <Center>
          <Flex>
              <Input 
              mr={4} 
              placeholder='Enter your Public Key: '
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)} 
              />
            </Flex>
        </Center>
        <Spacer/>
        <Center>
            
            <Flex>
                <Input 
                mr={4} 
                placeholder='Enter your Private Key: '
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)} 
                />
                {/* <Button size='md' colorScheme='teal' variant="outline" mr={4}>Yes</Button>
                <Button size='md' colorScheme='red' variant="outline">No</Button> */}
                <Button size='md' variant="outline" isActive={yesSelected} colorScheme='green' mr={4} onClick={handleClick} >Yes</Button>
                <Button size='md' variant="outline" isActive={noSelected} colorScheme='red' onClick={handleClick} >No</Button>
            </Flex>
          </Center>
        <Spacer/>
        <Center>
          <Button mt={5}
            mb={10}
            disabled={(account && proofResponse=='')? false: true}
            onClick={handleGenProof}
            // onClick={account ? () => generateProof(privateKey, account.address as `0x${string}`, 1, poll.id) : () => {console.log("Generated Proof!")}}
            loadingText='Generating Proof'
            isLoading={loadingProof}
            colorScheme='teal'
            variant='outline'>Generate Proof</Button>
          <Button mt={5}
            mb={10}
            disabled={(account && proofResponse)? false: true}
            onClick={handleSubmitVote}
            // onClick={account ? () => generateProof(privateKey, account.address as `0x${string}`, 1, poll.id) : () => {console.log("Generated Proof!")}}
            loadingText='Submitting Vote'
            isLoading={loadingSubmitVote}
            colorScheme='teal'
            variant='outline'>Submit Vote</Button>
        </Center>

        <Center>
          <Flex>
              <Text mb='8px'>Proof: {proofResponse}</Text>
            </Flex>
        </Center>
        </GridItem>
    </Grid>
</Card>
  )
}

// export const getStaticPaths = async () => {
//     const res = await fetch('');
//     const data = await res.json();

//     const paths = data.map((poll: { id: any; }) => {
//         return {
//             params: { id: poll.id.toString() }
//         }
//     })

//     return {
//         paths,
//         fallback: false,
//     }
// }

// export const getStaticProps = async (context: { params: { id: any; }; }) => {
//     const id = context.params.id;
//     const res = await fetch('' + id);
//     const data = res.json();

//     return {
//         props: { poll: data }
//     }
// }

const StyledDiv = styled.div`
  transition: all 0.1s ease-in-out;
  border-radius: 8px;
  border: 1px solid #eaeaea;

  &:hover {
    border-color: #0d76fc;
  }
`;


export default function GeneratePoll() {
  const polls = [examplePoll, examplePoll, examplePoll]

  return (
    <div>
    <Header />
    <Center>
      <StyledDiv>
        <PollDisplay poll={examplePoll} />
      </StyledDiv>
    </Center>
    </div>

  )
}
