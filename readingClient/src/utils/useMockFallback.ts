export const useMockFallback = <T>(data: T | undefined, mock: T): T => {
  if (!data) return mock;
  if (Array.isArray(data) && data.length === 0) return mock;
  return data;
};