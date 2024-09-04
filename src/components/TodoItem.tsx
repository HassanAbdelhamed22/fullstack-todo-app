import { Checkbox } from "@headlessui/react";
import { ITodo } from "../interfaces";
import { CheckIcon } from "@heroicons/react/24/solid";

interface IProps {
  todo: ITodo;
  onToggleComplete: (todo: ITodo) => void;
}

const TodoItem = ({ todo, onToggleComplete }: IProps) => {
  return (
    <div
      className="flex items-center gap-4 w-full sm:w-auto min-w-28 md:min-w-80 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out"
      onClick={() => onToggleComplete(todo)}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggleComplete(todo)}
        className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          todo.completed
            ? "bg-indigo-600 border-indigo-600 dark:bg-indigoDark dark:border-indigoDark"
            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500"
        }`}
      >
        <CheckIcon
          className={`absolute inset-0 w-full h-full p-0.5 text-white dark:text-black transition-opacity duration-300 ease-in-out text-xl ${
            todo.completed ? "opacity-100" : "opacity-0"
          }`}
        />
      </Checkbox>
      <div className="flex-grow">
        <p
          className={`font-medium cursor-pointer text-gray-800 dark:text-gray-200 text-sm sm:text-base transition-all duration-300 ease-in-out ${
            todo.completed
              ? "line-through text-gray-500 dark:text-gray-200"
              : ""
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
            {todo.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
