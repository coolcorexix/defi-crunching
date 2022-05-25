import { Dropdown } from "components/Dropdown";
import { Option } from "react-dropdown";
import Image from "next/image";

export const dexOptions: Option[] = [
  {
    label: (
      <div className="flex items-center">
        <div className="mr-2 flex items-center">
          <Image
            width={25}
            height={25}
            alt="pancake-logo"
            src={require("assets/pancakeswap.svg")}
          />
        </div>
        <span className="block">PancakeSwap</span>
      </div>
    ),
    value: "pancakeswap",
  },
  {
    label: (
      <div className="flex items-center">
        <div className="mr-2 flex items-center">
          <Image
            width={25}
            height={25}
            alt="uni-logo"
            src={require("assets/uniswap.svg")}
          />
        </div>
        <span className="block">UniSwap</span>
      </div>
    ),
    value: "uniswap",
  },
  {
    label: (
      <div className="flex items-center">
        <div className="mr-2 flex items-center">
          <Image
            width={25}
            height={25}
            alt="uni-logo"
            src={require("assets/spiritswap.svg")}
          />
        </div>
        <span className="block">SpiritSwap</span>
      </div>
    ),
    value: "spiritswap",
  },
];

export function DexDropdown(props: {
  onDexSelectChange: (arg: Option) => void;
  className?: string;
}) {
  return (
    <Dropdown
      className={props.className}
      onChange={props.onDexSelectChange}
      placeholder="Choose your DEX"
      defaultOption={dexOptions[0]}
      options={dexOptions}
    />
  );
}
