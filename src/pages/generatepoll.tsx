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
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "@chakra-ui/react";
import {
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

interface FormValues {
  title: string;
  addresses: string[];
  description: string;
  groupDescription: string;
  createdAt: number;
  deadline: number;
}

const SEMAPHORE_CONTRACT = "0x3605A3A829422c06Fb53072ceF27aD556Fb9f650";

// Generate a form poll that allows a user to enter FormValues and upload a .csv
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);

  const [tempAddresses, setTempAddresses] = useState<string>("");

  const [res, setRes] = useState("");
  const [hash, setHash] = useState("");

  const account = getAccount();
  console.log("ACCCOUNT");
  console.log(account.address);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    const split = tempAddresses.split(",");
    if (split) {
      setAddresses(split);
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
      };

      console.log(body);

      const response = await fetch("/api/generatePoll", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        const contentType = response.headers.get("content-type");
        const temp = await response.json();
        console.log(temp);
        console.log(temp["name"]);
        setRes(temp.name);
        setHash(temp.rootHash);
        return temp;
      } else {
        console.warn("Server returned error status: " + response.status);
      }
    };
    postData().then((data) => {
      swal(res, "Merkle Root Hash: " + hash, "success");
    });
  }

  //   const { data, isError, isLoading, refetch } = useContractRead({
  //     address: SEMAPHORE_CONTRACT,
  //     abi: testABI,
  //     functionName: 'getPollState',
  // });

  console.log("cleared read");
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

  console.log("config cleared");

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
                  onClick={() => write?.()}
                  colorScheme="blue"
                >
                  Submit
                </Button>
              </FormControl>
            </CardBody>
          </Card>
        </main>
      </div>
    </>
  );
}
