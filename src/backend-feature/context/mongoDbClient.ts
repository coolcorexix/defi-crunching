import mongoose, { ConnectionStates, Schema } from "mongoose";

makeSureMongoDbIsConnected();

async function connectMongoose() {
  const dbName = 'defi-crunching';
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGODB_IPADDRESS}:${process.env.MONGODB_PORT}/${dbName}`
    );
  } catch (e) {
    throw new Error(e.toString());
  }
}

let isMongoDbConnected = false;

export interface CoinGeckoAtTheTime {
  namedId?: string;
  platformId: string;
  tokenContractAddress: string;
  unixEpochtimeStamp: number;
  priceInUsd: number;
}

const CoinGeckoPriceAtTheTimeSchema = new Schema({
  namedId: { type: String, index: true },
  platformId: { type: String },
  tokenContractAddress: { type: String },
  unixEpochtimeStamp: { type: Number },
  priceInUsd: { type: Number },
});

export const CoinGeckoPriceAtTheTimeModel = mongoose.model<CoinGeckoAtTheTime>(
  "coinGeckoPrioceAtTheTime",
  CoinGeckoPriceAtTheTimeSchema
);

export const saveCoingeckoPrice = async (
  newCoingeckPrice: CoinGeckoAtTheTime
) => {
  await makeSureMongoDbIsConnected();
  await CoinGeckoPriceAtTheTimeModel.create({
    ...newCoingeckPrice,
    namedId: `${newCoingeckPrice.platformId}-${newCoingeckPrice.tokenContractAddress}-${newCoingeckPrice.unixEpochtimeStamp}`,
  });
};

export const findCoingeckoByNamedId = async (namedId: string) => {
  await makeSureMongoDbIsConnected();
  return CoinGeckoPriceAtTheTimeModel.findOne({
    namedId,
  });
};

async function makeSureMongoDbIsConnected() {
  if (mongoose.connection.readyState === ConnectionStates.disconnected) {
    await connectMongoose();
  }
}
