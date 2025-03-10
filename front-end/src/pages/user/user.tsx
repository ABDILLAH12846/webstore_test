"use client";

import { useGetProjects } from "@/api-hook/product/product.query";
import Card from "@/component/card/card";
import useRouterQuery from "@/utils/use-router-query";
import React from "react";
import styles from './user.module.css'
import { useQueryClient } from "@tanstack/react-query";

export default function UserPage() {
  const { keyword } = useRouterQuery();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetProjects(
    {
      params: {
        q: keyword, // Pencarian berdasarkan keyword dari URL
        limit: 10,  // Batasi 10 proyek per halaman
      },
    },
    {
      getNextPageParam: (lastPage: { meta?: { nextCursor?: string } }) => {
        console.log("Pagination Metadata:", lastPage.meta); // Debugging
        return lastPage.meta?.nextCursor || undefined; // Gunakan `nextCursor` untuk pagination
      },
      initialPageParam: 0, // Pastikan mulai dari 0 jika pakai cursor
    }
  );

  const reloadData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["projects"] }); // Hapus cache & fetch ulang
  };

  console.log("Data dari useGetProjects:", data); // Debugging

  return (
    <div className={styles.container}>

      {/* Handle Loading */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Render Data */}
      {data?.pages?.flatMap((page) => page.data).map((project) => (
        <Card data={project} key={project.id} reloadData={reloadData}/>
      ))}

      {/* Tombol "Load More" */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
