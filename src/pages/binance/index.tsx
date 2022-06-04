import { Row, Table } from "@coolcorexix/ui-kit";
import axios from "axios";
import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import React, { useState } from "react";
import { roundToThreeDigit } from "utils/roundNumber";

const headers = [
  "Date",
  "Side",
  "Pair",
  "From",
  "To",
  "Price at the time ",
  "Current price",
  "GROTD",
];
function BinancePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [rows, setRows] = useState([]);
  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };
  const processSpot = () => {
    let data = new FormData();

    data.append("name", "transaction-history.csv");
    data.append("file", selectedFile);
    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios.post("/api/processSpot", data, config).then((rs) => {
      const outputP2PTx = rs.data;
      const displayOutputs = outputP2PTx.map((tx: OutputSpotTransaction) => {
        return {
          buyDate: tx.buyDate,
          side: tx.side,
          pair: tx.pair,
          from: `${tx.fromAmount} ${tx.fromTicker}`,
          to: `${tx.toAmount} ${tx.toTicker}`,
          priceAtTheTime: roundToThreeDigit(tx.priceAtTheTime),
          currentPrice: roundToThreeDigit(tx.currentPrice),
          growthRateOnThisTrade: tx.growthRateOnThisTrade,
        };
      });
      setRows(displayOutputs);
    });
  };
  return (
    <div className="m-auto p-2">
      <div>
        <b>Step 1:</b> Get your spot trading transaction history by following
        this{" "}
        <a
          href="https://www.binance.com/en-AU/support/faq/e4ff64f2533f4d23a0b3f8f17f510eab"
          target="_blank"
          rel="noreferrer"
        >
          instruction
        </a>
      </div>
      <div>
        <div>
          <b>Step 2:</b> Upload your exported <code>.csv</code> file
        </div>
        <input type="file" onChange={changeHandler} accept=".csv" />
      </div>
      <div>
        <div>
          <b>Step 3:</b> Press the button and wait for the result
        </div>
        <div>
          <button
            onClick={() => {
              processSpot();
            }}
          >
            [Process]
          </button>
        </div>
      </div>
      {rows.length !== 0 && (
        <Table>
          <Row isHeading>
            {headers.map((header) => (
              <span key={header}>{header}</span>
            ))}
          </Row>
          {rows.map((row) => {
            return (
              <Row key={row.buyDate}>
                {Object.values(row).map((value, index) => {
                  return <span key={index}>{value}</span>;
                })}
              </Row>
            );
          })}
        </Table>
      )}
    </div>
  );
}

export default BinancePage;
