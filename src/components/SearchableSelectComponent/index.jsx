import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function SearchableSelect ({
  children,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  allowClear = true,
  style = { width: "100%" },
})  {
  return (
    <Select
      showSearch
      style={style}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      optionFilterProp="children"
      filterOption={(input, option) => {
        const description = option.children || "";
        return description.toLowerCase().includes(input.toLowerCase());
      }}
      filterSort={(optionA, optionB) => {
        const descriptionA = optionA.children || "";
        const descriptionB = optionB.children || "";
        return descriptionA.toLowerCase().localeCompare(descriptionB.toLowerCase());
      }}
    >
      {children}
    </Select>
  );
}

// Attach Option as a static property
SearchableSelect.Option = Option;

export default SearchableSelect;