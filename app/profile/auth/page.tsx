"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
  setError("");
  setLoading(true);

  try {
    let response;

    if (isLogin) {
      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
    } else {
      response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, username, displayName }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/main");
    }
  } catch (err) {
    console.error(err);
    setError("Network error");
  }

  setLoading(false);
};

  return (
    <section className="screen">
      <section className="signupContainer">
        <div className="switch">
          <button
            onClick={() => setIsLogin(false)}
            className={!isLogin ? "activeSwitch" : ""}
          >
            Sign up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={isLogin ? "activeSwitch" : ""}
          >
            Login
          </button>
        </div>

        <div className="signup">
          {!isLogin && (
            <>
              <label>Username</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>Display Name</label>
              <input
                type="text"
                placeholder="display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="submitButton"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </section>
    </section>
  );
}
