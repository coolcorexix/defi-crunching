import { convertFontSizeToPixel } from "nemo-ui-kit/utils/convertFontSizeToPixel";
import React from "react";
import styled, { css } from "styled-components";

const StyledTable = styled.div`
  display: grid;
`;

const StyledRow = styled.div<{
  colRatio: string;
}>`
  display: grid;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }

  grid-template-columns: ${(props: any) => props.colRatio};
`;

const StyledCell = styled.div<{
  isHeading?: boolean;
}>`
  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
  ${({ isHeading }) =>
    isHeading
      ? css`
          padding-bottom: 8px;
          border-bottom: 2px dashed;
        `
      : ""}
`;

export function Row(props: {
  children: React.ReactChild[];
  colRatio?: string;
  isHeading?: boolean;
}) {
  const children = React.Children.toArray(props.children);
  const colRatio = props.colRatio
    ? props.colRatio
    : `repeat(${children.length},1fr)`;
  console.log("🚀 ~ file: table.tsx ~ line 44 ~ colRatio", colRatio);

  return (
    <StyledRow colRatio={colRatio}>
      {children.map((child, index) => {
        return (
          <StyledCell isHeading={props.isHeading} key={index}>
            {child}
          </StyledCell>
        );
      })}
    </StyledRow>
  );
}

export const DottedLine = () => (
  <div className="border-t-2 border-dotted border-black my-2" />
);

export const DashedLine = () => (
  <div className="border-t-2 border-dashed border-black my-2" />
);

export const Table = StyledTable;
