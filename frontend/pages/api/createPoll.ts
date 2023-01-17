// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/** 
 * @description: This is the API endpoint for generating and storing a poll in the DB.
*/

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

type Data = {
  name: string
  rootHash: string
  pollId: number
}

/** 
 * @function: handler
 * @description: This is the handler for the API endpoint.
 * @param {string} req.body.data.title - The title of the poll.
 * @param {[]string} req.body.data.addresses - The addresses that can vote in the poll.
 * @param {string} req.body.data.description - The description of the poll.
 * @param {string} req.body.data.groupDescription - The description of the group.
 * @param {number} req.body.data.createdAt - The time the poll was created.
 * @param {number} req.body.data.deadline - The deadline of the poll.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      name: "POST endpoint!", rootHash: "", pollId: -1
    })
  }
  var body = req.body
  // console.log("Generating poll: ", req.body)


  var title, description, groupDescription, createdAt, deadline, addresses, rootString
  title = body.title
  description = body.description
  groupDescription = body.groupDescription
  createdAt = body.createdAt
  deadline = body.deadline
  addresses = body.addresses
  rootString = body.rootHash


  var poll = await prisma.poll.create({
    data : {
        title: title,
        description: description,
        groupDescription: groupDescription,
        createdAt: new Date(createdAt),
        deadline: new Date(deadline),
        tree: {
            create: {
                rootHash: rootString,
                leaves: addresses,
            }
            
        }
    }
  })
  
  res.status(200).json({ name: "Success!", rootHash: rootString, pollId: poll.id })
}
