import * as React from 'react'
import { ethers } from 'ethers'
// import styled from "styled-components";
import styles from '../styles/Home.module.css'
import { useNavigate } from 'react-router-dom'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import swal from 'sweetalert'
import Header from '../components/header'

interface FormValues {
  title: string
  addresses: string[]
  description: string
  groupDescription: string
  createdAt: number
  deadline: number
}

// Generate a form poll that allows a user to enter FormValues and upload a .csv
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')
  const [createdAt, setCreatedAt] = useState<number>(0)
  const [deadline, setDeadline] = useState<number>(0)

  const [tempAddresses, setTempAddresses] = useState<string>('')

  const [res, setRes] = useState('')
  const [hash, setHash] = useState('')

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    const split = tempAddresses.split(',')
    if (split) {
      setAddresses(split)
      // for (let i = 0; i < split.length; i++) {
      //   if (ethers.utils.isAddress(split[i])) {
      //     setAddresses([...addresses, split[i]]);
      //   }
      // }
    }

    const postData = async () => {
      const body = {
        data: {
          title: title,
          addresses: addresses,
          description: description,
          groupDescription: groupDescription,
          createdAt: createdAt,
          deadline: deadline,
        },
      }

      console.log(body)

      const response = await fetch('/api/generatePoll', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (response.status === 200) {
        const contentType = response.headers.get('content-type')
        const temp = await response.json()
        console.log(temp)
        console.log(temp['name'])
        setRes(temp.name)
        setHash(temp.rootHash)
        return temp
      } else {
        console.warn('Server returned error status: ' + response.status)
      }
    }
    postData().then((data) => {
      swal(res, 'Merkle Root Hash: ' + hash, 'success')
    })
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.currentTarget.files![0])
    const file = e.target.files && e.target.files[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const contents = e.target.result
        if (typeof contents == 'string') {
          const rows = contents.split('\n')
          const values = rows.map((row) => row.split(','))
          const flatValues = values.flat()
          const addresses = flatValues
          // const addresses = flatValues.filter((value) => ethers.utils.isAddress(value));
          setAddresses(addresses)
        }
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <Header />
        <div className={styles.card}>
          <form className={styles.generate} onSubmit={(e) => handleSubmit(e)}>
            <h1>Generate a Poll</h1>
            <div>
              <input
                id="title"
                type="text"
                value={title}
                placeholder="Question"
                required={true}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <input
                id="description"
                type="text"
                value={description}
                placeholder="Additional Description"
                required={true}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <input
                id="groupDescription"
                type="text"
                value={groupDescription}
                placeholder="Voter Description"
                required={true}
                onChange={(e) => setGroupDescription(e.target.value)}
              />
            </div>
            <div>
              <input
                id="tempAddresses"
                type="text"
                value={tempAddresses}
                placeholder="Public Keys (Comma-Seperated)"
                onChange={(e) => setTempAddresses(e.target.value)}
              />
            </div>
            <p>or upload via CSV:</p>
            <input type="file" onChange={(e) => handleFileUpload(e)} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
    </div>
  )
}
