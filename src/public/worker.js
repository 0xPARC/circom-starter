importScripts('./snarkjs.min.js');
self.addEventListener("message", async (evt) => {
  console.log("web worker recieved message");
  const [input, zkeyFastFile] = evt.data;
  const result = await snarkjs.groth16.fullProve(
    input,
    "/semaphore.wasm",
    "/semaphore.zkey"
  );
  postMessage(result);
});
// Test for 101
// const snarkjs = require('./snarkjs.min.js');
// async function main() {
//     console.log("web worker recieved message");
//     // const [input] = evt.data;
//     const input = [
//         '16518241410077069184316418139380127437412895805516206790019586567553160215710',
//         '11930342394762824889157752050798695950739818303850641740709496031777325342766',
//         '3184414189517536501553605791082098738134591302600668422300863487771169001400',
//         '19992775867993257100752837506232916111291190837616160641988230449887225605924',
//         '10665653757254009383509200014602489370232060512107982215997219542093677070915',
//         '12223260395499039990307914332210098788638546164940087051886592197118667248075',
//         '14355285995156514807828055449942187166668150547325294191067266302748950593676',
//         '19907330770615430146456400405095018600734218320181515389982949532075311843540'
//     ]
//     const result = await snarkjs.groth16.fullProve(
//     input,
//     "/semaphore.wasm",
//     "/semaphore.zkey"
//     );
//     return result
// }

// main().then((result) => {
//     console.log(result)
// })
// postMessage(result);