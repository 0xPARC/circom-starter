// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

/**
 * @description: This is the API endpoint for getting the siblings & path indices of an address in a specified merkle tree.
 */

type Data = {
  name: string;
  id: number;
  title: string;
  groupDescription: string;
  description: string;
  createdAt: string;
  deadline: string;
  active: boolean;
};
// type Data = {
//   name: string
//   poll: PollOutput
// }

/**
 * @function: handler
 * @description: This is the handler for the API endpoint.
 * @param {number} req.body.data.pollId - The poll id to check against.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({
      name: "GET endpoint",
      id: -1,
      title: "",
      groupDescription: "",
      description: "",
      createdAt: "",
      deadline: "",
      active: false,
    });
  }
//   if (typeof req.body == "string") {
//     var body = JSON.parse(req.body);
//   } else {
//     var body = req.body;
//   }
//   if ("data" in body == false) {
//     res.status(400).json({
//       name: "no data in body",
//       id: -1,
//       title: "",
//       groupDescription: "",
//       description: "",
//       createdAt: "",
//       deadline: "",
//       active: false,
//     });
//   }
//   var data = body.data;
  console.log("In API: ", JSON.parse(req.body));
  const b = JSON.parse(req.body)

  var pollId;

  // Required fields!
  if (!b.data.id) {
    res.status(400).json({
      name: "No pollId to check against",
      id: -1,
      title: "",
      groupDescription: "",
      description: "",
      createdAt: "",
      deadline: "",
      active: false,
    });
  } else {
    // pollId = data.pollId;
  }
console.log("INPUT", typeof b.data.id)
  //   var outputData = await getSiblingsAndPathIndices(data.address, data.pollId);
  const poll = await prisma.poll.findUnique({
    where: {
      id: Number(b.data.id),
    },
  });

  if (poll != null) {

    res.status(200).json({
        name: "poll found!",
        id: poll.id,
        title: poll.title,
        groupDescription: poll.groupDescription,
        description: poll.description,
        createdAt: poll.createdAt.toString(),
        deadline: poll.deadline.toString(),
        active: Date.now() < poll.deadline.getTime(),
      });
  } else {
    res.status(400).json({
      name: "no poll found",
      id: -1,
      title: "",
      groupDescription: "",
      description: "",
      createdAt: "",
      deadline: "",
      active: false,
    });
  }
}
