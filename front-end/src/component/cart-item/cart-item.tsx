import React from 'react'
import styles from './cart-item.module.css'
import Image from 'next/image';
import { editCart } from '@/api-hook/cart/cart.mutation';

interface Props {
  data: {
    id: number;
    title: string;
    price: string;
    image: string;
    quantity: number;
    total_price: string;
  };
  reloadData: () => void;
}

export default function CartItem(props: Props) {
  const { data, reloadData } = props;
  const handleChange = async (num: number) => {
    const result = await editCart(data?.id, data?.quantity + num)
    console.log({ result });
    await reloadData()
  }
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image src={data?.image} layout='fill' style={{ objectFit: "contain" }} alt={data?.title} />
      </div>
      <div className={styles.wrapper}>
        <div>
          <span className={styles.price}>${data?.price}</span>
          <span className={styles.title}>{data?.title}</span>
        </div>
        <div className={styles.bottomWrapper}>
          <div className={styles.quantityWrapper}>
            <button onClick={() => handleChange(-1)} className={styles.quantityButton}>-</button>
            <span>{data?.quantity}</span>
            <button onClick={() => handleChange(1)} className={styles.quantityButton}>+</button>
          </div>
          <button className={styles.button}>Checkout ${data?.total_price}</button>
        </div>
      </div>
    </div>
  )
}
