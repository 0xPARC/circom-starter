import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
import { Card, Button, Text, Grid, GridItem } from "@chakra-ui/react";
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

function PollCard({ poll }: { poll: IPoll }) {
  return (
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
              POSTED {examplePoll.createdAt} | POLL ID {examplePoll.id}
            </Text>
            <Spacer />
            <Button size="xs" colorScheme="green">
              Active
            </Button>
          </Flex>
        </GridItem>
        <GridItem pl="2" area={"main"}>
          <Text fontSize="2xl" fontWeight="700">
            {examplePoll.title}
          </Text>
        </GridItem>
        <GridItem pl="2" area={"footer"}>
          <Text>{examplePoll.des}</Text>
          <Text fontSize="xs">{examplePoll.gdes}</Text>
        </GridItem>
        <GridItem pl="2" area={"nav"} marginTop={2}>
          <BsFillPeopleFill color="black" />
          {examplePoll.votes}
        </GridItem>
      </Grid>
    </Card>
  );
}

export function Polls() {
  const [polls, setPolls] = useState<IPoll[]>([]);
  useEffect(() => {
    async function getPolls() {
      const response = await fetch("/api/getPolls", {
        method: "GET",
      });
      console.log(response);
      if (response.status === 200) {
        const contentType = response.headers.get("content-type");
        const temp = await response.json();
        console.log(response.json);
        // myResponse = temp;
        return temp;
      } else {
        console.warn("Server returned error status: " + response.status);
      }
    }
    getPolls();
  }, []);

  return (
    <>
      <div>
        {polls?.map((p) => (
          <Link href={"/vote/" + p.id} key={p.id}>
            <PollCard poll={p} />
          </Link>
        ))}
      </div>
    </>
  );
}
