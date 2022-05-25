import { OutputResponse } from "backend-feature/profit-track/types";
import { useTransformOutputResponse } from "hooks/useTransformOutputResponse";
import { DashedLine, Row, Table } from "@coolcorexix/ui-kit";

import React from "react";
import { YandexIcon } from "@coolcorexix/icons";

export function EarningTable(props: {
  outputResponses: OutputResponse[];
}) {
  const { outputResponses } = props;
  console.log("🚀 ~ file: index.tsx ~ line 11 ~ outputResponses", outputResponses)
  const displayOutputResponses = useTransformOutputResponse(
    outputResponses
  );
  if (!displayOutputResponses.length) {
    return null;
  }
  return (
    <div>
      <div className="mb-2">
        <YandexIcon />
      </div>
      <Table className="w-2/3 m-auto">
        <DashedLine />
        <Row isHeading>
          {Object.keys(displayOutputResponses[0].displayData).map((key) => {
            return (
              <span key={key} className="font-bold">
                {key}
              </span>
            );
          })}
        </Row>
        {displayOutputResponses.map((dOR) => {
          return (
            <Row key={dOR.meta.id}>
              {Object.values(dOR.displayData).map((value, index) => {
                return <span key={index}>{value}</span>;
              })}
            </Row>
          );
        })}
      </Table>
    </div>
  );
}
