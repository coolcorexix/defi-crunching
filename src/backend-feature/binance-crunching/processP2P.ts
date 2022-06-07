import fs from "fs";
import { parse } from "csv-parse";
import path from "path";

export interface CSVP2PTransaction {
  "Order Number": string;
  "Order Type": string;
  "Asset Type": string;
  "Fiat Type": string;
  "Total Price": string;
  Price: string;
  Quantity: string;
  Couterparty: string;
  Status: string;
  "Created Time": string;
}

export interface OutputP2PTransaction {
  executeDate: Date;
  fiatAmount: number;
  fiatType: "VND";
  assetAmount: number;
  assetType: string;
}

export async function processP2P(): Promise<any> {
  let outputP2PTx: OutputP2PTransaction[] = [];
  const filePath = path.resolve(process.cwd(), "src/backend-feature/binance-crunching/testdata/l6m-p2p-export.csv");
  const inputP2PTransactions = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });

  const parser = parse({
    delimiter: ",",
    columns: true,
  });
  return new Promise((resolve) => {
    parser.on("readable", function () {
      let record;
      while ((record = parser.read())) {
        outputP2PTx.push({
          executeDate: new Date(record["Created Time"]),
          fiatAmount: parseFloat(record["Total Price"]),
          fiatType: record["Fiat Type"],
          assetAmount: parseFloat(record["Quantity"]),
          assetType: record["Asset Type"],
        });
      }
      resolve(outputP2PTx);
    });

    parser.write(inputP2PTransactions);
  });
}
