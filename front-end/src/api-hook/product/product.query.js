import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjects = async ({ pageParam = 0, queryKey }) => {
  const { q, limit } = queryKey[1];
  const res = await axios.get("http://localhost:5000/products-infinite", {
    params: { cursor: pageParam, q, limit, user_id: 2 },
  });
  return res.data;
};

export function useGetProjects(q, limit) {
  return useInfiniteQuery({
    queryKey: ["projects", { q, limit }],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  });
}
