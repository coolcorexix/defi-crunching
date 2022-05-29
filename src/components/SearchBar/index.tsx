import React, { useState } from "react";
import { SearchBarContainer } from "./SearchBar.styled";

export function SearchBar(props: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <SearchBarContainer isActive={isFocused || !!props.value}>
      <div className="shadow" />
      <div className="content">
        <input
          type="text"
          placeholder={props.placeholder}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          value={props.value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </SearchBarContainer>
  );
}
