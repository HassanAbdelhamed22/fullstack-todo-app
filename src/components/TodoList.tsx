import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";

const TodoList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });

  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["TodoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };

  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = e.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdating(true);

    console.log(todoToEdit);
    const { title, description } = todoToEdit;
    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.id}`,
        {
          data: { title, description },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">1 - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button
                className="bg-indigoLight"
                size={"sm"}
                onClick={() => onOpenEditModal(todo)}
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
        closeModal={onCloseEditModal}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={onSubmitHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />

          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeHandler}
          />

          <div className="flex items-center gap-2">
            <Button
              className="bg-indigoLight hover:bg-buttonLightHover w-full"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button variant={"cancel"} fullWidth onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
