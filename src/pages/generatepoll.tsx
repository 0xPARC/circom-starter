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
import {GeneratePollButton} from '../components/GeneratePollButton';
import { getAccount } from '@wagmi/core'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button, 
  ButtonGroup, 
  Heading,
} from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

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

  const account = getAccount();
  console.log("ACCCOUNT");
  console.log(account.address);

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
        <Card variant={'elevated'} style={{width: '80%'}}>
          <CardHeader>
            <Heading as='h1' size='2xl'>Generate a Poll</Heading>
          </CardHeader>
          <CardBody>
          <FormControl className={styles.generate} onSubmit={(e) => handleSubmit(e)}>
              <Input placeholder='Title'  value={title} onChange={(e) => setTitle(e.target.value)}/>
              <Input placeholder="Additional Description"  value={description} onChange={(e) => setDescription(e.target.value)}/>
              <Input placeholder='Group Description' value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)}/>
              <Input placeholder='Public Addresses' value={tempAddresses} onChange={(e) => setTempAddresses(e.target.value)} />
            <Button colorScheme='blue' type="submit" size='md'>
              <GeneratePollButton coordinator={'0x44A4d61B46B04Bd67375eEb7b4587e3fA048eE49'} merkleRoot={hash} />
            </Button>
          </FormControl>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}
