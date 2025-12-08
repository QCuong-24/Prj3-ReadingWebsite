export interface ErrorState {
  message: string;
  details?: string;
  field?: string;
}

export const handleApiError = (error: unknown): ErrorState => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.statusText ?? "API Error",
      details: error.message,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred" };
};