"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("loggedIn") === "true";
    const userId = window.localStorage.getItem("userId");

    if (!loggedIn || !userId) {
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const userId = window.localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to create a course.");
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, userId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create course");
        return;
      }

      router.push("/courses");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">New Course</div>
          <div className="card-subtitle">
            Create a new course for the currently logged-in user.
          </div>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Description</label>
          <textarea
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        {error && (
          <p className="text-error" style={{ marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <div className="btn-row">
          <button type="submit" className="button" disabled={saving}>
            {saving ? "Saving..." : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
}
