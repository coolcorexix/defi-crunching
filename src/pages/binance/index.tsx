import { Row, Table } from "@coolcorexix/ui-kit";
import axios from "axios";
import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import { CalculateTotalVolumeInputItem } from "backend-feature/calculateTotalVolume";
import { SimplePriceResponse } from "coingecko-api-v3";
import { LoadingSpinner } from "components/LoadingSpinner";
import { ManualAddRow } from "components/ManualAddRow";
import { TotalGainLossPanel } from "components/TotalGainLossPanel";
import { useCurrentPrice } from "hooks/useCurrentPrice";
import uniq from "lodash/uniq";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
export interface MasterSpotRowMeta {
  fromCoinId: string;
  toCoinId: string;
  exactPriceAtTheTime: number;
  exactCurrentPrice?: any;
  outputWorthInUsd?: number;
  fromAmount: number;
  toAmount: number;
}
export interface MasterSpotRow {
  meta: MasterSpotRowMeta;
  display: {
    executeDate: Date;
    side: "SELL" | "BUY";
    pair: string;
    from: string;
    to: string;
    priceAtTheTime: string;
    currentPrice: any;
    ROIofThisTrade: any;
  };
}

function transformOutputSpotTransaction(
  tx: OutputSpotTransaction
): MasterSpotRow {
  return {
    meta: {
      fromCoinId: tx.fromCoinId,
      toCoinId: tx.toCoinId,
      exactPriceAtTheTime: tx.priceAtTheTime,
      fromAmount: tx.fromAmount,
      toAmount: tx.toAmount,
    },
    display: {
      executeDate: tx.executeDate,
      side: tx.side,
      pair: tx.pair,
      from: `${tx.fromAmount} ${tx.fromTicker}`,
      to: `${tx.toAmount} ${tx.toTicker}`,
      priceAtTheTime: roundToThreeDigit(tx.priceAtTheTime),
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
  const [masterRows, setMasterRows] = useState<MasterSpotRow[]>([]);
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
        const spotOutputs = outputSpotTx.map((tx) =>
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
        setMasterRows(spotOutputs);
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

  const updateMetaOfMasterRow = (
    index: number,
    newMetaData: Partial<MasterSpotRowMeta>
  ) => {
    console.log("this is update on every re-render");
    // does not need to trigger re-render because it is in meta, don't if suitable to useCallback
    masterRows[index].meta = {
      ...masterRows[index].meta,
      ...newMetaData,
    };
  };

  const rowDisplays = useMemo(() => {
    if (!currentPrices || Object.keys(currentPrices).length === 0) {
      return [];
    }
    const rowDisplays = masterRows.map((row) => {
      return row.display;
    });
    console.log(
      "🚀 ~ file: index.tsx ~ line 127 ~ newRowDisplays ~ currentPrices",
      currentPrices
    );
    const newRowDisplays = rowDisplays.map((rowDisplay, index) => {
      console.log(
        "🚀 ~ file: index.tsx ~ line 131 ~ newRowDisplays ~ currentPrice",
        currentPrices
      );
      const currentPrice = currentPrices
        ? currentPrices[masterRows[index].meta.fromCoinId].usd /
          currentPrices[masterRows[index].meta.toCoinId].usd
        : 0;

      updateMetaOfMasterRow(index, {
        exactCurrentPrice: currentPrice,
        outputWorthInUsd:
          currentPrices[masterRows[index].meta.toCoinId].usd *
          masterRows[index].meta.toAmount,
      });

      return {
        ...rowDisplay,
        currentPrice: roundToThreeDigit(currentPrice),
        ROIofThisTrade: computeROIofTrade(
          {
            side: rowDisplay.side,
            priceAtTheTime: masterRows[index].meta.exactPriceAtTheTime,
          },
          currentPrice
        ),
      };
    });
    return newRowDisplays;
  }, [masterRows, currentPrices]);
  const totalWorth = useMemo(() => {
    return masterRows.reduce((acc, el) => {
      return acc + el.meta.outputWorthInUsd;
    }, 0);
  }, [rowDisplays]);

  return (
    <div className="m-auto p-4">
      <span className="block text-3xl font-bold mb-2">DoughWatch</span>
      <span className="block mb-4">
        Get rich, slow and steady. Made by{" "}
        <a
          href="https://twitter.com/phamhuyphat"
          className="text-blue-600"
          target="_blank"
          rel="noreferrer"
        >
          Nemo De Collector
        </a>
      </span>
      <div className="mb-8">
        <div
          style={{
            lineHeight: 1.8,
          }}
        >
          <b>Step 1:</b> Get your spot trading transaction history by following
          this{" "}
          <a
            href="https://www.binance.com/en-AU/support/faq/e4ff64f2533f4d23a0b3f8f17f510eab"
            className="text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            <b>instruction</b>
          </a>
          <br />
          <span>
            <i>
              Please use this app with a timerange below 3 months as we are
              having performance limitation at this early-access version
            </i>
          </span>
        </div>
        <div>
          <div>
            <b>Step 2:</b> Upload your exported <code>.csv</code> file
          </div>
          <input
            className="mt-2 mb-4"
            type="file"
            onChange={changeHandler}
            accept=".csv"
          />
        </div>
        <div>
          <div>
            <b>Step 3:</b> Press the button and wait for the result
          </div>
          <div>
            <div
              className="rounded-md cursor-pointer mb-4 bg-black border border-black mt-2 p-2 w-fit"
              onClick={() => {
                processSpot();
              }}
            >
              <span className="text-white">
                <b>Process</b>
              </span>
            </div>
          </div>
        </div>
        <div>
          <b>Step 4: </b> Spend five more minutes to help us improve this
          application by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://forms.gle/1AaMGfimJ52WmfyN7"
          >
            <b className="text-blue-600">joining our survey</b>
          </a>
        </div>
      </div>

      {masterRows.length !== 0 && (
        <>
          <div className="mb-4">
            <div className="flex w-80 justify-between">
              <b>Total executed volume:</b>
              <span>
                &nbsp;
                {!!totalExecutedVolume ? (
                  roundToThreeDigit(totalExecutedVolume) + " USD"
                ) : (
                  <span> {loadingSpinner}</span>
                )}
              </span>
            </div>
            <div className="flex w-80 justify-between">
              <b>Total worth up to now:</b>
              <span>
                &nbsp;
                {!!totalWorth ? (
                  roundToThreeDigit(totalWorth) + " USD"
                ) : (
                  <span> {loadingSpinner}</span>
                )}
              </span>
            </div>
            <div className="flex w-80 justify-between">
              <b>Margin:</b>
              <div>
                <span>
                  &nbsp;
                  {!!totalWorth && !!totalExecutedVolume ? (
                    roundToThreeDigit(totalWorth - totalExecutedVolume) + " USD"
                  ) : (
                    <span> {loadingSpinner}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <Table>
            <Row isHeading>
              {headers.map((header) => (
                <span key={header}>{header}</span>
              ))}
            </Row>
            <ManualAddRow
              onCreateSuccessfully={(transaction) => {
                setMasterRows([
                  transformOutputSpotTransaction(transaction),
                  ...masterRows,
                ]);
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
