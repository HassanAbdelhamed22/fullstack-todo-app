import React, { FormEvent, ChangeEvent } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import { ITodo } from "../interfaces";

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  todoToEdit: ITodo;
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isUpdating: boolean;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  todoToEdit,
  onChangeHandler,
  isUpdating,
}) => {
  return (
    <Modal isOpen={isOpen} closeModal={onClose} title="Edit this todo">
      <form className="space-y-3" onSubmit={onSubmit}>
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
            value={todoToEdit.title}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-base font-semibold block text-lightText dark:text-darkText mb-1"
          >
            Description:
          </label>
          <Textarea
            name="description"
            id="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />
        </div>

        <div className="space-y-1">
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {todoToEdit.createdAt
              ? format(
                  new Date(todoToEdit.createdAt),
                  "MMMM dd, yyyy HH:mm:ss",
                  { locale: enUS }
                )
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Updated at:</span>{" "}
            {todoToEdit.updatedAt
              ? format(
                  new Date(todoToEdit.updatedAt),
                  "MMMM dd, yyyy HH:mm:ss",
                  { locale: enUS }
                )
              : "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-indigoLight hover:bg-buttonLightHover w-full"
            isLoading={isUpdating}
          >
            Update
          </Button>
          <Button variant="cancel" fullWidth onClick={onClose} type="button">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTodoModal;
