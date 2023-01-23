import * as React from 'react'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Header from '../components/header'
import testABI from '../components/abi/test.json'
import { generatePollinDB } from '../components/generatePoll'
import { getAccount } from '@wagmi/core'
import {
  Grid,
  GridItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useToast,
  Text,
} from '@chakra-ui/react'
import { FormControl, Input, Button, Heading } from '@chakra-ui/react'
import { Card, CardBody } from '@chakra-ui/react'
import {
  useContract,
  useSigner,
  useWaitForTransaction,
  useEnsAddress,
  createClient,
} from 'wagmi'
import { ethers, getDefaultProvider, Wallet } from 'ethers'

import {
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Code,
  Icon,
} from '@chakra-ui/react'
import { FiFile } from 'react-icons/fi'
import Papa, {parse, ParseResult} from 'papaparse'


const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-goerli.g.alchemy.com/v2/3daFopiKN1n8gyTPl7UvqO4e0k8jETYe',
  'goerli',
)
const wallet = new ethers.Wallet(
  '0xfaf3aebf380aedc47d8d11acde148b1048dc123d90b0b1016faf92b7d1583a15',
  provider,
)
const signer = wallet.connect(provider)

const getENS = (addr: String) => {
  addr = addr.trim()
  const address = signer.resolveName(addr?.toString())
  return address
}

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

interface FormValues {
  title: string
  addresses: string[]
  description: string
  groupDescription: string
  createdAt: number
  deadline: number
}

let myResponse: {
  name: ''
  rootHash: ''
  pollId: 0
  title: ''
  deadline: 0
} = {
  name: '',
  rootHash: '',
  pollId: 0,
  title: '',
  deadline: 0,
}

const SEMAPHORE_CONTRACT = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT

