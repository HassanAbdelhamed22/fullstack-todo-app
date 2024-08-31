const Skeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-3">
        <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        <div className="h-9 w-20 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
};

export default Skeleton;
