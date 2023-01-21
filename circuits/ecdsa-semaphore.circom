pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";
include "./packages/circom-ecdsa/circuits/eth_addr.circom";


// hash externalNullifier and identityNullifier using the Poseidon hash function
// modified to take in split private key
template CalculateNullifierHash() {
    // poll id
    signal input externalNullifier;
    // user's private key
    signal input splitIdentityNullifier[4];
    // output nullifierHash
    signal output out;

    component poseidon = Poseidon(5);
    poseidon.inputs[0] <== externalNullifier;
    for (var i = 1; i < 5; i++) {
        poseidon.inputs[i] <== splitIdentityNullifier[i-1];
    }

    out <== poseidon.out;
}

// nLevels must be < 32.
template ECDSASemaphore(nLevels) {
    // private key split into 4 64-bit chunks (b/c working over 254-bit prime field)
    signal input splitIdentityNullifier[4];

    // indices of the path of the merkle tree to this leaf
    signal input treePathIndices[nLevels];
    // siblings up the path
    signal input treeSiblings[nLevels];
    // vote - yes or no
    signal input signalHash;
    // poll id
    signal input externalNullifier;

    signal output root;
    signal output nullifierHash;


    component privToPub = PrivKeyToAddr(64, 4);
    privToPub.privkey <== splitIdentityNullifier;
    signal address;
    address <== privToPub.addr;

    // bug #1 in semaphore - check that public address != 0 (otherwise can provide false proof of membership in sparse merkle tree)
    // not actually a big issue since we're using privtopub -> the user would have to find the private key to the 0 public address
    component isZero = IsZero();
    isZero.in <== address;
    signal isAddressZero;
    isAddressZero <== isZero.out;
    isAddressZero === 0;

    component calculateNullifierHash = CalculateNullifierHash();
    calculateNullifierHash.externalNullifier <== externalNullifier;
    calculateNullifierHash.splitIdentityNullifier <== splitIdentityNullifier;

    component inclusionProof = MerkleTreeInclusionProof(nLevels);
    inclusionProof.leaf <== address;

    for (var i = 0; i < nLevels; i++) {
        inclusionProof.siblings[i] <== treeSiblings[i];
        inclusionProof.pathIndices[i] <== treePathIndices[i];
    }

    root <== inclusionProof.root;

    // dummy square to prevent tampering signalHash (i.e. cannot replay proof with different vote signalHash).
    signal signalHashSquared;
    signalHashSquared <== signalHash * signalHash;

    nullifierHash <== calculateNullifierHash.out;
}

// component main {public [signalHash, externalNullifier]} = Semaphore(16);