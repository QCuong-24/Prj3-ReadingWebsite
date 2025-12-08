export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-ocean-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-ocean-blue-700 font-medium">Loading...</p>
    </div>
  );
};