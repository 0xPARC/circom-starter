# circom-starter

A basic circom project that verifies that a private preimage hashes to a claimed hash.

## prereqs

`yarn` to install dependencies

## Building assets

After you edit a circom file like `hash/circuit.circom`, you'll need to recompile circuits, generate zkey (deterministic), generate a proof for the `input.json` input, and verify the proof.

Theres three ways to build:

- Use `yarn dev`
- Use vscode npm scripts explorer [run button](https://user-images.githubusercontent.com/38270282/90230165-68adf100-de19-11ea-9ac8-e23173d962a0.gif)
- `ctrl-shift-b` in vscode

Irrelevant intermediate build files are gitignored and don't need to be checked in.

### Warning

This method for development only. These assets can't be used for production as they're created with a deterministic secret that we've checked into the directory (the .env file) and thus isn't very secret anymore. However the benefit of this is allowing you to visually audit changes during commit and pull request process.

## extending with more circuits

- Create a new directory for your new circuit, lets say hash2
- Add hash2 after hash in the package.json dev script as a comma seperated list `hash,hash2`
- add a hash2_beacon entry the .env file
