import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import * as React from 'react'
import styles from '../../styles/Home.module.css'
import styled from 'styled-components'
import { BsFillPeopleFill } from 'react-icons/bs'
import Header from '../../components/header'

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

const PollContainer = styled.div`
  width: 100%!;
  padding: 1rem;
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e3e8;
  box-sizing: border-box;
  border-radius: 16px;
  background: #f4f4f8;
  font-size: 22px;
  font-family: 'PT Root UI';
  font-weight: 700;
  text-decoration: none;
  color: inherit;
  margin-bottom: 1rem;

`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: black;
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-size: 24px;
  font-weight: 500;
`

const HeaderContainer = styled.div`
  box-sizing: border-box;
  margin: 0px 0px 8px;
  min-width: 0px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #666666;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Ubuntu;
`

const DescriptionContainer = styled.div`
  box-sizing: border-box;
  margin: 8px 0px;
  min-width: 0px;
  color: #666666;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
`

const VoteContainer = styled.div`
  font-family: 'PT Root UI';
  font-weight: 700;
  color: #000000;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  padding: 0.36rem 0.65rem;
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
`

const ButtonWrapper = styled.div`
  width: fit-content;
  background-color: #43b369;
  font-family: 'PT Root UI';
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  padding: 0.36rem 0.65rem;
`

const ButtonContainer = styled.div`
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  justify-content: center;
`

const YesContainer = styled.div`
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  justify-content: center;
`

const NoContainer = styled.div`
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  justify-content: center;
`

const CastVoteContainer = styled.div`
  font-family: 'Inter UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  border: 0;
  justify-content: center;
`

const GroupDescription = styled.div`
    box-sizing: border-box;
    margin: 8px 0px;
    min-width: 0px;
    color: #666666;
    font-size: 10px;
    font-weight: 400;
    font-family: "Inter UI","SF Pro Display",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;
`

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
  return (
    <PollContainer key={`poll-${poll.id}`} id={`poll-${poll.id}`}>
      <HeaderContainer>
        POSTED {poll.createdAt} | POLL ID {poll.id}
      </HeaderContainer>
      <TitleContainer>
        {poll.title}
        <VoteContainer>
          <BsFillPeopleFill color="black" />
          {poll.votes}
        </VoteContainer>
      </TitleContainer>
      <DescriptionContainer>
        {poll.des}
        <GroupDescription>
            {poll.gdes}
        </GroupDescription>
        <ButtonWrapper>
          <ButtonContainer>Active</ButtonContainer>
        </ButtonWrapper>
      </DescriptionContainer>
    </PollContainer>
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

export default function GeneratePoll() {
  const polls = [examplePoll, examplePoll, examplePoll]

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card} style={{width:'80%'}}>
          <div>
            <PollDisplay poll={examplePoll} />
          </div>
        </div>
      </main>
    </div>
  )
}
