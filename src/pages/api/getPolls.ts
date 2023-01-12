// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma';

/** 
 * @description: This is the API endpoint for getting the siblings & path indices of an address in a specified merkle tree.
 */

type PollOutput = {
  id: number,
  title: string,
  groupDescription: string,
  description: string,
  createdAt: Date,
  deadline: Date,
}

type Data = {
    name: string,
    polls: PollOutput[]
}

/** 
 * @function: handler
 * @description: This is the handler for the API endpoint.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      name: "GET endpoint", polls: []
    })
  }


  var pollsReceived = prisma.poll.findMany()
  console.log(pollsReceived)
  return {name: "Got polls", polls: pollsReceived}
}
