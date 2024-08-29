import { useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

const TodoList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //  * Handlers
  const onToggleEditModal = () => {
    setIsEditModalOpen((prev: boolean) => !prev);
  };

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">1 - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                className="bg-indigoLight"
                size={"sm"}
                onClick={onToggleEditModal}
              >
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3>No todos yet</h3>
      )}

      {/* Edit Todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onToggleEditModal}
        title="Edit this todo"
      >
        <Input value="EDIT TODO" />
        <div className="flex items-center gap-2 mt-4">
          <Button className="bg-indigoLight hover:bg-buttonLightHover w-full">
            Update
          </Button>
          <Button variant={"cancel"} fullWidth onClick={onToggleEditModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
