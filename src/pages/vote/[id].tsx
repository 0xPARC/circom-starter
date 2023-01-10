import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import * as React from 'react';
import styles from '../../styles/Home.module.css';

  // Generate a form poll that allows a user to enter FormValues and upload a .csv 
export default function GeneratePoll() {
  
  return (
    <div className={styles.container}>
    <main className={styles.main}>

    <div className={styles.header}>
        <div className={styles.hbutton}>
        <Link href="/">All Polls</Link>
        </div>
        <div className={styles.hbutton}>
        <Link href="/generatepoll">Generate Poll</Link>
        </div>
        <div className={styles.hbutton}>
        <Link href="/generatepoll">Vote</Link>
        </div>
      <ConnectButton />
      </div>


    <div className={styles.card}>


        yosdf
    </div>
    </main>
    </div>
  );
};
