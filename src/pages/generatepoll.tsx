import * as React from "react";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import swal from "sweetalert";
import Header from "../components/header";
import testABI from "../components/abi/test.json";
import { getAccount } from "@wagmi/core";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  ButtonGroup,
  Heading,
  Center,
} from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'


interface FormValues {
  title: string;
  addresses: string[];
  description: string;
  groupDescription: string;
  createdAt: number;
  deadline: number;
}

let myResponse: {
  name: '',
  rootHash: '',
  pollId: 0,
  title: '',
  deadline: 0
} = {
  name: '',
  rootHash: '',
  pollId: 0,
  title: '',
  deadline: 0
}

const SEMAPHORE_CONTRACT = '0x3605A3A829422c06Fb53072ceF27aD556Fb9f650';


// Generate a form poll that allows a user to enter FormValues and upload a .csv
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);
  const [tempAddresses, setTempAddresses] = useState<string>("");
  const account = getAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { config } = usePrepareContractWrite({
    address: SEMAPHORE_CONTRACT,
    abi: testABI,
    functionName: "createPoll",
    args: [
      1,
      account.address,
      "0x0000000000000000000000000000000000000000000000000000000000000123",
      16,
    ],
  });

  const { status, write } = useContractWrite({
    ...config,
    onError(error) {
      console.log("Contract Error" + error);
    },
    onSuccess: () => {
      console.log("Success");
      // refetch();
    },
});

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
    };

    console.log("data to print: ", body);

    const response = await fetch("/api/generatePoll", {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(response)
    if (response.status === 200) {
      const contentType = response.headers.get('content-type')
      const temp = await response.json()
      myResponse = temp
      console.log("got temp", temp)
      return temp
    } else {
      console.warn("Server returned error status: " + response.status);
    }
  };

  function handleSubmit(e: { preventDefault: () => void }) {
    setIsLoading(true);
    e.preventDefault();
    const split = tempAddresses.split(",");
    if (split) {
      setAddresses(split);
    }
    
    postData().then(() => {
      // swal(myResponse.name, 'Merkle Root Hash: ' + myResponse.rootHash, 'success')
      console.log("curr config", config);
      setIsLoading(false);
      write?.();
    })

    console.log("cleared read");
    

  }

  //   const { data, isError, isLoading, refetch } = useContractRead({
  //     address: SEMAPHORE_CONTRACT,
  //     abi: testABI,
  //     functionName: 'getPollState',
  // });

  //  const isReadToWrite = !isLoading && !isError && write != null;

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.currentTarget.files![0]);
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const contents = e.target.result;
        if (typeof contents == "string") {
          const rows = contents.split("\n");
          const values = rows.map((row) => row.split(","));
          const flatValues = values.flat();
          const addresses = flatValues;
          setAddresses(addresses);
        }
      }
    };
    reader.readAsText(file);
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
        <Heading as="h1" size="xl">
            Generate a Poll
        </Heading>
          <Card variant={"elevated"} style={{ width: "40%", marginTop: "1%"}}>
            <CardBody>
              <FormControl
                className={styles.generate}
                onSubmit={(e) => handleSubmit(e)}
              >
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Additional Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  placeholder="Group Description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                />
                <Input
                  placeholder="Public Addresses"
                  value={tempAddresses}
                  onChange={(e) => setTempAddresses(e.target.value)}
                />
                <Button
                  type="submit"
                  size="md"
                  onClick={handleSubmit}
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Submitting"
                >
                  Submit
                </Button>
              </FormControl>
            </CardBody>
          </Card>
        </main>
      </div>
    </>
  )
}
