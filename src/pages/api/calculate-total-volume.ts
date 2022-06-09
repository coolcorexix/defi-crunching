import { calculateTotalVolume } from "backend-feature/calculateTotalVolume";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const apiCalculateTotalVolumeRoute = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    console.trace(error);
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).post(async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    totalVolume: await calculateTotalVolume(req.body.input),
  });
});

export default apiCalculateTotalVolumeRoute;
