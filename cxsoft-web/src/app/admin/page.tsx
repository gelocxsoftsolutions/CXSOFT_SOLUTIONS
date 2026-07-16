"use client";

import * as React from "react";

type Quote = {
  id: string;
  created_at: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  project_type: string;
  budget: string;
  timeline: string;
  description: string;
};

export default function AdminPage() {
  const [secret, setSecret] = React.useState("");
  const [authenticated, setAuthenticated] = React.useState(false);
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes/admin?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Invalid secret");
      }
      const json = await res.json();
      setQuotes(json.data);
      setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 ring-1 ring-slate-200 shadow-lg"
        >
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">Admin</div>
            <div className="mt-1 text-sm text-slate-500">
              Enter secret to view submitted quotes
            </div>
          </div>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Secret"
            className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          {error ? (
            <div className="mt-2 text-xs font-medium text-rose-500">{error}</div>
          ) : null}
          <button
            type="submit"
            disabled={loading || !secret}
            className="mt-4 w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-400 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quote Submissions</h1>
            <p className="mt-1 text-sm text-slate-500">
              {quotes.length} submission{quotes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            No quotes submitted yet.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Company</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Phone</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Project</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Budget</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {q.full_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {q.company_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{q.email}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {q.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {q.project_type}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {q.budget}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {q.timeline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
