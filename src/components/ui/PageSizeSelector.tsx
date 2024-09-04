import React from "react";

interface PageSizeSelectorProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <select
      className="border border-indigoLight dark:border-indigoDark rounded-md p-3 text-lightText dark:text-darkText cursor-pointer bg-inherit"
      value={value}
      onChange={onChange}
    >
      <option disabled className="text-lightText">
        Page size
      </option>
      <option value={10} className="cursor-pointer text-lightText">
        10
      </option>
      <option value={25} className="cursor-pointer text-lightText">
        25
      </option>
      <option value={50} className="cursor-pointer text-lightText">
        50
      </option>
      <option value={100} className="cursor-pointer text-lightText">
        100
      </option>
    </select>
  );
};

export default PageSizeSelector;
