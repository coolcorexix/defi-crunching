import React, { useEffect, useMemo, useState } from "react";
import { splitNumberAndAlphabet } from "backend-feature/utils/splitAtFirtAlphabet";
import { roundNumber, roundToThreeDigit } from "utils/roundNumber";
import { ManualSpotTransactionBody } from "pages/api/manual-spot-transaction";
import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import axios from "axios";
import { Row } from "@coolcorexix/ui-kit";

export function TransactionInput(props: {
  onCreateSuccessfully: (transaction: OutputSpotTransaction) => void;
}) {
  const [pair, setPair] = useState({
    from: {
      char: "",
      num: 0,
    },
    to: {
      char: "",
      num: null,
    },
  });
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [dateTimeUTCValue, setDateTimeUTCValue] = useState<Date>(new Date());
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const priceAtTheTime = useMemo<number>(() => {
    return pair.to.num / pair.from.num;
  }, [pair]);
  const manualTransactionBody = useMemo<ManualSpotTransactionBody>(() => {
    console.log(
      "🚀 ~ file: TransactionInput.tsx ~ line 40 ~ dateTimeUTCValue",
      dateTimeUTCValue
    );

    return {
      executeDate: dateTimeUTCValue,
      side,
      fromAmount: pair.from.num,
      fromTicker: pair.from.char,
      toAmount: pair.to.num,
      toTicker: pair.to.char,
      pair: `${pair.from.char}/${pair.to.char}`,
      priceAtTheTime,
    };
  }, [dateTimeUTCValue, pair, priceAtTheTime, side]);
  const createManualSpotTransaction = () => {
    console.log(
      "🚀 ~ file: TransactionInput.tsx ~ line 52 ~ createManualSpotTransaction ~ manualTransactionBody",
      {
        ...manualTransactionBody,
        executeDate: dateTimeUTCValue.toUTCString(),
      }
    );

    axios
      .post<OutputSpotTransaction>(
        "/api/manual-spot-transaction",
        manualTransactionBody
      )
      .then((rs) => {
        props.onCreateSuccessfully(rs.data);
      });
  };
  useEffect(() => {
    const { theChar: toTheChar, theNumber: toTheNumber } =
      splitNumberAndAlphabet(toValue);
    const { theChar: fromTheChar, theNumber: fromTheNumber } =
      splitNumberAndAlphabet(fromValue);

    setPair({
      from: {
        char: fromTheChar.trim(),
        num: fromTheNumber,
      },
      to: {
        char: toTheChar.trim(),
        num: toTheNumber,
      },
    });
  }, [toValue, fromValue]);

  const handleOnBlur = (position: "from" | "to") => (e: any) => {
    const { value } = e.target;
    if (position === "from") {
      setFromValue(value);
    }
    if (position === "to") {
      setToValue(value);
    }
  };
  return (
    <Row colRatio="repeat(8, 12.5%)">
      {[
        <input
          onChange={(e) => {
            const now = new Date(e.target.value);
            console.log(
              "🚀 ~ file: TransactionInput.tsx ~ line 84 ~ e.target.value",
              e.target.value
            );
            const utc = new Date(
              now.getTime() + now.getTimezoneOffset() * 60000
            );
            console.log("🚀 ~ file: TransactionInput.tsx ~ line 89 ~ utc", utc);
            setDateTimeUTCValue(utc);
          }}
          defaultValue={new Date().toLocaleDateString()}
          key={1}
          type="datetime-local"
        />,
        <select
          onChange={(e) => {
            setSide(e.target.value as "BUY" | "SELL");
          }}
          key={2}
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>,
        <span key={3}>
          {pair.from.char || "---"}/{pair.to.char || "---"}
        </span>,
        <input key={4} onBlur={handleOnBlur("from")} />,
        <input key={5} onBlur={handleOnBlur("to")} />,
        <span key={6}>{roundToThreeDigit(priceAtTheTime)}</span>,
        <span key={7}>...</span>,
        <button onClick={createManualSpotTransaction} key={8}>
          [Add +]
        </button>,
      ]}
    </Row>
  );
}
