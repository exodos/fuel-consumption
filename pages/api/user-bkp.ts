import { applyMiddleware, getRateLimitMiddlewares } from "@/my-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

const middlewares = getRateLimitMiddlewares({ limit: 10 }).map(applyMiddleware);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await Promise.all(middlewares.map((middleware) => middleware(req, res)));

    const test = "Hello World";

    res.status(200).json({ name: test });
  } catch (err) {
    return res.status(429).send("Too Many Requests");
  }
};

export default handler;
