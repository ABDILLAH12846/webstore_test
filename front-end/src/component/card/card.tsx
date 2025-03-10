import { Product } from '@/api-hook/product/product.model'
import React from 'react'
import styles from './card.module.css'
import Image from 'next/image';
import { addToCart, editCart } from '@/api-hook/cart/cart.mutation';

interface Props {
    data: Product;
    reloadData: () => void;
}

export default function Card(props: Props) {
    const { data, reloadData } = props;
    
    const handleSubmit = async () => {
        if (data?.cart_quantity === 0) {
            const result = await addToCart(2, data?.id, 1); 
            console.log({ result });
            await reloadData()
        } else {
            const result = await editCart(data?.cart_id, data?.cart_quantity + 1)
            console.log({ result });
            await reloadData()
        }
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.topwrapper}>
                <div className={styles.imageContainer}>
                    <Image src={data?.image} layout='fill' style={{ objectFit: "contain" }} alt={data?.title} />
                </div>
                <div>
                    <span className={styles.price}>${data?.price}</span>
                    <span className={styles.title}>{data?.title}</span>
                </div>
            </div>
            <button onClick={handleSubmit} className={styles.button}>Add to Cart</button>
        </div>
    )
}
