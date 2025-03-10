"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Product } from '@/api-hook/product/product.model'
import styles from './add-stock-modal.module.css'
import { deleteProduct } from '@/api-hook/product/product.mutation'

interface Props {
    data: Product;
    reloadData: () => void;
}


export default function AddStockModal(props: Props) {
    const { data, reloadData } = props;
    const handleDelete = async () => {
        const response = await deleteProduct(data?.id)
        console.log({ response })
        await reloadData()
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger>Tambah Stock</DialogTrigger>
                <DialogContent className={styles.container}>
                    <DialogHeader>
                        <DialogTitle>Tambah / Ubah Data Stock</DialogTitle>
                    </DialogHeader>
                    <div style={{ display: "flex", gap: 50 }}>
                        <input type="number" style={{border: "1px solid #000"}} />
                        <button onClick={handleDelete}>Simpan</button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
