import {createPoseidonTree} from './merkle'
import axios from 'axios'

async function generatePollinDB(title: string, addresses: string[], description: string, groupDescription: string, createdAt: number, deadline: number) {
    var treeData = await createPoseidonTree(addresses)
    var pollData = await axios.post('/api/generatePoll', {
        title: title,
        addresses: addresses,
        description: description,
        groupDescription: groupDescription,
        createdAt: createdAt,
        deadline: deadline,
        rootHash: treeData.rootHash,
    })
    console.log("In frontend component", pollData)

    return { rootHash: treeData.rootHash, pollId: pollData.data.pollId }
}

export {generatePollinDB}
