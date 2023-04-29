const getIp = (req, res) => {
  const xff = req.headers["x-forwarded-for"];
  //   const ip = xff ? xff.split(",")[0] : "127.0.0.1";
  const ip = xff ? xff.split(",")[0] : req.connection.remoteAddress;
  res.status(200).json(ip);
};

export default getIp;