// Generate a form poll that allows a user to enter FormValues and upload a .csv
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [groupDescription, setGroupDescription] = useState<string>('')
  const [duration, setDuration] = useState<number>(5)
  const [tempAddresses, setTempAddresses] = useState<string>('')
  // const [pollId, setPollId] = useState<number>(1);
  const account = getAccount()
  const [dbLoading, setDbLoading] = useState(false)
  const [contractLoading, setContractLoading] = useState(false)
  const { data: signer } = useSigner()
  const toast = useToast()
  const [currHash, setHash] = useState()
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [temp, setTemp] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  let csvAddresses: string[] = [];

  const { data, isError, isLoading } = useWaitForTransaction({
    hash: currHash,
  })

  const contract = useContract({
    address: SEMAPHORE_CONTRACT,
    abi: testABI,
    signerOrProvider: signer,
  })

  const splitAddresses = async (stringAddresses: string) => {
    setTempAddresses(stringAddresses)
    const split = stringAddresses.split(',')
    const addressesTemp: string[] = []
    if (split) {
      for (let i = 0; i < split.length; i++) {
        let addr = split[i].trim()
        if (addr.includes('.eth')) {
          setTemp(addr)
          let add = await getENS(addr)
          if (add) {
            // console.log('ETH Address ', addr, 'is now address', add)
            addressesTemp.push(add!)
          }
        } else {
          // console.log('No ETH Address here')
          addressesTemp.push(addr!)
        }
      }
    }
    setAddresses(addressesTemp)
    console.log('Final addresses ', addresses)
  }

  const postData = async (addressesArr: string[]) => {
    let setDeadline
    setDeadline = Date.now() + 3600 * 1000 * duration
    // const body = {
    //   data: {
    //     title: title,
    //     addresses: addressesArr,
    //     description: description,
    //     groupDescription: groupDescription,
    //     createdAt: Date.now(),
    //     deadline: setDeadline,
    //   },
    // };

    const dbOutput = await generatePollinDB(
      title,
      addressesArr,
      description,
      groupDescription,
      Date.now(),
      setDeadline,
    )
    console.log('In pages: ', dbOutput)
    return dbOutput
    // console.log(response);
    // if (response.status === 200) {
    //   const temp = await response.json();
    //   console.log("Success! ", temp);
    //   myResponse = temp;
    //   return myResponse.pollId;
    //   // return temp;
    // } else {
    //   console.warn("Server returned error status: " + response.status);
    // }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  function onParseCsv(results: ParseResult<any>) {
    console.log('Parsed CSV: ', results.data)
    csvAddresses = results.data
  }

  async function handleSubmit(
    e: { preventDefault: () => void },
    addressesArr: string[],
  ) {
    setDbLoading(true)
    e.preventDefault()

    if (!file) {
      console.log("no file")
    } else {
      console.log('Uploaded a file')
      Papa.parse(file, {
      complete: onParseCsv,
      })
      await timeout(2000);
    }

    const finalAddresses = Array.from(new Set([...addresses, ...csvAddresses]))
    setAddresses(finalAddresses)

    const responseArr = await postData(addressesArr)
    // console.log(responseArr)
    // const pollId = responseArr[1];
    // const rootHash = responseArr[0];
    setDbLoading(false)
    console.log('OK ROOT HASH', responseArr.rootHash)
    setContractLoading(true)
    const tx = await contract?.createPoll(
      // 1,
      responseArr.pollId,
      account.address,
      responseArr.rootHash,
      16,
    )
    const response = await tx.wait()
    setHash(tx.hash)
    console.log('tx', tx.hash)
    if (!isError) {
      toast({
        title: 'Poll created',
        description: tx.hash,
        status: 'success',
        duration: 5000,
        isClosable: true,
        containerStyle: {
          // width: "700px",
          maxWidth: '90%',
        },
      })
    } else {
      toast({
        title: 'Transaction failed',
        description: tx.hash,
        status: 'error',
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: '700px',
          maxWidth: '90%',
        },
      })
    }
    setContractLoading(false)
    console.log(`Transaction response: `, response)
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Card variant={'elevated'} style={{ maxWidth: '98%', width: 600 }}>
          <CardBody>
            <FormControl
              className={styles.generate}
              onSubmit={(e) => handleSubmit(e, addresses)}
            >
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                focusBorderColor={'#9B72F2'}
              />
              <Input
                placeholder="Additional Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                focusBorderColor={'#9B72F2'}
              />
              <Input
                placeholder="Group Description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                focusBorderColor={'#9B72F2'}
              />
              <Input
                placeholder="Public Addresses"
                value={tempAddresses}
                onChange={(e) => splitAddresses(e.target.value)}
                focusBorderColor={'#9B72F2'}
              />


              <p>or Upload a CSV of public addresses</p>
              <input type="file" accept={'.csv'} onChange={handleFileUpload}/>

              <Grid templateColumns="repeat(10, 1fr)" gap={3} ml={1}>
                <GridItem colSpan={7} w="100%" h="10">
                  {' '}
                  <Slider
                    id="slider"
                    defaultValue={5}
                    min={0}
                    max={24}
                    mt={3}
                    colorScheme="purple"
                    onChange={(v) => setDuration(v)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg="#9B72F2"
                      color="white"
                      placement="top"
                      isOpen={showTooltip}
                      label={duration}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                </GridItem>
                <GridItem colSpan={3} w="100%" h="10" mt={1}>
                  {'Duration: ' + duration + ' hr'}
                </GridItem>
              </Grid>




              <Button
                type="submit"
                size="md"
                colorScheme="blue"
                isLoading={contractLoading || dbLoading}
                loadingText={
                  dbLoading ? 'Generating merkle root' : 'Submitting poll'
                }
                onClick={(e) => handleSubmit(e, addresses)}
                backgroundColor={'#8f00ff'}
                _hover={{ backgroundColor: '#5b0a91' }}
                color={'white'}
                disabled={!account.isConnected}
              >
                Generate
              </Button>
              {/* <FileUpload
                name="avatar"
                acceptedFileTypes="image/*"
                isRequired={true}
                placeholder="Your avatar"
                control={''}
              >
                New avatar
              </FileUpload> */}
            </FormControl>
          </CardBody>
        </Card>
      </main>
    </div>
  )
}
