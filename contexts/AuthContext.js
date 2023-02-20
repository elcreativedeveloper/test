import React, { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithRedirect } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userSignedIn, setUserSignedIn] = useState(null);

    initializeApp({
        apiKey: "AIzaSyCbeiP66A3aS68k7JJYOrIr5_jHvQ50OVI",
        authDomain: "materia-auth.firebaseapp.com",
        projectId: "materia-auth",
        storageBucket: "materia-auth.appspot.com",
        messagingSenderId: "497337413673",
        appId: "1:497337413673:web:357a3bdbe41624fd86ac38",
        measurementId: "G-YSV1HV0BJS",
    });

    useEffect(() => {
        const firebaseAuth = getAuth();
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) {
                setUserSignedIn(currentUser)
            } else {
                const authProviderGoogle = new GoogleAuthProvider();
                signInWithRedirect(firebaseAuth, authProviderGoogle).then(() => {

                }).catch((error) => {
                    console.log(error)
                })
            };

            return () => unsubscribe()
        });
    }, []);

    return (
        <AuthContext.Provider value={userSignedIn}>
            {children}
        </AuthContext.Provider>
    )
};