import Navbar from "@/components/Navbar";
import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const Dashboard = () => {
    const user = useContext(AuthContext);

    return (
        <>
            <Navbar />
            <div className="pt-20 mx-auto max-w-2xl">
                <Link href="/">Back</Link>
                {user && (
                    <div className="relative flex w-full flex-col items-center justify-center rounded-lg border p-3">
                        <div className="flex w-full flex-col items-center justify-center lg:flex-row">
                            <div className="relative h-[100px] w-[100px] flex-shrink-0 flex-grow-0">
                                <Image src={user.photoURL} width={100} height={100} alt="User" className="h-full w-full rounded-full text-transparent" />
                            </div>
                            <div className="mt-3 flex w-full flex-col items-center justify-center lg:mt-0 lg:items-start lg:ml-4">
                                <div className="text-lg"><strong>{user.displayName}</strong></div>
                            </div>
                            <div className="flex w-full flex-row items-center justify-center text-sm lg:justify-start">

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;