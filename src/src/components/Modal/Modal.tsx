
import Web3Modal from "web3modal"
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

import { configureChains, createClient, WagmiConfig } from "wagmi";

import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { ethers } from 'ethers';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import '../../App.css'


export default function Modal() {
    const providerOptions = {
        coinbasewallet: {
          package: CoinbaseWalletSDK, // Required
          options: {
            appName: "My Awesome App", // Required
            infuraId: "2CnBo7Iui1ss8dNx0jqlaR6YNgb", // Required
            rpc: "", // Optional if `infuraId` is provided; otherwise it's required
            chainId: 1, // Optional. It defaults to 1 if not provided
            darkMode: false // Optional. Use dark theme, defaults to false
          }
        },
        walletconnect: {
          package: walletConnectProvider, // required
          options: {
            infuraId: "2CnBo7Iui1ss8dNx0jqlaR6YNgb" // required
          }
        },
        binancechainwallet: {
          package: true
        }
      };
    
      async function connectWallet() {
        try {
          let web3Modal = new Web3Modal({
            cacheProvider: false,
            providerOptions
          });
          const web3ModalInstance = await web3Modal.connect();
          const web3ModalProvider = new ethers.providers.Web3Provider(web3ModalInstance);
          console.log(web3ModalProvider);
        } catch(error) {
          console.log(error);
        }
      }
      
      return (
        <div style={{ width: '100%', display: 'flex', lineHeight : 10, flexDirection: 'row-reverse'}} >
          <button className="button-36" onClick={connectWallet}>Connect Wallet</button>
        </div>
      );
}


