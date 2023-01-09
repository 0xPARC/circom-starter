pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";

// Hash identityNullifier and identityTrapdoor using the the Poseidon hash function
template CalculateSecret() {
    // User's nullifier: ETH private key
    signal input identityNullifier;
    // Leave this null
    signal input identityTrapdoor;

    signal output out;

    component poseidon = Poseidon(2);

    poseidon.inputs[0] <== identityNullifier;
    poseidon.inputs[1] <== identityTrapdoor;

    out <== poseidon.out;
}


// Hash secret using the Poseidon hash function (future: public key)
template CalculateIdentityCommitment() {
    // secret = private key
    signal input secret;

    signal output out;

    component poseidon = Poseidon(1);

    poseidon.inputs[0] <== secret;

    out <== poseidon.out;
}

// Hash externalNullifier and identityNullifier using the Poseidon hash function
template CalculateNullifierHash() {
    // Poll id
    signal input externalNullifier;
    // User's private key
    signal input identityNullifier;

    signal output out;

    component poseidon = Poseidon(2);

    poseidon.inputs[0] <== externalNullifier;
    poseidon.inputs[1] <== identityNullifier;

    out <== poseidon.out;
}

// nLevels must be < 32.
template Semaphore(nLevels) {
    // Private key
    signal input identityNullifier;
    // Null
    signal input identityTrapdoor;
    // Indices of the path of the merkle tree to this leaf
    signal input treePathIndices[nLevels];
    // Siblings up the path
    signal input treeSiblings[nLevels];
    // Vote - yes or no
    signal input signalHash;
    // Poll id
    signal input externalNullifier;

    signal output root;
    signal output nullifierHash;

    component calculateSecret = CalculateSecret();
    calculateSecret.identityNullifier <== identityNullifier;
    calculateSecret.identityTrapdoor <== identityTrapdoor;

    signal secret;
    secret <== calculateSecret.out;

    component calculateIdentityCommitment = CalculateIdentityCommitment();
    calculateIdentityCommitment.secret <== secret;

    component calculateNullifierHash = CalculateNullifierHash();
    calculateNullifierHash.externalNullifier <== externalNullifier;
    calculateNullifierHash.identityNullifier <== identityNullifier;

    component inclusionProof = MerkleTreeInclusionProof(nLevels);
    inclusionProof.leaf <== calculateIdentityCommitment.out;

    for (var i = 0; i < nLevels; i++) {
        inclusionProof.siblings[i] <== treeSiblings[i];
        inclusionProof.pathIndices[i] <== treePathIndices[i];
    }

    root <== inclusionProof.root;

    // Dummy square to prevent tampering signalHash.
    signal signalHashSquared;
    signalHashSquared <== signalHash * signalHash;

    nullifierHash <== calculateNullifierHash.out;
}

component main {public [signalHash, externalNullifier]} = Semaphore(0);