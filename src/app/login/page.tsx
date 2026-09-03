"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("teacher@example.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        return;
      }

      const data = await res.json();

      // Αποθήκευση στοιχείων χρήστη
      window.localStorage.setItem("loggedIn", "true");
      window.localStorage.setItem("userId", data.id);
      if (data.email) {
        window.localStorage.setItem("email", data.email);
      }

      router.push("/courses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Sign in</div>
          <div className="card-subtitle">
            Each email has its own courses.
          </div>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@example.com"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-error" style={{ marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <div className="btn-row">
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
