// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {verifyAddressInTree} from './helpers/merkle'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

/** 
 * @description: This is the API endpoint for verifying an address in a merkle tree.
 */

type Data = {
  name: string
  inTree: boolean
  pollId: number
}

/** 
 * @function: handler
 * @description: This is the handler for the API endpoint.
 * @param {string} req.body.data.address - The address to check against.
 * @param {number} req.body.data.pollId - The poll id to check against.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      name: "GET endpoint", inTree: false, pollId: -1
    })
  }
  if ("data" in req.body == false) {
    res.status(400).json({
      name: "No data", inTree: false, pollId: -1
    })
  }
  var data = req.body.data

  var address, pollId

  // Required fields!
  if ("address" in data == false) {
    res.status(400).json({
      name: "No address to check against", inTree: false, pollId: -1})
  } else {
    address = data.address
  }
  if ("pollId" in data == false) {
    res.status(400).json({
      name: "Must be a valid poll id", inTree: false, pollId: -1
    })
  } else {
    pollId = data.pollId
  }

  

  var outputData = await verifyAddressInTree(data.address, data.pollId)

  if (outputData.isValidPollId == false) {
    return res.status(400).json({ name: "invalid poll id", inTree: false, pollId: pollId })
  } else {
    if (outputData.inTree == true) {
      return res.status(200).json({ name: "address in tree", inTree: true, pollId: pollId })
    } else {
      return res.status(200).json({ name: "address not in tree", inTree: false, pollId: pollId })
    }
  }
  
  
}
