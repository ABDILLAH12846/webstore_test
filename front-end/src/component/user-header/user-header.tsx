import React from 'react'
import styles from './user-header.module.css'
import CartIcon from '../icon/cart-svg'

export default function UserHeader() {
  return (
    <div className={styles.container}>
        <input type='string' placeholder='Cari' className={styles.input} />
        <div>
            <CartIcon size={24} color={"#cccccc"} />
        </div>
    </div>
  )
}
