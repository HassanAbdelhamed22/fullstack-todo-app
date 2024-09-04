import { ChangeEvent, FormEvent, useState } from "react";
import useCustomQuery from "../hooks/useCustomQuery";
import { IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { isLightMode, userData } from "../utils/Helper";
import { AxiosError } from "axios";
import Skeleton from "./Skeleton";
import Paginator from "./ui/Paginator";
import SearchBar from "./ui/SearchBar";
import TodoItem from "./TodoItem";
import NoTodos from "../pages/NoTodos";
import AddTodoModal from "./AddTodoModal";
import EditTodoModal from "./EditTodoModal";
import DeleteTodoModal from "./DeleteTodoModal";
import AddTodoButton from "./AddTodoBtn";
import EditTodoButton from "./EditTodoBtn";
import DeleteTodoButton from "./DeleteTodoBtn";
import PageSizeSelector from "./ui/PageSizeSelector";
import SortBySelector from "./ui/SortBySelector";

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

  // Safely access todos and provide a default empty array if undefined
  const todos = data?.todos || [];

  // Update the filtering and sorting logic
  const filteredAndSortedTodos = todos
    .filter((todo: TodoItem) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((todo: TodoItem) => sortBy !== "completed" || todo.completed)
    .sort((a: TodoItem, b: TodoItem) => {
      if (sortBy === "completed") {
        return 0; // No need to sort if we're only showing completed items
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totalItems = filteredAndSortedTodos.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const indexOfLastTodo = page * pageSize;
  const indexOfFirstTodo = indexOfLastTodo - pageSize;
  const currentTodos = filteredAndSortedTodos.slice(
    indexOfFirstTodo,
    indexOfLastTodo
  );

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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

  const handleAddTodo = async (newTodo: {
    title: string;
    description: string;
  }) => {
    setIsUpdating(true);

    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        {
          data: { ...newTodo, user: userData.user.id },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      if (status === 200) {
        setIsOpenAddModal(false);
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
      <SearchBar
        onChange={setSearchQuery}
        value={searchQuery}
        placeholder="Search your todos..."
      />

      <div className="mb-8 flex items-center justify-between mx-auto sm:mx-4">
        <div>
          <AddTodoButton onClick={onOpenAddModal} />
        </div>
        <div className="flex items-center gap-4">
          <PageSizeSelector value={pageSize} onChange={onChangePageSize} />
          <SortBySelector value={sortBy} onChange={onChangeSortBy} />
        </div>
      </div>
      <div className="space-y-4 first:mt-20 mx-auto sm:mx-4">
        {currentTodos.length ? (
          currentTodos.map((todo: TodoItem) => (
            <div
              key={todo.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100 text-lightText dark:text-darkText dark:even:bg-[#282828] dark:hover:bg-[#282828] cursor-pointer"
            >
              <TodoItem todo={todo} onToggleComplete={onToggleComplete} />

              <div className="flex items-center justify-end space-x-3 min-w-80 sm:min-w-min">
                <EditTodoButton onClick={onOpenEditModal} todo={todo} />
                <DeleteTodoButton onClick={openConfirmModal} todo={todo} />
              </div>
            </div>
          ))
        ) : (
          <NoTodos />
        )}

        {/* Add Todo Modal */}
        <AddTodoModal
          isOpen={isOpenAddModal}
          onClose={() => setIsOpenAddModal(false)}
          onSubmit={handleAddTodo}
          isLoading={isUpdating}
        />

        {/* Edit Todo Modal */}
        <EditTodoModal
          isOpen={isEditModalOpen}
          onClose={onCloseEditModal}
          onSubmit={onSubmitHandler}
          todoToEdit={todoToEdit}
          onChangeHandler={onChangeHandler}
          isUpdating={isUpdating}
        />

        {/* Delete Todo Confirm Modal */}
        <DeleteTodoModal
          isOpen={isOpenConfirmModal}
          onClose={closeConfirmModal}
          onConfirm={onRemove}
        />

        <Paginator
          page={page}
          pageCount={totalPages}
          total={data?.todos.length}
          isLoading={isLoading || isFetching}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TodoList;
