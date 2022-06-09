import { LoadingSpinner } from "components/LoadingSpinner";
import React, { useState } from "react";
import { roundToThreeDigit } from "utils/roundNumber";

const loadingSpinner = <LoadingSpinner />;

export function TotalGainLossPanel(props: {
  totalWorth: number;
  totalExecuted: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const margin = props.totalWorth - props.totalExecuted;
  const [message, setMessage] = useState("");
  if (margin > 0) {
    setMessage("Total gain: " + margin);
  } else {
    setMessage("Total loss: " + margin);
  }
  return (
    <div>
      <span>
        {message} {isCollapsed ? "🔽" : "🔼"}
      </span>
      {!isCollapsed && (
        <div>
          <div>
            <span>
              <b>Total executed volume:</b>
              <span>
                &nbsp;
                {!!props.totalExecuted ? (
                  roundToThreeDigit(props.totalExecuted) + "USD"
                ) : (
                  <span> {loadingSpinner}</span>
                )}
              </span>
            </span>
          </div>
          <div>
            <span>
              <b>Total worth up to now:</b>
              <span>
                &nbsp;
                {!!props.totalWorth ? (
                  roundToThreeDigit(props.totalWorth)
                ) : (
                  <span> {loadingSpinner}</span>
                )}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
