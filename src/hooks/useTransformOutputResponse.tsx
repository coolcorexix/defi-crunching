import React, { useEffect, useState } from "react";
import { OutputResponse } from "backend-feature/profit-track/types";
import { DisplayOutputResponse } from "types/DisplayOutputResponse";
import { beautifyDateTime } from "utils/beautifyDateTime";
import { roundNumber } from "utils/roundNumber";

export function useTransformOutputResponse(
  outputResponses: OutputResponse[]
): DisplayOutputResponse[] {
  const [displayOutputResponses, setDisplayOutputResponses] = useState<
    DisplayOutputResponse[]
  >([]);
  useEffect(() => {
    const toSet = outputResponses.map((oR) => {
      const truncatedHash = `${oR.txHash.substring(
        0,
        3
      )}...${oR.txHash.substring(oR.txHash.length - 3)}`;
      const element = (
        <a href={`https://bscscan.com/tx/${oR.txHash}`}>{truncatedHash}</a>
      );
      console.log(
        "🚀 ~ file: useTransformOutputResponse.tsx ~ line 22 ~ toSet ~",
        element
      );
      return {
        displayData: {
          Method: oR.method,
          "Transaction hash": element,
          "Wen?": beautifyDateTime(oR.createdTime),
          "Amount of tokens": roundNumber(oR.amountOfToken, 2),
          "Price at the time": roundNumber(oR.priceAtTheTime, 2),
          "Value in USD": roundNumber(oR.toUSDValue, 2),
          Efficiency: `${roundNumber(
            (oR.efficientComparedToCurrentRate - 1) * 100,
            2
          )}%`,
        },
        meta: {
          id: oR.txHash,
        },
      };
    });
    setDisplayOutputResponses(toSet);
  }, [outputResponses]);
  return displayOutputResponses;
}
