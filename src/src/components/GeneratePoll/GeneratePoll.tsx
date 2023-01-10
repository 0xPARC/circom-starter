import React, { useState } from 'react';
import { ethers } from 'ethers';
// import styled from "styled-components";
import styles from '../../../styles/Home.module.css';



// const GeneratePollContainer = styled.div`
//   max-width: 500px;
//   margin: 0 auto;
//   padding: 20px;
//   border: 1px solid #ccc;
//   border-radius: 4px;

//     &:hover {
//         background-color: #ffffff;
//     }
// `

interface FormValues {
  title: string;
  addresses: string[];
  description: string;
  groupDescription: string;
  createdAt: number;
  deadline: number;
}

  // Generate a form poll that allows a user to enter FormValues and upload a .csv 
export default function GeneratePoll() {
  const [title, setTitle] = useState<string>('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<number>(0);
  const [deadline, setDeadline] = useState<number>(0);

  const [tempAddresses, setTempAddresses] = useState<string>('');


  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    const split = tempAddresses.split(',');
          if (split) {
            for (let i = 0; i < split.length; i++) {
              if (ethers.utils.isAddress(split[i])) {
                addresses.push(split[i]);
              }
            }
          }

    const postData = async () => {
      const data = {
        title: title,
        addresses: addresses,
        description: description,
        groupDescription: groupDescription,
        createdAt: createdAt,
        deadline: deadline,
      };

      console.log(data)

      const response = await fetch("/api/generatePoll", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    };
    postData().then((data) => {
      alert(data.message);
    });
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.currentTarget.files![0])
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const contents = e.target.result;
        if (typeof contents == 'string') {
          const rows = contents.split('\n');
          const values = rows.map((row) => row.split(','));
          const flatValues = values.flat();
          const addresses = flatValues.filter((value) => ethers.utils.isAddress(value));
          setAddresses(addresses);
        }
      }
    };
    reader.readAsText(file);
  }

  return (
    <form className={styles.generate} onSubmit={(e) => handleSubmit(e)}>
      Generate a Poll
      <div>
        <input
          id="title"
          type="text"
          value={title}
          placeholder="Question"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <input
          id="description"
          type="text"
          value={description}
          placeholder="Additional Description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div> 
        <input
          id="groupDescription"
          type="text"
          value={groupDescription}
          placeholder="Voter Description"
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
      <input type="file" onChange={e => handleFileUpload(e)}/>
      <button type="submit">Submit</button>
    </form>
  );
};


// TODO: verify ethereum validity address in real time, connectwallet


  // const [pksprocessed, setPksProcessed] = useState<string[]>([]);
  
  // const formikProps = useFormikContext()

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.currentTarget.files![0])
  //   const file = e.target.files && e.target.files[0];
  //   if (!file) {
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     if (e.target && e.target.result) {
  //       const contents = e.target.result;
  //       if (typeof contents == 'string') {
  //         const rows = contents.split('\n');
  //         const values = rows.map((row) => row.split(','));
  //         const flatValues = values.flat();
  //         setPksProcessed(flatValues); // parses .csv locally
  //         // formikProps.setFieldValue('pks', flatValues)
  //       }
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  // return (
  //   <div>
  //     <div className="generate-poll-container">
  //     <h1>Generate a Poll</h1>
  //     <Formik
  //       initialValues={{ question: '', des: '', gdes: '', id: '', pkcsv: '', pks: [] as string[]}}
  //       onSubmit={(values, { setSubmitting }) => {
  //         let proposedpks : string[] = [];
  //         const split = values.pkcsv.split(',');
  //         if (split) {
  //           for (let i = 0; i < split.length; i++) {
  //             if (ethers.utils.isAddress(split[i])) {
  //               proposedpks.push(split[i]);
  //             }
  //           }
  //         }
  //         setPksProcessed(proposedpks)
  //         console.log(proposedpks)

  //         formikProps.setFieldValue('pks', pksprocessed)

  //         setTimeout(() => {
  //           alert(JSON.stringify(values, null, 2));
  //           setSubmitting(false);
  //         }, 400);
  //       }}
  //     >
  //       {({ isSubmitting }) => (
  //         <Form>
  //           <Field type="question" name="question" placeholder="Question" />
  //           <Field type="des" name="des" placeholder="Vote Description" />
  //           <Field type="gdes" name="gdes" placeholder="Group Description" />
  //           <Field type="id" name="id" placeholder="Private Key" />
  //           <Field
  //             type="pkcsv"
  //             name="pkcsv"
  //             placeholder="Input Voter Addresses"
  //           />
  //           <p>or enter CSV of addresses:</p>
  //           <input type="file" onChange={e => handleFileUpload(e)}/>
  //           <button type="submit" disabled={isSubmitting} className="button-35"><div className="gradient-text">Create</div></button>

  //         </Form>
  //       )}
  //     </Formik>
  //   </div>
  //   </div>