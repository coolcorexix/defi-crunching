import ReactDropdown, { Option } from "react-dropdown";
import "react-dropdown/style.css";
import { DropdownWrapper } from "./Dropdown.styled";

interface DropdownProps {
  className?: string;
  placeholder: string;
  options: Option[];
  onChange: (arg: Option) => void,
  defaultOption: Option
}

export function Dropdown(props: DropdownProps) {
  return (
    <DropdownWrapper className={props.className}>
      <div className="content">
        <ReactDropdown
          options={props.options}
          onChange={props.onChange}
          value={props.defaultOption}
          placeholder={props.placeholder}
        />
      </div>
      <div className="shadow" />
    </DropdownWrapper>
  );
}
