import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { v4 as uuidv4 } from "uuid";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 100 users per second
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const email = req.query.email as string;
  // const password = req.query.password;
  const { email, password } = req.body;
  try {
    await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute
    const checkUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (checkUser) {
      const isValid = await verifyPassword(password, checkUser.password);
      if (!isValid) {
        res.status(403).json("Wrong credentials!!");
      } else {
        const user = {
          id: checkUser.id,
          firstName: checkUser.firstName,
          middleName: checkUser.middleName,
          lastName: checkUser.lastName,
          email: checkUser.email,
          role: checkUser.role,
          mobileNumber: checkUser.mobileNumber,
          adminResetPassword: checkUser.adminResetPassword,
          createdAt: checkUser.createdAt,
          updatedAt: checkUser.updatedAt,
        };
        res.status(200).json(user);
      }
    } else {
      res.status(404).json("User Not Found");
    }
  } catch {
    console.log("Rate limit exceeded");
    res.status(429).json({ error: "Rate limit exceeded" });
  }
};

export default handler;
