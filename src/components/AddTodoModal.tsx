import React, { useState, FormEvent, ChangeEvent } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: { title: string; description: string }) => void;
  isLoading: boolean;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTodoToAdd((prev) => ({ ...prev, [name]: value }));
  };

  const onAddSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(todoToAdd);
  };

  return (
    <Modal isOpen={isOpen} closeModal={onClose} title="Add new todo">
      <form className="space-y-5" onSubmit={onAddSubmitHandler}>
        <div>
          <label
            htmlFor="title"
            className="text-base font-semibold block text-lightText dark:text-darkText mb-1"
          >
            Title:
          </label>
          <Input
            name="title"
            id="title"
            value={todoToAdd.title}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-base font-semibold block text-lightText dark:text-darkText mb-1"
          >
            Description (Optional):
          </label>
          <Textarea
            name="description"
            id="description"
            value={todoToAdd.description}
            onChange={onChangeHandler}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-indigoLight hover:bg-buttonLightHover w-full"
            isLoading={isLoading}
            type="submit"
          >
            Done
          </Button>
          <Button variant="cancel" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTodoModal;
