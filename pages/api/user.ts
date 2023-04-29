import { applyMiddleware, getRateLimitMiddlewares } from "@/my-middleware";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

const middlewares = getRateLimitMiddlewares({ limit: 10 }).map(applyMiddleware);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  try {
    await Promise.all(middlewares.map((middleware) => middleware(req, res)));
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
      res.status(404).json("Wrong credentials!!");
    }
  } catch {
    return res.status(429).send("Too Many Requests");
  }
};

export default handler;
