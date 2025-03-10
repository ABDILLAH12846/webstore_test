import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../config";

const fetchProjects = async ({ pageParam = 0, queryKey }) => {
  const { q, limit } = queryKey[1];
  const res = await apiClient.get("/cart-infinite/2", {
    params: { cursor: pageParam, q, limit },
  });
  return res.data;
};

export function useGetCarts(q, limit) {
  return useInfiniteQuery({
    queryKey: ["carts", { q, limit }],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  });
}
