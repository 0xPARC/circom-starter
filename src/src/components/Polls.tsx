import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Text, Grid, GridItem } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";

interface IPoll {
  title: string;
  author: string;
  groupDescription: string;
  description: string;
  votes: number;
  id: number;
  createdAt: number;
  deadline: number;
}

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
              POSTED {poll.createdAt.toString()} | POLL ID {poll.id}
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
          <Text>{poll.description}</Text>
          <Text fontSize="xs">{poll.groupDescription}</Text>
        </GridItem>
        {/* <GridItem pl="2" area={"nav"} marginTop={2}>
          <BsFillPeopleFill color="black" />
          {2}
        </GridItem> */}
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
        const temp = await response.json();
        setPolls(temp.polls);
      } else {
        console.warn("Server returned error status: " + response.status);
      }
    }
    getPolls()
  }, []);

  return (
    <>
      <div>
        {polls.map((p) => (
          <Link href={"/vote/" + p.id} key={p.id}>
            <PollCard poll={p} />
          </Link>
        ))}
      </div>
    </>
  );
}
