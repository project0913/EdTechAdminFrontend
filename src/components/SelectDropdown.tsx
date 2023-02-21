import React from "react";
import style from "./selectDropdown.module.css";
export type SelectOption = {
  label: string | number;
  value: string | number;
};
type DropdownProps = {
  title: string;
  items: SelectOption[];
  handleSelect: (e: React.FormEvent<HTMLSelectElement>) => void;
  styles?: any;
};

function SelectDropdown({ title, items, handleSelect, styles }: DropdownProps) {
  return (
    <span className="select-container" style={styles || { width: "7rem" }}>
      <label htmlFor="select">{title}</label> {}
      <select onChange={handleSelect} id="select" className={style.selectDropdown}>
        {items.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}

export default SelectDropdown;
