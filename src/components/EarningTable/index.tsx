import { DashedLine, Row, Table } from "nemo-ui-kit";
import React from "react";
import { DisplayOutputResponse } from "types/DisplayOutputResponse";

export function EarningTable(props: {
  displayOutputResponses: DisplayOutputResponse[];
}) {
  const { displayOutputResponses } = props;
  return (
    <div>
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
