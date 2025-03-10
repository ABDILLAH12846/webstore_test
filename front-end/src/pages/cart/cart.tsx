"use client"

import React from 'react'
import styles from './cart.module.css'
import useRouterQuery from '@/utils/use-router-query';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCarts } from '@/api-hook/cart/cart.query';
import CartItem from '@/component/cart-item/cart-item';

export default function Cart() {
    const { keyword } = useRouterQuery();
    const queryClient = useQueryClient();
    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useGetCarts(
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
        await queryClient.invalidateQueries({ queryKey: ["carts"] }); // Hapus cache & fetch ulang
    };

    console.log({ data })
    return (
        <>
            <div className={styles.container}>
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {data?.pages?.flatMap((page) => page.data).map((project) => (
                    <CartItem data={project} key={project.id} reloadData={reloadData} />
                ))}
            </div>
            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="mt-4"
                >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
            )}
        </>
    )
}
