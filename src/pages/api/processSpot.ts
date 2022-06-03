import {
  OutputSpotTransaction,
  processSpot,
} from "backend-feature/binance-crunching/processSpot";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nc({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})
  .use(upload.single("file"))
  .post(
    async (
      req: NextApiRequest & { file: any },
      res: NextApiResponse<OutputSpotTransaction[]>
    ) => {
      const csvFile = req.file;
      res.status(200).json(await processSpot(csvFile.buffer.toString()));
    }
  );

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
