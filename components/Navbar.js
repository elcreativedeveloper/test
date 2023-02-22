import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";

const Navbar = () => {
    const user = useContext(AuthContext);

    return (
        <header className="fixed top-0 z-30 flex w-full select-none flex-col items-center justify-center border bg-white">
            <div className="flex min-h-[56px] w-full items-center justify-between px-4 py-2 lg:min-h-[64px]">
                <div className="flex w-full max-w-max flex-row items-center justify-start mr-2 lg:min-w-[200px]">
                    <div className="flex items-center justify-center">
                        <Link href="/post" className="inline-flex items-center justify-center">
                            <div className="flex flex-col items-start justify-center leading-6">
                                <div className="relative text-ellipsis text-lg font-medium line-clamp-1 leading-6">Materia Auth</div>
                                <small className="relative text-ellipsis text-xs line-clamp-1">Dashboard</small>
                            </div>
                        </Link>
                    </div>
                </div>

                <div></div>

                <div className="flex w-full max-w-max flex-row items-center justify-end ml-2 lg:min-w-[200px]">
                    {user ? (
                        <button type="button" className="relative inline-flex flex-shrink-0 flex-grow-0 cursor-pointer rounded-full bg-transparent p-2 ml-1" title={user.displayName}>
                            <Image src={user.photoURL} width={24} height={24} alt="User" className="rounded-full flex-shrink-0 flex-grow-0 bg-white" />
                        </button>
                    ) : (
                        <button type="button" className="relative inline-flex flex-shrink-0 flex-grow-0 cursor-pointer rounded-full bg-transparent p-2 ml-1">
                            <Image src="/user.jpg" width={24} height={24} alt="User" className="rounded-full flex-shrink-0 flex-grow-0 bg-white" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;