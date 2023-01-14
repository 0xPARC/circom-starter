import * as React from "react";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Header from "../components/header";
import testABI from "../components/abi/test.json";
import { getAccount } from "@wagmi/core";
import { useToast } from "@chakra-ui/react";
import {
  FormControl,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Card, CardBody } from "@chakra-ui/react";
import {
  useContract,
  useSigner,
  useWaitForTransaction,
} from "wagmi";

interface FormValues {
  title: string;
  addresses: string[];
  description: string;
  groupDescription: string;
  createdAt: number;
  deadline: number;
}

let myResponse: {
  name: "";
  rootHash: "";
  pollId: 0;
  title: "";
  deadline: 0;
} = {
  name: "",
  rootHash: "",
  pollId: 0,
  title: "",
  deadline: 0,
};

const SEMAPHORE_CONTRACT = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT;

// Generate a form poll that allows a user to enter FormValues and upload a .csv
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [duration, setDuration] = useState<number>();
  const [tempAddresses, setTempAddresses] = useState<string>("");
  // const [pollId, setPollId] = useState<number>(1);
  const account = getAccount();
  const [dbLoading, setDbLoading] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const { data: signer } = useSigner();
  const toast = useToast();
  const [currHash, setHash] = useState();
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: currHash,
  });
  const contract = useContract({
    address: SEMAPHORE_CONTRACT,
    abi: testABI,
    signerOrProvider: signer,
  });

  const splitAddresses = (stringAddresses: string) => {
    setTempAddresses(stringAddresses);
    const split = stringAddresses.split(",");
    if (split) {
      setAddresses(split);
    }

  };
  const postData = async (addressesArr: string[]) => {
    // Convert to 
    console.log("Post addresses", addresses)
    let setDeadline;
    if (duration === undefined) {
      setDeadline = Date.now() + 3600*1000*24
    } else {
      setDeadline = Date.now() + 3600*1000*duration
    }
    // setDeadline = Date.now() + (duration ? 3600*1000*24: 3600*1000*duration!)
    const body = {
      data: {
        title: title,
        addresses: addressesArr,
        description: description,
        groupDescription: groupDescription,
        createdAt: Date.now(),
        deadline: setDeadline,
      },
    };

    const response = await fetch("/api/generatePoll", {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(response);
    if (response.status === 200) {
      const temp = await response.json();
      console.log('Success! ', temp)
      myResponse = temp;
      return myResponse.pollId;
      // return temp;
    } else {
      console.warn("Server returned error status: " + response.status);
    }
  };

  async function handleSubmit(e: { preventDefault: () => void }, addressesArr: string[]) {
    setDbLoading(true);
    e.preventDefault();

    const pollId = await postData(addressesArr)

    setDbLoading(false);
    console.log("OK ROOT HASH", myResponse.rootHash);
    setContractLoading(true);
    const tx = await contract?.createPoll(
      // 1,
      pollId,
      account.address,
      myResponse.rootHash,
      16
    );
    const response = await tx.wait();
    setHash(tx.hash);
    console.log("tx", tx.hash);
    if (!isError) {
      toast({
        title: "Poll created",
        description: tx.hash,
        status: "success",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: '700px',
          maxWidth: '90%',
        },
      });
    } else {
      toast({
        title: "Transaction failed",
        description: tx.hash,
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: '700px',
          maxWidth: '90%',
        },
      });
    }
    setContractLoading(false);
    console.log(`Transaction response: `, response);

  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <Heading as="h1" size="xl">
            Generate a Poll
          </Heading>
          <Card variant={"elevated"} style={{ width: "40%", marginTop: "1%" }}>
            <CardBody>
              <FormControl
                className={styles.generate}
                onSubmit={(e) => handleSubmit(e, addresses)}
              >
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  focusBorderColor={"#9B72F2"}
                />
                <Input
                  placeholder="Additional Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  focusBorderColor={"#9B72F2"}
                />
                <Input
                  placeholder="Group Description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  focusBorderColor={"#9B72F2"}
                />
                <Input
                  placeholder="Duration (Hours)"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  focusBorderColor={"#9B72F2"}
                />
                <Input
                  placeholder="Public Addresses"
                  value={tempAddresses}
                  onChange={(e) =>  splitAddresses(e.target.value)}
                  focusBorderColor={"#9B72F2"}
                />
                <Button
                  type="submit"
                  size="md"
                  colorScheme="blue"
                  isLoading={contractLoading || dbLoading}
                  loadingText={
                    dbLoading ? "Generating merkle root" : "Submitting poll"
                  }
                  style={{marginTop: "2%"}}
                  onClick={(e) => handleSubmit(e, addresses)}
                  backgroundColor={"#8f00ff"}
                  _hover={{ backgroundColor: "#5b0a91" }}
                  color={"white"}
                  disabled={!account.isConnected}
                  >
                  Generate
                </Button>
              </FormControl>
            </CardBody>
          </Card>
        </main>
      </div>
    </>
  );
}
