"use client"
import React, { Children, useEffect, useState } from 'react';
import '@/app/styles/sign_edu.css';
import withAuth from "@/app/HOC/withAuth";
import {useRouter} from "next/navigation";

export default function WrongLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const isLogin = localStorage.getItem('accessToken');
        if (!isLogin) {
            alert("로그인이 필요합니다.");
            router.push("/auth")
            window.location.replace('/auth');
        } else {
            return;
        }
    return (
        <>
            <div className="page_margin"></div>
            {children}
        </>
    )
}