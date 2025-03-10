"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Product } from '@/api-hook/product/product.model'
import styles from './modal.module.css'
import { deleteProduct } from '@/api-hook/product/product.mutation'

interface Props {
    data: Product;
    reloadData: () => void;
}


export default function DeleteModal(props: Props) {
    const { data, reloadData } = props;
    const handleDelete = async () => {
        const response = await deleteProduct(data?.id)
        console.log({ response })
        await reloadData()
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger>Hapus</DialogTrigger>
                <DialogContent className={styles.container}>
                    <DialogHeader>
                        <DialogTitle>Apakah kamu yakin?</DialogTitle>
                        <DialogDescription>
                            Ini akan menghapus data {data?.title} secara permanen
                        </DialogDescription>
                    </DialogHeader>
                    <div style={{ display: "flex", gap: 50 }}>
                        <button onClick={handleDelete}>Iya</button>
                        <button>Tidak</button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
