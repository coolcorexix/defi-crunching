import mongoose, {
  Connection,
  ConnectionStates,
  Model,
  Schema,
} from "mongoose";

export interface CoinGeckoAtTheTime {
  namedId?: string;
  platformId: string;
  tokenContractAddress: string;
  unixEpochtimeStamp: number;
  priceInUsd: number;
}

let connection: Connection;
let coinGeckoPriceAtTheTimeModel: Model<CoinGeckoAtTheTime>;

// Next.js don't have a index entry file to do this so here we are. Doing ad-hoc
makeSureMongoDbIsConnected();

function initMongoDbInstances(dbName: string) {
  if (!connection) {
    connection = mongoose.createConnection(
      `mongodb://${process.env.MONGODB_USERNAME_2}:${process.env.MONGODB_PASS_2}@${process.env.MONGODB_IPADDRESS}:${process.env.MONGODB_PORT}`,
      {
        dbName,
      }
    );
  }
  if (!coinGeckoPriceAtTheTimeModel) {
    const CoinGeckoPriceAtTheTimeSchema = new Schema({
      namedId: { type: String, index: true },
      platformId: { type: String },
      tokenContractAddress: { type: String },
      unixEpochtimeStamp: { type: Number },
      priceInUsd: { type: Number },
    });
    coinGeckoPriceAtTheTimeModel = connection.model<CoinGeckoAtTheTime>(
      "coinGeckoPriceAtTheTime",
      CoinGeckoPriceAtTheTimeSchema
    );
  }
}

// This will also start fresh once flushing data

async function connectMongoose(dbName: string) {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGODB_USERNAME_2}:${process.env.MONGODB_PASS_2}@${process.env.MONGODB_IPADDRESS}:${process.env.MONGODB_PORT}`,
      {
        dbName,
      }
    );
  } catch (e) {
    throw new Error(e.toString());
  }
}

export const saveCoingeckoPrice = async (
  newCoingeckPrice: CoinGeckoAtTheTime
) => {
  await makeSureMongoDbIsConnected();
  await getCoinGeckoPriceAtTheTimeModel().create({
    ...newCoingeckPrice,
  });
};

export const findCoingeckoByNamedId = async (namedId: string) => {
  await makeSureMongoDbIsConnected();

  return getCoinGeckoPriceAtTheTimeModel().findOne({
    namedId,
  });
};

function getCoinGeckoPriceAtTheTimeModel() {
  return coinGeckoPriceAtTheTimeModel;
}

async function makeSureMongoDbIsConnected() {
  const dbName = "defi-crunching";
  if (mongoose.connection.readyState === ConnectionStates.disconnected) {
    await connectMongoose(dbName);
  }
  initMongoDbInstances(dbName);
}
