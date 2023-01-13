import type { NextPage } from 'next'
import { Polls } from '../src/components/Polls'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
import { Heading } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Heading as='h1' size='xl'>zkPoll</Heading>
          <Polls />
      </main>
    </div>
  )
}

export default Home
