"use client";

import { useState } from "react";
import { auth } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from './login.module.css';

// State
export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  // Auth handler (register/login)
  const handleAuth = async () => {
  // Input validation
  if (!email || !password) {
    setErrorMessage("Email and password are required.");
    return;
  }

  if (isNewUser && password.length < 6) {
    setErrorMessage("Password must be at least 6 characters.");
    return;
  }

  try {
    setErrorMessage("");
    if (isNewUser) {
      // Registration
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) {
        await updateProfile(userCred.user, { displayName: fullName });
      }
    } else {
      // Login
      await signInWithEmailAndPassword(auth, email, password);
    }

    router.push("/"); // Navigate to home
  } catch (err: any) {
    // Firebase error handling
    switch (err.code) {
      case "auth/invalid-credential":
        setErrorMessage("Wrong credentials. Please try again.");
        break;
      case "auth/email-already-in-use":
        setErrorMessage("This email is already registered. Try logging in.");
        break;
      case "auth/invalid-email":
        setErrorMessage("Invalid email format.");
        break;
      case "auth/weak-password":
        setErrorMessage("Password is too weak. Minimum 6 characters.");
        break;
      default:
        setErrorMessage(err.message);
        break;
    }
  }
};

  // JSX
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
    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    {isNewUser ? "Register" : "Login"}
  </button>

  <p className={styles.toggle} onClick={() => setIsNewUser(!isNewUser)}>
    {isNewUser ? "Already have an account? Login" : "New user? Register"}
  </p>
</div>
  );
}