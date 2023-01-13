pragma circom 2.0.3;

// template Num2Bits(n) {
//     signal input in;
//     signal output out[n];
//     var lc1=0;

//     var e2=1;
//     for (var i = 0; i<n; i++) {
//         out[i] <-- (in >> i) & 1;
//         out[i] * (out[i] -1 ) === 0;
//         lc1 += out[i] * e2;
//         e2 = e2+e2;
//     }

//     lc1 === in;
// }


template Split4(a, b, c, d) {
    signal input in;

    signal chunk1;
    signal chunk2;
    signal chunk3;
    signal chunk4;

    signal output chunks[4];

    // signal output b_chunk1[a];
    // signal output b_chunk2[b];
    // signal output b_chunk3[c];
    // signal output b_chunk4[d];

    chunk1 <-- in % (1 << a);
    chunk2 <-- (in \ (1 << a)) % (1 << b);
    chunk3 <-- (in \ (1 << a + b)) % (1 << c);
    chunk4 <-- in \ (1 << a + b + c);

    in === chunk1 + chunk2 * (1 << a) + chunk3 * (1 << a + b) + chunk4 * (1 << a + b + c);

    chunks[0] <== chunk1;
    chunks[1] <== chunk2;
    chunks[2] <== chunk3;
    chunks[3] <== chunk4;

    // log(chunks[0]);

    // nonlinear constraint needed for circuit to compile succesfully
    signal dummy;
    dummy <== chunk1 * chunk2;

}

<<<<<<< HEAD
// component main = Split4(64,64,64,64);
=======
>>>>>>> beea02666f1a9df73db89dfc208e1b7d0039143e
