import React from "react";

interface SortBySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortBySelector: React.FC<SortBySelectorProps> = ({ value, onChange }) => {
  return (
    <select
      className="border border-indigoLight dark:border-indigoDark rounded-md p-3 text-lightText dark:text-darkText cursor-pointer bg-inherit"
      value={value}
      onChange={onChange}
    >
      <option disabled className="text-lightText">
        Sort by
      </option>
      <option value="desc" className="cursor-pointer text-lightText">
        Latest
      </option>
      <option value="asc" className="cursor-pointer text-lightText">
        Oldest
      </option>
      <option value="completed" className="cursor-pointer text-lightText">
        Completed
      </option>
    </select>
  );
};

export default SortBySelector;
