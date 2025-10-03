"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Hey, {user.displayName || "User"}! You’re successfully logged in.
      </h1>
      <button className={styles.button} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}