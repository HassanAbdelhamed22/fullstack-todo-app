import React from "react";
import Button from "../components/ui/Button";

interface AddTodoButtonProps {
  onClick: () => void;
}

const AddTodoButton: React.FC<AddTodoButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="bg-indigoLight dark:bg-indigoDark rounded-full hover:bg-indigo-500 active:bg-indigo-600 hover:stroke-[#282373] dark:hover:stroke-indigoLight duration-300"
      onClick={onClick}
      aria-label="Add new task"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={3.5}
        className="size-6 stroke-darkText dark:stroke-lightText"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </Button>
  );
};

export default AddTodoButton;
