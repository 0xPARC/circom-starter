// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {storePoll} from './helpers/merkle'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

type Data = {
  name: string
  rootHash: string
  pollId: number
  title: string
  deadline: number
}

// Accepts a POST request with a JSON body that is of the form:
// data : {
//   title: title,
//   description: description,
//   groupDescription: groupDescription,
//   createdAt: createdAt,
//   deadline: deadline,
//   addresses: addresses
// 
// }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      name: "POST endpoint!", rootHash: "", pollId: -1, title: "", deadline: -1
    })
  }
  if ("data" in req.body == false) {
    res.status(400).json({
      name: "No data!", rootHash: "", pollId: -1, title: "", deadline: -1
    })
  }
  var data = req.body.data

  var title, description, groupDescription, createdAt, deadline, addresses

  // Required fields!
  if ("title" in data == false) {
    res.status(400).json({
      name: "Add a title!", rootHash: "", pollId: -1, title: "", deadline: -1
    })
  } else {
    title = data.title
  }
  if ("addresses" in data == false) {
    res.status(400).json({
      name: "Must have some addresses!", rootHash: "", pollId: -1, title: "", deadline: -1
    })
  } else {
    addresses = data.addresses
  }

  if ("description" in data == false) {
    description = ""
  } else {
    description = data.description
  }
  if ("groupDescription" in data == false) {
    groupDescription = ""
  } else {
    groupDescription = data.groupDescription
  }
  if ("createdAt" in data == false) {
    createdAt = Date.now()
  } else {
    createdAt = data.groupDescription
  }
  if ("deadline" in data == false) {
    // Fix: Set time to 1 hour from now
    var myDate = new Date()
    myDate.setUTCHours(myDate.getUTCHours() + 1)
    deadline = myDate.getTime()
  } else {
    deadline = data.deadline
  }

  var pollData = await storePoll(title, description, groupDescription, createdAt, deadline, addresses)
  
  
  res.status(200).json({ name: "Success!", rootHash: pollData.rootHash, pollId: pollData.pollId, title: title, deadline: deadline })
}
