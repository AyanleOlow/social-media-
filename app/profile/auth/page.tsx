 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import "./page.css";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else router.push("/");
    } else {
      // Signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
          },
        },
      });

      if (error) setError(error.message);
      else if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          username,
          display_name: displayName,
        });
        router.push("/main");
      }
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
