import { ErrorState } from "../utils/handleApiError";

export const ErrorMessage = ({ error }: { error: ErrorState }) => {
  return (
    <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
      <p className="font-semibold">{error.message}</p>
      {error.details && <p className="text-sm mt-1">{error.details}</p>}
    </div>
  );
};