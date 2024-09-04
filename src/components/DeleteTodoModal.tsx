import React from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

interface DeleteTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTodoModal: React.FC<DeleteTodoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      title="Are you sure you want to remove this todo from your todo list?"
      description="Deleting this todo will remove it permanently from your todo list. Any associated data, and other related information will also be deleted. Please make sure this is intended action."
    >
      <div className="flex items-center gap-2">
        <Button variant="danger" onClick={onConfirm} fullWidth>
          Yes, remove
        </Button>
        <Button variant="cancel" onClick={onClose} fullWidth type="button">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteTodoModal;
