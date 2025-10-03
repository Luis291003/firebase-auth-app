"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function HomePage() {
  // State
  const [user, setUser] = useState<any>(null); // Store the currently logged-in user
  const router = useRouter();  // Next.js router for navigation

  // Check authentication on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUser(user); // Set user if logged in
      else router.push("/login"); // Redirect to login if not authenticated
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth); // Sign out the user
    router.push("/login"); // Redirect to login page
  };

  // Loading state while checking auth
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