pragma circom 2.0.3;

include "../../circuits/ecdsa-semaphore.circom";

component main {public [signalHash, externalNullifier]} = ECDSASemaphore(16);
