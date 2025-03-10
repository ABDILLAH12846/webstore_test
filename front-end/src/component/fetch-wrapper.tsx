import { ApiError } from "@/api-hook/config";

interface Props<T> {
  data: T;
  isLoading?: boolean;
  error?: ApiError | null;
  children: React.ReactNode;
}

export default function FetchWrapperComponent<T>({ data, isLoading, error, children }: Props<T>) {
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available.</p>;

  return <>{children}</>;
}
