"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import Navigation from "@/components/layout/navigation";

import Header from "@/components/layout/header"

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const showLayout = pathname === "/todolist"
        || pathname === "/profile"
        || pathname === "/home"
        || false;

    return (
        <Fragment>
            {showLayout && <Header />}
            {children}
            {showLayout && <Navigation />}
        </Fragment>
    );
};

export default Pathname;