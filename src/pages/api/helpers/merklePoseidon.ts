// NOTE: copied from personaelabs/data because I(@lsankar4033) don't know how to npm typescript

const buildPoseidon = require("circomlibjs").buildPoseidon;

var poseidon;
let F;

// NOTE: picked this as the null field element arbitrarily
const NULL_NODE = 1n;
async function verifyInTree(
    root: string,
    address: string,
    siblings: string[],
    pathIndices: string[],
) {
    poseidon = await buildPoseidon();
    F = poseidon.F;
    const rootBigInt = BigInt(root);
    console.log(rootBigInt)
    const addressBigInt = BigInt(address);
    const siblingsBigInt = siblings.map(BigInt);
    // console.log(siblingsBigInt)
    const pathIndicesBigInt = pathIndices.map(BigInt);
    // console.log(pathIndicesBigInt)

    let curHash = addressBigInt;
    console.log("Cur Hash: ", curHash)
    for (let i = 0; i < siblingsBigInt.length; i++) {
        if (pathIndicesBigInt[i] === 0n) {
            curHash = F.toObject(poseidon([curHash, siblingsBigInt[i]]));
        } else {
            curHash = F.toObject(poseidon([siblingsBigInt[i], curHash]));
        }
        console.log("Cur Hash: ", curHash)
    }
    var isEqual = curHash.toString() == rootBigInt.toString()
    return isEqual;
}

// NOTE: default tree depth based on dao hack confessions
async function buildTreePoseidon(
    leaves: any,
    depth = 16,
    proof_depth = 16,           
    nullNode = NULL_NODE
    ) {
    //   if (!poseidon) {
    //     poseidon = await buildPoseidon();
    //     F = poseidon.F;
    //   }
    poseidon = await buildPoseidon();
    F = poseidon.F;
    // pad with nullNode to guarantee a tree of the desired depth
    const requiredLeaves = 2 ** depth;
    if (leaves.length < requiredLeaves) {
        leaves = leaves.concat(
        Array(requiredLeaves - leaves.length).fill(nullNode)
        );
    }

    leaves = leaves.map(BigInt);
    leaves.sort();

    // the equivalent of pathElements and pathIndices in merkle.circom
    const outputLeaves = leaves.filter((w: any) => w !== nullNode);
    // console.log(outputLeaves)
    let leafToPathElements = Object.fromEntries(outputLeaves.map((w: any) => [w, []]));
    let leafToPathIndices = Object.fromEntries(outputLeaves.map((w: any) => [w, []]));

    let nodeToLeaves = Object.fromEntries(leaves.map((w: any) => [w, [w]]));
    let curLevel = leaves;
    while (curLevel.length > 1) {
        let newLevel = [];

        for (let i = 0; i < curLevel.length; i += 2) {
            // console.log(curLevel[i])
            let child1 = curLevel[i];
            let child2 = i == curLevel.length - 1 ? nullNode : curLevel[i + 1];

            let child1Leaves = nodeToLeaves[child1];
            let child2Leaves = child2 == nullNode ? [] : nodeToLeaves[child2];

            for (const leaf of child1Leaves) {
                if (leaf !== nullNode) {
                    leafToPathElements[leaf].push(child2);
                    leafToPathIndices[leaf].push("0");
                }
            }

            for (const leaf of child2Leaves) {
                if (leaf !== nullNode) {
                    leafToPathElements[leaf].push(child1);
                    leafToPathIndices[leaf].push("1");
                }
            }

            let poseidonRes = poseidon([child1, child2]);
            let parent = F.toObject(poseidonRes);

            nodeToLeaves[parent] = child1Leaves.concat(child2Leaves);

            newLevel.push(parent);
        }

        curLevel = newLevel;
    }

    for (const leaf in leafToPathElements) {
        while (leafToPathElements[leaf].length < proof_depth) {
            leafToPathElements[leaf].push(nullNode);
            leafToPathIndices[leaf].push("0");
        }
    }

    return {
        root: curLevel[0],
        leafToPathElements,
        leafToPathIndices,
    };
}

export { buildTreePoseidon, verifyInTree };