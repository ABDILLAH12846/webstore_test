"use client";
import { useSearchParams } from "next/navigation";

export default function useRouterQuery() {
  const searchParams = useSearchParams();

  return {
    keyword: searchParams.get("keyword") || "",
    page: Number(searchParams.get("page")) || 1,
  };
}
