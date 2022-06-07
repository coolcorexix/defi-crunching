import { Row, Table } from "@coolcorexix/ui-kit";
import axios from "axios";
import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import { CalculateTotalVolumeInputItem } from "backend-feature/calculateTotalVolume";
import { SimplePriceResponse } from "coingecko-api-v3";
import { LoadingSpinner } from "components/LoadingSpinner";
import { ManualAddRow } from "components/ManualAddRow";
import { useCurrentPrice } from "hooks/useCurrentPrice";
import uniq from "lodash/uniq";
import React, { useEffect, useMemo, useState } from "react";
import { computeROIofTrade } from "utils/computeROIofTrade";
import { roundToThreeDigit } from "utils/roundNumber";

const headers = [
  "Date",
  "Side",
  "Pair",
  "From",
  "To",
  "Price at the time ",
  "Current price",
  "ROI",
];

export interface DisplaySpotRow {
  meta: {
    fromCoinId: string;
    toCoinId: string;
  };
  display: {
    executeDate: Date;
    side: "SELL" | "BUY";
    pair: string;
    from: string;
    to: string;
    priceAtTheTime: number;
    currentPrice: any;
    ROIofThisTrade: any;
  };
}

function transformOutputSpotTransaction(
  tx: OutputSpotTransaction
): DisplaySpotRow {
  return {
    meta: {
      fromCoinId: tx.fromCoinId,
      toCoinId: tx.toCoinId,
    },
    display: {
      executeDate: tx.executeDate,
      side: tx.side,
      pair: tx.pair,
      from: `${tx.fromAmount} ${tx.fromTicker}`,
      to: `${tx.toAmount} ${tx.toTicker}`,
      priceAtTheTime: Number(roundToThreeDigit(tx.priceAtTheTime)),
      currentPrice: <LoadingSpinner />,
      ROIofThisTrade: <LoadingSpinner />,
    },
  };
}
const loadingSpinner = <LoadingSpinner />;

function BinancePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [interestedCoinIds, setInterestedCoinIds] = useState<string[]>([]);
  const currentPrices = useCurrentPrice(interestedCoinIds);
  const [isSelected, setIsSelected] = useState(false);
  const [totalExecutedVolume, setTotalExecutedVolume] = useState(null);
  const [rows, setRows] = useState<DisplaySpotRow[]>([]);
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
    axios
      .post<OutputSpotTransaction[]>("/api/processSpot", data, config)
      .then((rs) => {
        const outputSpotTx = rs.data;
        const displayOutputs = outputSpotTx.map((tx) =>
          transformOutputSpotTransaction(tx)
        );
        let coinIds = uniq(
          outputSpotTx.reduce((acc, tx) => {
            acc.push(tx.fromCoinId);
            acc.push(tx.toCoinId);
            return acc;
          }, [])
        );
        setInterestedCoinIds(coinIds);
        setRows(displayOutputs);
        const inputVolumeInputs: CalculateTotalVolumeInputItem[] =
          outputSpotTx.map((tx) => {
            return {
              coindId: tx.fromCoinId,
              amount: tx.fromAmount,
              unixEpochtimeStamp: new Date(tx.executeDate).getTime() / 1000,
            };
          });
        axios
          .post("/api/calculate-total-volume", {
            input: inputVolumeInputs,
          })
          .then((volumeResponse) => {
            if (volumeResponse.status !== 200) {
              console.log(volumeResponse.statusText);
              return;
            }
            setTotalExecutedVolume(volumeResponse.data.totalVolume);
          });
      });
  };

  const rowDisplays = useMemo(() => {
    const rowDisplays = rows.map((row) => {
      return row.display;
    });
    console.log(
      "🚀 ~ file: index.tsx ~ line 127 ~ newRowDisplays ~ currentPrices",
      currentPrices
    );
    const newRowDisplays = rowDisplays.map((rowDisplay, index) => {
      const currentPrice = currentPrices
        ? currentPrices[rows[index].meta.fromCoinId].usd /
          currentPrices[rows[index].meta.toCoinId].usd
        : 0;
      console.log(
        "🚀 ~ file: index.tsx ~ line 131 ~ newRowDisplays ~ currentPrice",
        currentPrice
      );

      return {
        ...rowDisplay,
        currentPrice: roundToThreeDigit(currentPrice),
        ROIofThisTrade: computeROIofTrade({
          ...rowDisplay
        }, currentPrice),
      };
    });
    return newRowDisplays;
  }, [rows, currentPrices]);

  return (
    <div className="m-auto p-4">
      <span className="block text-3xl font-bold mb-4">DoughWatch</span>
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
        <>
          <div>
            <span>
              Total executed volume (in USD):
              <span>
                &nbsp;
                {!!totalExecutedVolume ? (
                  roundToThreeDigit(totalExecutedVolume)
                ) : (
                  <div> {loadingSpinner}</div>
                )}
              </span>
            </span>
          </div>
          <Table>
            <Row isHeading>
              {headers.map((header) => (
                <span key={header}>{header}</span>
              ))}
            </Row>
            <ManualAddRow
              onCreateSuccessfully={(transaction) => {
                setRows([transformOutputSpotTransaction(transaction), ...rows]);
              }}
            />
            {rowDisplays.map((rowDisplay) => {
              return (
                <Row key={rowDisplay.executeDate.toString()}>
                  {Object.values(rowDisplay).map((value, index) => {
                    return <span key={index}>{value}</span>;
                  })}
                </Row>
              );
            })}
          </Table>
        </>
      )}
    </div>
  );
}

export default BinancePage;
