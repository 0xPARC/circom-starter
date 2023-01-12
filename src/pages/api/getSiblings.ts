// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getSiblingsAndPathIndices, verifyAddressInTree} from './helpers/merkle'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

/** 
 * @description: This is the API endpoint for getting the siblings & path indices of an address in a specified merkle tree.
 */

type Data = {
  name: string
  siblings: string[]
  pathIndices: number[]
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
  if (req.method !== 'POST') {
    res.status(405).json({
      name: "GET endpoint", siblings: [], pathIndices: []
    })
  }
  if (typeof req.body == 'string') {
    var body = JSON.parse(req.body)
  } else {
    var body = req.body
  }
  if ("data" in body == false) {
    res.status(400).json({
      name: "no data in body", siblings: [], pathIndices: []
    })
  }
  var data = body.data
  console.log("In API: ", req.body)

  var address, pollId

  // Required fields!
  if ("address" in data == false) {
    res.status(400).json({
      name: "No address to check against", siblings: [], pathIndices: []
    })
  } else {
    address = data.address
  }
  if ("pollId" in data == false) {
    res.status(400).json({
      name: "Must be a valid poll id", siblings: [], pathIndices: []
    })
  } else {
    pollId = data.pollId
  }

  

  var outputData = await getSiblingsAndPathIndices(data.address, data.pollId);
  
  console.log(outputData.siblings)
  console.log(outputData.pathIndices)
  if (outputData.isValidPollId == false) {
    return res.status(400).json({ name: "invalid poll id", siblings: [], pathIndices: [] })
  } else {
    return res.status(200).json({ name: "address in tree", siblings: outputData.siblings, pathIndices: outputData.pathIndices })
  }
  
  
}
