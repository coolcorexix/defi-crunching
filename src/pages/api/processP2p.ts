import { OutputP2PTransaction, processP2P } from 'backend-feature/binance-crunching/processP2P'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<OutputP2PTransaction[]>
  ) {
    res.status(200).json(await processP2P())
  }
  