"use client";

import { useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from './login.module.css';

export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isNewUser) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: fullName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
  <h2 className={styles.heading}>{isNewUser ? "Register" : "Login"}</h2>

  {isNewUser && (
    <input
      className={styles.input}
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
    />
  )}

  <input
    className={styles.input}
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    className={styles.input}
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button className={styles.button} onClick={handleAuth}>
    {isNewUser ? "Register" : "Login"}
  </button>

  <p className={styles.toggle} onClick={() => setIsNewUser(!isNewUser)}>
    {isNewUser ? "Already have an account? Login" : "New user? Register"}
  </p>
</div>
  );
}