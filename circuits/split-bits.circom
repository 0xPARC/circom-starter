pragma circom 2.0.3;

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;

    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }

    lc1 === in;
}


template Split4(a, b, c, d) {
    signal input in;
    signal chunk1;
    signal chunk2;
    signal chunk3;
    signal chunk4;

    signal output b_chunk1[a];
    signal output b_chunk2[b];
    signal output b_chunk3[c];
    signal output b_chunk4[d];

    chunk1 <-- in % (1 << a);
    chunk2 <-- (in \ (1 << a)) % (1 << b);
    chunk3 <-- (in \ (1 << a + b)) % (1 << c);
    chunk4 <-- in \ (1 << a + b + c);

    in === chunk1 + chunk2 * (1 << a) + chunk3 * (1 << a + b) + chunk4 * (1 << a + b + c);

    component n2b_chunk1 = Num2Bits(a);
    n2b_chunk1.in <== chunk1;
    b_chunk1 <== n2b_chunk1.out;

    component n2b_chunk2 = Num2Bits(b);
    n2b_chunk2.in <== chunk2;
    b_chunk2 <== n2b_chunk2.out;

    component n2b_chunk3 = Num2Bits(c);
    n2b_chunk3.in <== chunk3;
    b_chunk3 <== n2b_chunk3.out;

    component n2b_chunk4 = Num2Bits(d);
    n2b_chunk4.in <== chunk4;
    b_chunk4 <== n2b_chunk4.out;

}

component main = Split4(1,1,1,1);
