"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("loggedIn") === "true";
    const userId = window.localStorage.getItem("userId");

    if (!loggedIn || !userId) {
      router.push("/login");
      return;
    }

    async function loadCourses() {
      try {
        const res = await fetch(`/api/courses?userId=${userId}`);
        const data = await res.json();
        setCourses(data);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [router]);

  async function handleDelete(id: string) {
    const userId = window.localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!confirm("Are you sure you want to delete this course?")) return;

    setDeletingId(id);
    try {
      await fetch("/api/courses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      });

      setCourses((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("loggedIn");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("email");
    router.push("/login");
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">My Courses</div>
          <div className="card-subtitle">
            Each logged-in user sees only their own courses.
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>

          <Link href="/courses/new" className="button">
            + New course
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading courses…</p>
      ) : courses.length === 0 ? (
        <p className="text-muted">
          No courses yet for this user. Create your first one.
        </p>
      ) : (
        <ul className="courses-list">
          {courses.map((c) => (
            <li key={c.id} className="course-item">
              <div className="course-title-row">
                <div>
                  <span className="course-title">{c.title}</span>
                  <span className="course-meta">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/courses/${c.id}/edit`} className="button button-secondary">
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>

              {c.description && (
                <div className="course-description">{c.description}</div>
              )}
            </li>

          ))}
        </ul>
      )}
    </div>
  );
}
