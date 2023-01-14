// TODO: we can set the circuit we're using in a variable and have that propagate down to
// all of these variable names

// import { MerkleTree } from "./merkleTree";
// import { Proof } from "@prisma/client";

const localforage = require("localforage");
const snarkjs = require("snarkjs");

export async function downloadFromFilename(s3_url: string, filename: string) {
  const link = s3_url + filename + ".zkey";
  try {
    const item = await localforage.getItem(`${filename}.zkey`);
    if (item) {
        console.log(`${filename}.zkey already exists!`);
    } else {
        const zkeyResp = await fetch(link, {
        method: "GET",
        });
        const zkeyBuff = await zkeyResp.arrayBuffer();

        await localforage.setItem(filename + ".zkey", zkeyBuff);
        console.log(`Storage of ${filename}.zkey successful!`);
    }
  } catch (e) {
    console.log(
      `Storage of ${filename}.zkey unsuccessful, make sure IndexedDB is enabled in your browser.`
    );
  }
}

// export const downloadProofFiles = async function (filename: string) {
//   const zkeySuffix = [""];
//   const filePromises = [];
//   for (const c of zkeySuffix) {
//     const item = await localforage.getItem(`${filename}.zkey${c}`);
//     if (item) {
//       console.log(`${filename}${c}.zkey already exists!`);
//       continue;
//     }
//     filePromises.push(
//       downloadFromFilename(`${filename}.zkey${c}`, filename)
//     );
//   }
//   await Promise.all(filePromises);
// };

export async function fullProve(input: any, filename: string) {
    const zkeyBuff: ArrayBuffer | null = await localforage.getItem(`${filename}.zkey`);
    if (zkeyBuff == null) {
        throw new Error("zkeyBuff is null");
        // console.log("zkeyBuff is null");
    }
    console.log("generating proof for input");
    console.log(input);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    `../${filename}.wasm`,
    new Uint8Array(zkeyBuff)
    // new Uint8Array(`../${filename}.zkey`
    );
    console.log(`Generated proof ${JSON.stringify(proof)}`);

    return {
    proof,
    publicSignals,
    };
}

// export async function verifyProof(
//   proof: any,
//   publicSignals: any,
// ) {
//   const proofVerified = await snarkjs.groth16.verify(
//     JSON.parse(proofType.vkey),
//     publicSignals,
//     proof
//   );

//   return proofVerified;
// }

export function bigIntToArray(n: number, k: number, x: bigint) {
  let divisor = 1n;
  for (var idx = 0; idx < n; idx++) {
    divisor = divisor * 2n;
  }

  let ret = [];
  var x_temp = BigInt(x);
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % divisor);
    x_temp = x_temp / divisor;
  }
  return ret;
}

// // taken from generation code in dizkus-circuits tests
// function pubkeyToXYArrays(pk: string) {
//   const XArr = bigIntToArray(64, 4, BigInt("0x" + pk.slice(4, 4 + 64))).map(
//     (el) => el.toString()
//   );
//   const YArr = bigIntToArray(64, 4, BigInt("0x" + pk.slice(68, 68 + 64))).map(
//     (el) => el.toString()
//   );

//   return [XArr, YArr];
// }

// // taken from generation code in dizkus-circuits tests
// function sigToRSArrays(sig: string) {
//   const rArr = bigIntToArray(64, 4, BigInt("0x" + sig.slice(2, 2 + 64))).map(
//     (el) => el.toString()
//   );
//   const sArr = bigIntToArray(64, 4, BigInt("0x" + sig.slice(66, 66 + 64))).map(
//     (el) => el.toString()
//   );

//   return [rArr, sArr];
// }

// export function buildInput(
//   proofType: Proof,
//   merkleTree: MerkleTree,
//   address: string,
//   pubkey: string,
//   msghash: string,
//   sig: string
// ) {
//   if (proofType!.definition === "ECDSA-secp256k1") {
//     const [r, s] = sigToRSArrays(sig);

//     return {
//       root: merkleTree.root,
//       pathElements: merkleTree.leafToPathElements[address],
//       pathIndices: merkleTree.leafToPathIndices[address],
//       r: r,
//       s: s,
//       msghash: bigIntToArray(64, 4, BigInt(msghash)),
//       pubkey: pubkeyToXYArrays(pubkey),
//     };
//   } else {
//     return {};
//   }
// }