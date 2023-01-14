import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  Button,
  Text,
  Grid,
  GridItem,
  FormControl,
  Center,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
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
      variant={"elevated"}
      margin={8}
      _hover={{ backgroundColor: "rgba(69, 72, 94, 0.2)" }}
    >
      <Grid
        templateAreas={`"header header"
                                "main nav"
                                "footer nav"`}
        gridTemplateRows={"18% 2em 20%"}
        gridTemplateColumns={"95% 2em"}
        h="150px"
        gap="1"
        padding={4}
        margin={2}
        marginLeft={0}
      >
        <GridItem pl="2" area={"header"}>
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
                _disabled={{ backgroundColor: "#651fff" }}
                _hover={{ backgroundColor: "#651fff" }}
                size="xs"
                backgroundColor="#651fff"
                color={"white"}
              >
                Active
              </Button>
            ) : (
              <Button
                disabled={true}
                size="xs"
                _disabled={{ backgroundColor: "#651fff" }}
                _hover={{ backgroundColor: "#651fff" }}
                backgroundColor="#651fff"
                color={"white"}
                opacity={0.3}
              >
                Complete
              </Button>
            )}
            <Spacer />
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
  const [isLoaded, setIsLoaded] = useState(false);

  const debouncedSearchTerm = debounce(
    (value: string) => setSearchTerm(value),
    500
  );

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
        setIsLoaded(true);
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

  return (
    <>
      <FormControl>
        <Center>
          <Input
            placeholder="Search"
            value={searchTerm}
            mt={3}
            style={{ width: "50%" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            _hover={{ borderColor: "#9B72F2", borderWidth: "1px" }}
            focusBorderColor={"#9B72F2"}
          />
        </Center>
        <Button
          type="submit"
          size="md"
          colorScheme="blue"
          style={{ display: "none" }}
          onClick={(e) => {
            e.preventDefault();
            debouncedSearchTerm(searchTerm);
          }}
        >
          Submit
        </Button>
      </FormControl>

      <div>
        {isLoaded ? (
          <>
            {filteredPolls.map((p) => (
              <Link
                href={{
                  pathname: "/vote/" + p.id,
                  query: p.id.toString(),
                }}
              >
                <PollCard poll={p} key={p.id} />
              </Link>
            ))}
          </>
        ) : (
          <Spinner mt= {"75px"} colorScheme="purple" />
        )}
      </div>
    </>
  );
}
