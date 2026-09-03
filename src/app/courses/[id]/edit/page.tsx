"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("loggedIn") === "true";
    const userId = window.localStorage.getItem("userId");

    if (!loggedIn || !userId) {
      router.push("/login");
      return;
    }

    if (!courseId) {
      setError("Missing course id");
      setLoading(false);
      return;
    }

    async function loadCourse() {
      try {
        // Φέρνουμε όλα τα courses του χρήστη
        const res = await fetch(`/api/courses?userId=${userId}`);
        if (!res.ok) {
          setError("Failed to load courses");
          return;
        }
        const data: Course[] = await res.json();
        const course = data.find((c) => c.id === courseId);

        if (!course) {
          setError("Course not found");
          return;
        }

        setTitle(course.title || "");
        setDescription(course.description || "");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const userId = window.localStorage.getItem("userId");
    if (!userId) {
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: courseId,
          title,
          description,
          userId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to update course");
        return;
      }

      router.push("/courses");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted">Loading course…</p>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Edit Course</div>
          <div className="card-subtitle">
            Change the course title or description.
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
          <button
            type="button"
            className="button button-secondary"
            onClick={() => router.push("/courses")}
          >
            Cancel
          </button>
          <button type="submit" className="button" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
