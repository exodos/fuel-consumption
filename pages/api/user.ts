import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

const handler = async (req, res) => {
  const { email, password } = req.body;
  try {
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
    // console.log("Rate limit exceeded");
    // res.status(429).json({ error: "Rate limit exceeded" });
    console.log("Too many requests");
    res.status(429).send("Too many requests");
  }
};

export default handler;
