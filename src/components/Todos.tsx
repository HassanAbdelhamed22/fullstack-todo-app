import { ChangeEvent, useState } from "react";
import useCustomQuery from "../hooks/useCustomQuery";
// import { ITodo } from "../interfaces";
import { userData } from "../utils/Helper";
import Paginator from "./ui/Paginator";
// import Skeleton from "./Skeleton";

const TodosPage = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("Desc");

  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

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

  if (isLoading) {
    <h3>Loading...</h3>;
  }

  return (
    <div className="my-16">
      <div className="flex items-center justify-center space-x-2 text-base">
        <select
          className="border-2 border-indigoLight rounded-md p-2 text-lightText dark:text-darkText cursor-pointer bg-inherit"
          value={sortBy}
          onChange={onChangeSortBy}
        >
          <option disabled className="text-lightText">
            Sort by
          </option>
          <option value="DESC" className="cursor-pointer text-lightText">
            Latest
          </option>
          <option value="ASC" className="cursor-pointer text-lightText">
            Oldest
          </option>
        </select>

        <select
          className="border-2 border-indigoLight rounded-md p-2 text-lightText dark:text-darkText cursor-pointer bg-inherit"
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
      </div>
      <div className="space-y-4 container mx-auto max-w-xl my-10">
        {data?.data.length ? (
          data.data.map(
            (
              todo: { id: number; attributes: { title: string } },
              index: number
            ) => (
              <div
                key={todo.id}
                className={` hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100 text-lightText dark:text-darkText dark:even:bg-[#282828] dark:hover:bg-[#282828] cursor-pointer`}
              >
                <p className="font-semibold cursor-pointer">
                  {index + 1} - {todo.attributes.title}
                </p>
              </div>
            )
          )
        ) : (
          <h3>No todos yet</h3>
        )}
        <Paginator
          isLoading={isLoading || isFetching}
          page={page}
          pageCount={data?.meta?.pagination.pageCount}
          total={data?.meta?.pagination.total}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
    </div>
  );
};

export default TodosPage;
