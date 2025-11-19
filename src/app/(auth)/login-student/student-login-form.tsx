"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginStudentForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Credenziali non valide");
      }
      router.push("/student/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-600">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Accesso in corso..." : "Accedi"}
      </button>
    </form>
  );
}
