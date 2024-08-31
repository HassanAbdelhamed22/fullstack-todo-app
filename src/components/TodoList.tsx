import { ChangeEvent, FormEvent, useState } from "react";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import { IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { isLightMode, userData } from "../utils/Helper";
import { AxiosError } from "axios";
import Skeleton from "./Skeleton";

const TodoList = () => {
  let [queryVersion, setQueryVersion] = useState(1);
  let [isEditModalOpen, setIsEditModalOpen] = useState(false);
  let [isUpdating, setIsUpdating] = useState(false);
  let [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  let [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    completed: false,
  });

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["TodoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  //* Handlers
  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };

  const onOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
      completed: false,
    });
    setIsEditModalOpen(false);
  };

  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
      completed: false,
    });
    setIsOpenConfirmModal(false);
  };

  const onAddChangeHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value, name } = e.target;

    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
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

  const onRemove = async () => {
    try {
      const { status } = await axiosInstance.delete(`/todos/${todoToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        closeConfirmModal();
        setQueryVersion((prev) => prev + 1);
        toast.success("Your Todo is deleted successfully", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: isLightMode() ? "white" : "black",
            color: isLightMode() ? "black" : "white",
            width: "fit-content",
          },
        });
      }
    } catch (error) {
      //! Rejected => Field => (OPTIONAL)
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
        style: {
          backgroundColor: isLightMode() ? "white" : "black",
          color: isLightMode() ? "black" : "white",
          width: "fit-content",
        },
      });
    }
  };

  const onToggleComplete = async (todo: ITodo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const { status } = await axiosInstance.put(
        `/todos/${updatedTodo.id}`,
        {
          data: { completed: updatedTodo.completed },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200) {
        setTodoToEdit(updatedTodo);
        setQueryVersion((prev) => prev + 1);
        toast.success(
          `Todo ${
            updatedTodo.completed
              ? "marked as completed"
              : "marked as incomplete"
          }`,
          {
            position: "top-center",
            duration: 2000,
            style: {
              backgroundColor: isLightMode() ? "white" : "black",
              color: isLightMode() ? "black" : "white",
              width: "fit-content",
            },
          }
        );
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
        style: {
          backgroundColor: isLightMode() ? "white" : "black",
          color: isLightMode() ? "black" : "white",
          width: "fit-content",
        },
      });
    }
  };

  const onAddSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdating(true);

    const { title, description } = todoToAdd;
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        {
          data: { title, description, user: userData.user.id },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        onCloseAddModal();
        setQueryVersion((prev) => prev + 1);
        toast.success("Your Todo is added successfully", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: isLightMode() ? "white" : "black",
            color: isLightMode() ? "black" : "white",
            width: "fit-content",
          },
        });
      }
    } catch (error) {
      //! Rejected => Field => (OPTIONAL)
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
        style: {
          backgroundColor: isLightMode() ? "white" : "black",
          color: isLightMode() ? "black" : "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsUpdating(false);
    }
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
        setQueryVersion((prev) => prev + 1);
        toast.success("Your Todo is updated successfully", {
          position: "top-center",
          duration: 2000,
          style: {
            backgroundColor: isLightMode() ? "white" : "black",
            color: isLightMode() ? "black" : "white",
            width: "fit-content",
          },
        });
      }
    } catch (error) {
      //! Rejected => Field => (OPTIONAL)
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "top-center",
        duration: 4000,
        style: {
          backgroundColor: isLightMode() ? "white" : "black",
          color: isLightMode() ? "black" : "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    const skeletonCount = 1;
    return (
      <div className="space-y-4 first:mt-20 p-3">
        {Array.from({ length: skeletonCount }, (_, idx) => (
          <Skeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-20 mb-8 flex items-center justify-center gap-2">
        <Button className="bg-indigoLight" onClick={onOpenAddModal}>
          Add new todo
        </Button>
      </div>
      <div className="space-y-4 first:mt-20">
        {data?.todos.length ? (
          data.todos.map((todo: ITodo, index: number) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100 text-lightText dark:text-darkText dark:even:bg-[#282828] dark:hover:bg-[#282828] cursor-pointer`}
            >
              <p
                className={`w-full font-semibold cursor-pointer ${
                  todo.completed ? "line-through animate-strikethrough" : ""
                }`}
                onClick={() => onToggleComplete(todo)}
              >
                {index + 1} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button
                  className="bg-indigoLight"
                  size={"sm"}
                  onClick={() => onOpenEditModal(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={() => openConfirmModal(todo)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <h3>No todos yet</h3>
        )}

        {/* Add Todo Modal */}
        <Modal
          isOpen={isOpenAddModal}
          closeModal={onCloseAddModal}
          title="Add new todo"
        >
          <form className="space-y-3" onSubmit={onAddSubmitHandler}>
            <Input
              name="title"
              value={todoToAdd.title}
              onChange={onAddChangeHandler}
            />

            <Textarea
              name="description"
              value={todoToAdd.description}
              onChange={onAddChangeHandler}
            />

            <div className="flex items-center gap-2">
              <Button
                className="bg-indigoLight hover:bg-buttonLightHover w-full"
                isLoading={isUpdating}
              >
                Done
              </Button>
              <Button
                variant={"cancel"}
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  onCloseAddModal();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

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
              <Button
                variant={"cancel"}
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  onCloseEditModal();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Todo Confirm Modal */}
        <Modal
          isOpen={isOpenConfirmModal}
          closeModal={closeConfirmModal}
          title="Are you sure you want to remove this todo from your todo list?"
          description="Deleting this todo will remove it permanently from your todo list. Any associated data, and other related information will also be deleted. Please make sure this is intended action."
        >
          <div className="flex items-center gap-2">
            <Button variant={"danger"} onClick={onRemove} fullWidth>
              Yse, remove
            </Button>
            <Button variant={"cancel"} onClick={closeConfirmModal} fullWidth>
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default TodoList;
