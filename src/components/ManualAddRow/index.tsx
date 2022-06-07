import React, { useState } from "react";
import { Row } from "@coolcorexix/ui-kit";

import { OutputSpotTransaction } from "backend-feature/binance-crunching/processSpot";
import { TransactionInput } from "./TransactionInput";

export function ManualAddRow(props: {
  onCreateSuccessfully: (transaction: OutputSpotTransaction) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  if (!isActive) {
    return (
      <Row>
        {[
          <button
            onClick={() => {
              setIsActive(true);
            }}
            key={1}
          >
            [Add new transaction +]
          </button>,
        ]}
      </Row>
    );
  }
  return (
    <TransactionInput
      onCreateSuccessfully={(transaction) => {
        props.onCreateSuccessfully(transaction);
        setIsActive(false);
      }}
    />
  );
}
