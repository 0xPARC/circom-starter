import * as React from "react";
import styled from "styled-components";
import { BsFillPeopleFill } from "react-icons/bs";
import Header from "../../components/header";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Text,
  Grid,
  GridItem,
  Center,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { getAccount } from "@wagmi/core";
import { generateProof } from "../../components/generateProof";
import { castVote } from "../../components/castVote";
import { useToast } from "@chakra-ui/react";

interface IPoll {
  title: string;
  author: string;
  gdes: string;
  des: string;
  votes: number;
  id: number;
  createdAt: number;
  deadline: number;
}

const examplePoll: IPoll = {
  title: "Does pineapple belong on pizza?",
  author: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  gdes: "A group for all pizza lovers",
  des: "A decade long debate, Pineapple on pizza remains a contentious. ",
  votes: 10,
  id: 1,
  createdAt: 40234850,
  deadline: 12345678,
};
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
  const toast = useToast();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setYesSelected(e.currentTarget.textContent === "Yes" ? true : false);
    setNoSelected(e.currentTarget.textContent === "No" ? true : false);
  };

  const handleGenProof = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      // 1: Vote yes, 1: Poll ID
      setLoadingProof(true);
      // Hardcode these differently depending on pollID
      const response = await generateProof(
        privateKey,
        publicKey as `0x${string}`,
        1,
        1
      );
      const proofForTx = response[0];
      const nullifierHash = response[1];
      setProofForTx(proofForTx);
      setNullifierHash(nullifierHash);
      toast({
        title: "Proof generated!",
        description: proofForTx,
        status: "success",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: "700px",
          maxWidth: "90%",
        },
      });
      setLoadingProof(false);
    }
  };

  const handleSubmitVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      setLoadingSubmitVote(true);
      const response = await castVote(nullifierHash, proofForTx, 1, 1);
      const txHash = response[1];
      setTxHash(txHash);
      toast({
        title: "Vote casted!",
        description: txHash,
        status: "success",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: "700px",
          maxWidth: "90%",
        },
      });
      // if (!isError) {
      //   toast({
      //     title: "Poll created",
      //     description: tx.hash,
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //     containerStyle: {
      //       width: '700px',
      //       maxWidth: '90%',
      //     },
      //   });
      // } else {
      //   toast({
      //     title: "Transaction failed",
      //     description: tx.hash,
      //     status: "error",
      //     duration: 5000,
      //     isClosable: true,
      //     containerStyle: {
      //       width: '700px',
      //       maxWidth: '90%',
      //     },
      //   });
      // }
      // setSubmitVoteResponse("Vote submitted! Tx below")
      setLoadingSubmitVote(false);
    }
  };

  return (
    <Card backgroundColor={"#f4f4f8"} variant={"elevated"} margin={8}>
      <Grid
        templateAreas={`"header header"
                        "main nav"
                        "footer nav"
                        "extra extra"
                        "extra extra"
                        `}
        gridTemplateRows={"18% 2em 20% 9em"}
        gridTemplateColumns={"95% 2em "}
        // h='150%'
        gap="1"
        color="#242124"
        padding={4}
        margin={2}
        marginLeft={0}
      >
        <GridItem pl="2" area={"header"}>
          <Flex>
            <Text
              fontSize="xs"
              color={"#666666"}
              fontFamily={
                '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu'
              }
            >
              POSTED {poll.createdAt} | POLL ID {poll.id}
            </Text>
            <Spacer />
            <Button size="xs" colorScheme="green">
              Active
            </Button>
          </Flex>
        </GridItem>
        <GridItem pl="2" area={"main"}>
          <Text fontSize="2xl" fontWeight="700">
            {poll.title}
          </Text>
        </GridItem>
        <GridItem pl="2" area={"footer"}>
          <Text>{poll.des}</Text>
          <Text fontSize="xs">{poll.gdes}</Text>
        </GridItem>
        <GridItem pl="2" area={"nav"} marginTop={2}>
          <BsFillPeopleFill color="black" />
          {poll.votes}
        </GridItem>
        <GridItem pl="2" area={"extra"}>
          <Input
            mr={4}
            mb={5}
            placeholder="Public Key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
          <Spacer />

          <Input
            mr={4}
            mb={5}
            placeholder="Burner Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          {/* <Center>
            <Flex>
             
            </Flex>
          </Center> */}
          <Spacer />
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
                mb={10}
                ml={4}
                disabled={account && proofResponse == "" ? false : true}
                onClick={handleGenProof}
                loadingText="Generating Proof"
                isLoading={loadingProof}
                colorScheme="teal"
                variant="outline"
              >
                Generate Proof
              </Button>
              <Button
                mb={10}
                ml={4}
                disabled={account && proofResponse ? false : true}
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
          <Spacer />
          <Center></Center>
          <Center></Center>
        </GridItem>
      </Grid>
    </Card>
  );
}

const StyledDiv = styled.div`
  transition: all 0.1s ease-in-out;
  border-radius: 8px;
  border: 1px solid #eaeaea;

  &:hover {
    border-color: #0d76fc;
  }
`;

export default function GeneratePoll() {
  return (
    <div>
      <Header />
      <Center>
        <StyledDiv>
          <PollDisplay poll={examplePoll} />
        </StyledDiv>
      </Center>
    </div>
  );
}
