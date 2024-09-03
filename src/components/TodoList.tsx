import { ChangeEvent, FormEvent, useState } from "react";
import useCustomQuery from "../hooks/useCustomQuery";
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
import Paginator from "./ui/Paginator";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import noTodos from "../assets/thinking.svg";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const TodoList = () => {
  let [queryVersion, setQueryVersion] = useState(1);
  let [isEditModalOpen, setIsEditModalOpen] = useState(false);
  let [isUpdating, setIsUpdating] = useState(false);
  let [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  let [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("desc");
  const [enabled, setEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchArr] = useState<TodoItem[]>([]);

  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    completed: false,
    createdAt: "",
    updatedAt: "",
  });

  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [
      "TodoList",
      `${queryVersion}`,
      `todos-page-${page}`,
      `${pageSize}`,
      `${sortBy}`,
      `${searchArr}`,
    ],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // Filter todos based on search query
  const filteredTodos =
    data?.todos.filter((todo: TodoItem) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Sort todos
  const sortedTodos = filteredTodos.sort((a: TodoItem, b: TodoItem) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return sortBy === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastTodo = page * pageSize;
  const indexOfFirstTodo = indexOfLastTodo - pageSize;
  const currentTodos = sortedTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodos.length / pageSize);

  //* Handlers
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };

  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

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
    setEnabled(!enabled);

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
    <div className="my-10">
      {/* Search Input */}
      <div className="relative flex items-center mx-auto sm:mx-4 mt-20 mb-10">
        <Input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6 absolute right-3 text-gray-500 dark:text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <div className="mb-8 flex items-center justify-between mx-auto sm:mx-4">
        <div>
          <Button
            className="bg-indigoLight dark:bg-indigoDark rounded-full hover:bg-indigo-500 active:bg-indigo-600 hover:stroke-[#282373] dark:hover:stroke-indigoLight duration-300"
            onClick={onOpenAddModal}
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
        </div>
        <div className="flex items-center gap-4">
          <select
            className="border border-indigoLight dark:border-indigoDark rounded-md p-3 text-lightText dark:text-darkText cursor-pointer bg-inherit"
            value={pageSize}
            onChange={onChangePageSize}
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
          <select
            className="border border-indigoLight dark:border-indigoDark rounded-md p-3 text-lightText dark:text-darkText cursor-pointer bg-inherit"
            value={sortBy}
            onChange={onChangeSortBy}
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
          </select>
        </div>
      </div>
      <div className="space-y-4 first:mt-20 mx-auto sm:mx-4">
        {currentTodos.length ? (
          currentTodos.map((todo: TodoItem) => (
            <div
              key={todo.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100 text-lightText dark:text-darkText dark:even:bg-[#282828] dark:hover:bg-[#282828] cursor-pointer"
            >
              <div
                className="flex items-center gap-4 w-full sm:w-auto min-w-28 md:min-w-80 mb-2 sm:mb-0"
                onClick={() => onToggleComplete(todo)}
              >
                <Checkbox
                  className={`flex items-center justify-center w-6 h-6 rounded-md ring-1 ring-gray-300 ${
                    todo.completed
                      ? "bg-indigoLight ring-indigoLight dark:bg-indigoDark dark:ring-indigoDark"
                      : "bg-white"
                  }`}
                >
                  <CheckIcon
                    className={`${
                      todo.completed ? "block" : "hidden"
                    } w-5 h-5 text-white dark:text-black`}
                  />
                </Checkbox>
                <p
                  className={`font-semibold cursor-pointer text-lightText dark:text-darkText text-sm sm:text-base ${
                    todo.completed ? "line-through animate-strikethrough" : ""
                  }`}
                >
                  {todo.title}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 min-w-80 sm:min-w-min">
                <Button
                  className="p-2 bg-inherit dark:bg-inherit dark:hover:bg-inherit"
                  size={"sm"}
                  onClick={() => onOpenEditModal(todo)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    className="w-6 h-6 stroke-indigoLight dark:stroke-indigoDark hover:stroke-[#282373] duration-300 dark:hover:stroke-indigoLight"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Button>
                <Button
                  className="p-2 bg-inherit dark:bg-inherit dark:hover:bg-inherit"
                  size={"sm"}
                  onClick={() => openConfirmModal(todo)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    className="w-6 h-6 stroke-red-700 dark:stroke-red-500 hover:stroke-red-900 duration-300 dark:hover:stroke-red-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <img src={noTodos} alt="No todos" className="w-92 h-80" />
            <h1 className="text-center text-indigoLight dark:text-indigoDark text-2xl font-semibold">
              No todos yet
            </h1>
          </div>
        )}

        {/* Add Todo Modal */}
        <Modal
          isOpen={isOpenAddModal}
          closeModal={onCloseAddModal}
          title="Add new todo"
        >
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
                onChange={onAddChangeHandler}
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
                onChange={onAddChangeHandler}
              />
            </div>

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
                onClick={onCloseAddModal}
                type="button"
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
              <Button
                variant={"cancel"}
                fullWidth
                onClick={onCloseEditModal}
                type="button"
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
            <Button
              variant={"cancel"}
              onClick={closeConfirmModal}
              fullWidth
              type="button"
            >
              Cancel
            </Button>
          </div>
        </Modal>

        <Paginator
          page={page}
          pageCount={totalPages}
          total={data?.todos.length}
          isLoading={isLoading || isFetching}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
    </div>
  );
};

export default TodoList;
