import React from "react";
import styled from "styled-components";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
import {
  Card,
  Button,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";

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

function PollDisplay({ poll }: { poll: IPoll }) {
  return (
    // <Header/>
    <Card
      backgroundColor={"#f4f4f8"}
      variant={"elevated"}
      margin={8}
      _hover={{ background: "white" }}
    >
      <Grid
        templateAreas={`"header header"
                                "main nav"
                                "footer nav"`}
        gridTemplateRows={"18% 2em 20%"}
        gridTemplateColumns={"95% 2em"}
        h="150px"
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
      </Grid>
    </Card>
  );
}

export function Polls() {
  const polls = [examplePoll, examplePoll, examplePoll];

  return (
    <>
      <div>
        {polls.map((p) => (
          <Link href={"/vote/" + p.id} key={p.id}>
            <PollDisplay poll={p} />
          </Link>
        ))}
      </div>
    </>
  );
}
