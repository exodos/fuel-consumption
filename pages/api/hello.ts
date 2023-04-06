// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // res.status(200).json({ name: 'John Doe' })
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  if (!session) {
    res.status(401).json({ message: "unauthenticated" });
    // next();
  } else {
    res.status(200).json({ name: "John Doe" });
  }
}
