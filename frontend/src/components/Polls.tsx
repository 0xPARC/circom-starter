import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Text, Grid, GridItem, FormControl, Center, Input } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
 import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
 import { debounce } from "lodash";

interface IPoll {
  title: string;
  author: string;
  groupDescription: string;
  description: string;
  votes: number;
  id: number;
  createdAt: number;
  deadline: number;
  active: boolean;
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
              POLL ID {poll.id} | {poll.createdAt}
            </Text>
            <Spacer />
            {poll.active ? (
              <Button disabled={true} size="xs" colorScheme="yellow">
                Active
              </Button>
            ) : (
              <Button disabled={true} size="xs" colorScheme="green">
                Complete
              </Button>
            )}
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
      </Grid>
    </Card>
  );
}

export function Polls() {
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPolls, setFilteredPolls] = useState<IPoll[]>([]);


  const debouncedSearchTerm = debounce((value: string) => setSearchTerm(value), 500);

  useEffect(() => {
    async function getPolls() {
      const response = await fetch("/api/getPolls", {
        method: "GET",
      });
      console.log(response);
      if (response.status === 200) {
        const temp = await response.json();
        setFilteredPolls(temp.polls);
        setPolls(temp.polls);
      } else {
        console.warn("Server returned error status: " + response.status);
      }
    }
    getPolls();
  }, []);

  useEffect(() => {
    setFilteredPolls(
      polls.filter((poll) =>
        poll.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    debouncedSearchTerm(searchTerm);
  }

  return (
    <>
      <FormControl>
       <Center>
       <Input
         placeholder="Search"
         value={searchTerm}
         mt={3}
         style={{ width: '60%'}}
         onChange={(e) => setSearchTerm(e.target.value)}
       />
       </Center>
       <Button
         type="submit"
         size="md"
         colorScheme="blue"
         style={{ display: 'none' }}
         onClick={(e) => {
           e.preventDefault();
           debouncedSearchTerm(searchTerm);}}
       >
         Submit
       </Button>
     </FormControl>

      <div>
        {filteredPolls.map((p) => (
          <Link
            href={{
              pathname: "/vote/" + p.id,
              query: p.id.toString()
            }}
          >
            <PollCard poll={p} key={p.id}/>
          </Link>
        ))}
      </div>
    </>
  );
}