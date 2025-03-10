import UserHeader from '@/component/user-header/user-header';
import React from 'react'

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <UserHeader />
            {children}
        </>
    )
}
