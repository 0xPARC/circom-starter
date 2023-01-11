import {ethers} from 'ethers';
import testABI from './abi/test.json';

import { BigNumber, Contract } from 'ethers'
import { useCallback } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

const SEMAPHORE_CONTRACT = '0x3605A3A829422c06Fb53072ceF27aD556Fb9f650';

export function GeneratePollButton(coordinator: any, merkleRoot: any) {

    console.log("In the generatePollButton")
    console.log("Coordinator ", coordinator.coordinator)

    const { data, isError, isLoading, refetch } = useContractRead({
        address: SEMAPHORE_CONTRACT,
        abi: testABI,
        functionName: 'getPollState',
    });
    console.log('cleared read')
    const { config } = usePrepareContractWrite({
        address: SEMAPHORE_CONTRACT,
        abi: testABI,
        functionName: "createPoll",
        args: [1, coordinator.coordinator, '0x3933650203527270685680201092987445017537318632365547099117460315253153700007', 16]
    });

    console.log('config cleared')

     const {status, write} = useContractWrite({
         ...config, 
         onError(error) {
            console.log('Contract Error' + error);
          },
         onSuccess: () => {
             console.log('Success')
             refetch();
         }
     })

     const isReadToWrite = !isLoading && !isError && write != null;

    return(<div>
        {/* isRefetching: {isRefetching.toString()} */}
        {/* {isLoading && <div>Loading...</div>}
        {!isLoading && isError && <div>Error</div>}
        {!isLoading && !isError && (<div>Counter {BigNumber.from(data).toString()}</div>)} */}
        <button disabled={!isReadToWrite} onClick={useCallback(() => write && write(), [write])}>Submit</button>
        {/* <div>{status}</div> */}
        </div>

)}
