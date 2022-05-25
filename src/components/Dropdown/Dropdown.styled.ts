import styled from "styled-components";
import { base03, base3 } from "theme/colors";

export const DropdownWrapper = styled.div`
  position: relative;
  .content {
    position: relative;
    z-index: 1;
  }
  .Dropdown-root {
    position: relative;
    .Dropdown-control {
      background: ${base3};
      width: 100%;
      padding: 16px;
      font-size: 21px;
      border: 2px solid ${base03};
      border-right: none;
      color: ${base03};
      .Dropdown-arrow {
        top: 50%;
      }
    }
    .Dropdown-menu {
      overflow: visible;
      position: absolute;
      top: 1px;
      width: calc(100% + 2px);
      font-size: 21px;
      background: ${base3};
      border: 2px solid ${base03};
      .Dropdown-option {
        background: ${base3};
        padding: 16px;
      }
      &:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        background: ${base03};
        right: -4px;
        top: 4px;
        z-index: -1;
      }
    }
  }

  .shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    background: ${base03};
    right: -4px;
    top: 4px;
    z-index: 0;
  }
`;
