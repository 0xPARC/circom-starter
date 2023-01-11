import React from "react";
import styled from "styled-components";
import { BsFillPeopleFill } from "react-icons/bs";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter, Heading, Button, Text, Grid, GridItem } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
// import Header from "./components/header";

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

// const PollContainer = styled.div`
//     width: 100%!;
//     padding: 1rem;
//     margin-top: 0.4rem;
//     display: flex;
//     flex-direction: column;
//     border: 1px solid #e2e3e8;
//     box-sizing: border-box;
//     border-radius: 16px;
//     background: #f4f4f8;
//     font-size: 22px;
//     font-family: "PT Root UI";
//     font-weight: 700;
//     text-decoration: none;
//     color: inherit;
//     margin-bottom: 1rem;

//     &:hover {
//         background-color: #ffffff;
//     }
// `

// const TitleContainer = styled.div`
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     width: 100%;
//     color: black;
//     font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
//     font-size: 24px;
//     font-weight: 500;
// `

// const HeaderContainer = styled.div`
//     box-sizing: border-box;
//     margin: 0px 0px 8px;
//     min-width: 0px;
//     text-transform: uppercase;
//     font-size: 12px;
//     font-weight: 600;
//     letter-spacing: 0.05em;
//     color: #666666;
//     font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu;
// `

// const DescriptionContainer = styled.div`
//     box-sizing: border-box;
//     margin: 8px 0px;
//     min-width: 0px;
//     color: #666666;
//     font-size: 15px;
//     font-weight: 400;
//     font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;

// `

// const GroupDescription = styled.div`
//     box-sizing: border-box;
//     margin: 8px 0px;
//     min-width: 0px;
//     color: #666666;
//     font-size: 10px;
//     font-weight: 400;
//     font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
// `

// const VoteContainer = styled.div`
//     font-family: "PT Root UI";
//     font-weight: 700;
//     color: #000000;
//     border-radius: 8px;
//     font-size: 14px;
//     border: 0;
//     padding: 0.36rem 0.65rem;
//     font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
// `

// const ButtonWrapper = styled.div`
//     margin: 2px;
//     width: fit-content;
//     background-color: #43b369;
//     font-family: "PT Root UI";
//     font-weight: 700;
//     color: #fff;
//     border-radius: 8px;
//     font-size: 14px;
//     border: 0;
//     padding: 0.36rem 0.60rem;
// `

// const ButtonContainer = styled.div`
//     font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
//     font-weight: 700;
//     color: #fff;
//     border-radius: 8px;
//     font-size: 14px;
//     border: 0;
//     justify-content: center;
// `

const examplePoll: IPoll = {
    title: "Does pineapple belong on pizza?",
    author: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    gdes: "A group for all pizza lovers",
    des: "A decade long debate, Pineapple on pizza remains a contentious. ",
    votes: 10,
    id: 1,
    createdAt: 40234850, 
    deadline: 12345678,
}

function PollDisplay({ poll }: { poll: IPoll }) {
    return (
        // <Header/>
        <Card backgroundColor={'#f4f4f8'} variant={"elevated"} margin={8} _hover={{background: "white"}}>
            <Grid
                templateAreas={`"header header"
                                "main nav"
                                "footer nav"`}
                gridTemplateRows={'18% 2em 20%'}
                gridTemplateColumns={'95% 2em'}
                h='150px'
                gap='1'
                color='#242124'
                fontWeight='bold'
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
                    <Text fontSize='2xl'>{poll.title}</Text>
                </GridItem>
                <GridItem pl='2' area={'footer'}>
                    <Text>{poll.des}</Text>
                    <Text fontSize='xs'>{poll.gdes}</Text>
                </GridItem>
                <GridItem pl='2' area={'nav'} marginTop={2}>
                    <BsFillPeopleFill color="black"/>
                    {poll.votes}
                </GridItem>
            </Grid>


            {/* <CardHeader>
                <Heading size='md'>{poll.title}</Heading>
            </CardHeader>
            <CardBody>
                <Row>
                    <Text>{poll.des}</Text>
                    <BsFillPeopleFill color="black"/>
                    {poll.votes}
                </Row>
                <Text>{poll.des}</Text>
                <Text>{poll.gdes}</Text>
            </CardBody>
            <CardFooter>
                <Button colorScheme='green'>Active</Button>
            </CardFooter> */}
        </Card>



    // <PollContainer key={`poll-${poll.id}`} id={`poll-${poll.id}`}>
    //     <HeaderContainer>POSTED {poll.createdAt} | POLL ID {poll.id}</HeaderContainer>
    //     <TitleContainer>
    //         {poll.title}
    //         <VoteContainer>
                // <BsFillPeopleFill color="black"/>
                // {poll.votes}
    //         </VoteContainer>
    //     </TitleContainer>
    //     <DescriptionContainer>
    //             {poll.des}
    //             <GroupDescription>
    //             {poll.gdes}
    //             </GroupDescription>
    //             <ButtonWrapper>
    //             <ButtonContainer>
    //                 Active
    //             </ButtonContainer>
    //             </ButtonWrapper>

    //     </DescriptionContainer>
    // </PollContainer>
)}

export function Polls() {
    const polls = [examplePoll, examplePoll, examplePoll];

    return (
        <>
            <div>
                {polls.map((p) => (
                    <Link href={'/vote/' + p.id} key={p.id}><PollDisplay poll={p} /></Link>
                ))}
            </div>
        </>
    )
};