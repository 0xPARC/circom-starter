import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import * as React from 'react'
import styles from '../../styles/Home.module.css'
import styled from 'styled-components'
import { BsFillPeopleFill } from 'react-icons/bs'
import Header from '../../components/header'
import { Card, CardHeader, CardBody, CardFooter, Heading, Button, Text, Grid, GridItem, Center, Input } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { useState } from 'react'

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


function PollDisplay({ poll }: { poll: IPoll }) {

  const [yesSelected, setYesSelected] = useState(false);
  const [noSelected, setNoSelected] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setYesSelected(e.currentTarget.textContent === "Yes" ? true : false);
    setNoSelected(e.currentTarget.textContent === "No" ? true : false);
  }

  return (
    <Card backgroundColor={'#f4f4f8'} variant={"elevated"} margin={8}>
    <Grid
        templateAreas={`"header header"
                        "main nav"
                        "footer nav"
                        "extra extra"`}
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
                <Input mr={4} placeholder='Enter your Private Key: ' />
                {/* <Button size='md' colorScheme='teal' variant="outline" mr={4}>Yes</Button>
                <Button size='md' colorScheme='red' variant="outline">No</Button> */}
                <Button size='md' variant="outline" isActive={yesSelected} colorScheme='green' mr={4} onClick={handleClick} >Yes</Button>
                <Button size='md' variant="outline" isActive={noSelected} colorScheme='red' onClick={handleClick} >No</Button>
            </Flex>
          </Center>
            <Spacer/>
            <Center><Button margin={10} size='md' colorScheme='green'>Cast Vote</Button></Center>
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
