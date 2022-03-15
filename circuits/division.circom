template Main() {
  signal private input x1;
  signal private input x2;
  signal private input x3;
  signal private input x4;

  signal y1;
  signal y2;

  signal output out;

  y1 <-- x1 + x2;
  y2 <-- y1 / x3;
  out <-- y2 - x4;

  y1 === x1 + x2;
  y1 === y2 * x3;
  out === y2 - x4;
}

component main = Main();
