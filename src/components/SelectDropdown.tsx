import { FormEvent } from "react";
import style from "./selectDropdown.module.css";
export type SelectOption = {
  label: string | number;
  value: string | number;
};
type DropdownProps = {
  title: string;
  items: SelectOption[];
  handleSelect: (e: FormEvent<HTMLSelectElement>) => void;
  styles?: any;
  value?: string| number
};

function SelectDropdown({ title, items, handleSelect, styles,value }: DropdownProps) {
  return (
    <span className="select-container">
      <label htmlFor="select">{title}</label> {}
      <select
        onChange={handleSelect}
        id="select"
        value={value ? value : items[0]?.value || ''}
        className={style.selectDropdown}
      >
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
