// importScripts('./snarkjs.min.js');
self.addEventListener("message", async (evt) => {
  console.log("web worker recieved message");
  // const [input] = evt.data;
  // const result = await snarkjs.groth16.fullProve(
  //   input,
  //   "./semaphore.wasm",
  //   "./semaphore.zkey"
  // );
  // postMessage(result);
});