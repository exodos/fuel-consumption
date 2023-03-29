import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const navigation = [
    { name: "Dash Board", href: "/", icon: "FaHome", current: true },
    {
      name: "Consumption",
      href: "/admin/users",
      icon: "FaUserFriends",
      current: false,
    },
  ];
  res.send(navigation);
};

export default handler;
