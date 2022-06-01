import { OutputSpotTransaction, processSpot } from 'backend-feature/binance-crunching/processSpot'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<OutputSpotTransaction[]>
  ) {
    res.status(200).json(await processSpot())
  }
  