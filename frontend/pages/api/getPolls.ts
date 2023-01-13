// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Poll } from '@prisma/client';
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
  createdAt: string,
  deadline: string,
  active: boolean
}

type Data = {
    name: string,
    polls: PollOutput[]
}

function mapPolls(polls: Poll[]) {
  return polls.map(poll => {
    return {
      id: poll.id,
      title: poll.title,
      groupDescription: poll.groupDescription,
      description: poll.description,
      createdAt: new Date(poll.createdAt).toUTCString(),
      deadline: new Date(poll.deadline).toUTCString(),
      active: Date.now() < poll.deadline.getTime()
    };
  });
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

  var pollsReceived = await prisma.poll.findMany()
  const pollOutputs = mapPolls(pollsReceived);
  console.log(pollOutputs);

  res.status(200).json({name: "Got polls", polls: pollOutputs});
}
