"use client"

import React from 'react'
import styles from './admin.module.css'
import useRouterQuery from '@/utils/use-router-query';
import { useQueryClient } from '@tanstack/react-query';
import { useGetProjects } from '@/api-hook/product/product.query';
import Image from 'next/image';
import DeleteModal from '@/component/modal/modal';
import AddStockModal from '@/component/add-stock-modal/add-stock-modal';

export default function AdminPage() {
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
    return (
        <div className={styles.container}>
            <h2>Daftar Produk</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p>Maaf Error {error?.message}</p>}
            {data && (<div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Gambar</th>
                            <th>Nama Produk</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.pages?.flatMap((page) => page.data).map((project, idx) => (
                            <tr key={project.id}>
                                <td>{idx}</td>
                                <td>
                                    <div className={styles.imageContainer}>
                                        <Image src={project?.image} layout='fill' style={{ objectFit: "contain" }} alt={project?.title} />
                                    </div>
                                </td>
                                <td>{project.title}</td>
                                <td>${project.price.toLocaleString()}</td>
                                <td width={100} style={{padding: "auto", textAlign: "center"}}>{project.stock}</td>
                                <td width={200} style={{display: "flex", justifyContent: "center", gap: 10}}>
                                    <AddStockModal data={project} reloadData={reloadData}/>
                                    <DeleteModal data={project} reloadData={reloadData}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>)}
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
    )
}
