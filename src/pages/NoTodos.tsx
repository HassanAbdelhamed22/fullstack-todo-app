import noTodos from "../assets/thinking.svg";

const NoTodos = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <img src={noTodos} alt="No todos" className="w-92 h-80" />
      <h1 className="text-center text-indigoLight dark:text-indigoDark text-2xl font-semibold">
        No todos yet
      </h1>
    </div>
  );
};

export default NoTodos;
