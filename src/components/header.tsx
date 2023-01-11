import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Link from "next/link";
import styles from '../styles/Home.module.css';

export default function Header() {
    return (
        <div className={styles.header}>
        <div className={styles.hbutton}>
        <Link href="/">Docs</Link>
        </div>
        <div className={styles.hbutton}>
        <Link href="/">All Polls</Link>
        </div>
        <div className={styles.hbutton}>
        <Link href="/generatepoll">Generate Poll</Link>
        </div>
        <ConnectButton />
        </div>
    )
}
