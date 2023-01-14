// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MerkleTree } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

/**
 * @description: This is the API endpoint for getting the siblings & path indices of an address in a specified merkle tree.
 */

type Data = {
  tree: MerkleTree|null;
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
  var body = req.body;
  console.log("In API: ", body);
    //   console.log("INPUT", typeof b.data.id)
  //   var outputData = await getSiblingsAndPathIndices(data.address, data.pollId);
  const tree = await prisma.merkleTree.findUnique({
    where: {
      id: Number(body.pollId),
    },
  });

  if (tree != null) {

    res.status(200).json({
        tree: tree
      });
  } else {
    res.status(400).json({
        tree: tree
    });
  }
}
