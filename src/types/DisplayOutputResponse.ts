import React from "react";

export interface DisplayOutputResponse {
  displayData: {
    Method: string;
    "Transaction hash": React.ReactNode;
    "Wen?": string;
    "Price at the time": string;
    "Amount of tokens": string;
    "Value in USD": string;
    Efficiency: string;
  };
  meta: {
    id: string;
  };
}
