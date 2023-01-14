# zkPoll

zkPoll is an Ethereum-compatible anonymous polling application. Polls are launched to a subset of ETH users, who can each anonymously vote in the poll using zero-knowledge proofs.

[Semaphore](https://semaphore.appliedzkp.org/) identities allow users to prove their membership of a group and send signals without revealing their original identity. zkPoll integrates the `Semaphore` circuit with [Circom-ECDSA](https://github.com/0xPARC/circom-ecdsa) `PrivToPub` circuit for Ethereum-compatibility. Instead of generating an independent Semaphore secret and identity commitment, ETH users can simply use their private and public keypair.

### Benefits of a Ubiquitous Identity

**Convenience:** Poll participants do not need to generate new semaphore secrets, which reduces the resistance to voting and can garner more widespread poll results.

**Subgroup Polls:** Poll coordinators can pass in a merkle root of an arbitrary ETH subgroup (e.g. a merkle root of all ETH users who have interacted with a certain protocol or hold a certain token).

**Anonymity Set:** Anonymity is limited to the size of the anonymity set. Subgroup polls enables larger polls. While all users in a merkle tree may not necessarily vote, this can expand the anonymity set.

## Flow

1. A poll coordinator authenticates to the dApp and creates a poll in the smart contract, passing in a merkle root of the public addresses in the ETH subgroup.
2. Poll participants generate a zero-knowledge proof that *“I know some* `eth_priv_key` *corresponding to an* `eth_pub_key` *contained in the merkle tree.”* The particiapant submits `{vote, nullifier, proof}` to the smart contract.
3. The voter’s `eth_pub_key` is nullified in the smart contract upon proof submission to prevent double-voting.
4. Users can see the state of each poll (read from the smart contract). In this way, a group’s poll results are generated without revealing who voted for what.

## Future Work

### Merkle Exclusion Proofs

Currently our polling smart contract stores a hash table of all the nullifiers passed in with votes. This is expensive to store on-chain, so an alternative is to instead have the user directly generate an exclusion proof that their nullifier has not been submitted before. This proof generation is only happening on the user’s frontend.

The idea is that for each poll, our DB would store a dynamic 2-3 Merkle tree with previously submitted nullifiers as leaves. An exclusion proof that a user’s nullifier x is not in the tree would then consist of:

- A pair of adjacent leaves $y$, $z$ in the tree such that $y < x < z$
- An inclusion proof for both $y$ and $z$

The user could then provide a (non-ZK) proof of a valid insertion of their nullifier $x$ into the 2-3 Merkle tree DB.

### Signatures vs. Private Keys

Currently, users must pass in their private key into the circuit to prove ownership of their public address as well as calculate their nullifier. While burner wallets can be used, we can leverage the concept of digital signatures as a commitment of identity. [Recent work](https://github.com/zk-nullifier-sig/zk-nullifier-sig) allows users to generate a signature that can be verified using only the public key, is also impossible to forge without knowledge of the private key, and keeps the private identity secret. This signature has both a deterministic portion and a nondeterministic portion. The benefits of both are:

- The deterministic portion also serves as the nullifier passed in with a user’s vote. A user cannot submit a vote twice with distinct nullifiers that are both valid.
- The nondeterministic portion is also required in order to verify the signature with a public key. This ensures that an attacker cannot just try to verify a public nullifier with all the public keys in order to reveal the voter’s identity.

The user would then submit their entire signature (both the deterministic and nondeterministic portions) as well as their public key as private inputs to the circuit. They could then generate a proof that their signature was verified, and thus that they have the private key corresponding to their public address.  

One drawback is that current mainstream wallet providers do not generate this signature. Until that is the case, users would still need to pass in a private key in order to generate this signature. Alternatively, a [MetaMask Snap](https://metamask.io/snaps/) could be used to enable this, but users would need to install the Snap.

### Weighted Voting

Currently, users must pass in a private key corresponding to the public address. While burner wallets can be used, it would be convenient to simple generate a deterministic signature for each user. [Recent work](https://github.com/zk-nullifier-sig/zk-nullifier-sig) allows users to generate a signature that uniquely identifies the keypair, while keeping the account identity secret. One drawback is that current mainstream wallet providers do not generate this signature. Until that is the case, users would still need to pass in a private key. Alternatively, a [MetaMask Snap](https://ethbogota-2022.netlify.app/) could be used to enable this, but users would need to install the Snap.

## Resources

[Semaphore](https://semaphore.appliedzkp.org/)

[Circom-ECDSA](https://github.com/0xPARC/circom-ecdsa)

[Verifiably Deterministic Signatures on ECDSA](https://github.com/zk-nullifier-sig/zk-nullifier-sig), [Paper](https://eprint.iacr.org/2022/1255), [Snap](https://ethbogota-2022.netlify.app/)

[Circom Starter](https://github.com/0xPARC/circom-starter)
