"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function UserAvatar({
  image,
  name,
}: {
  image?: string | null;
  name?: string | null;
}) {
  if (image) {
    return (
      <div
        className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={`${name ?? "User"} profile image`}
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
      {(name ?? "U").slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-lg font-semibold text-slate-900">ScrapeSmart AI</p>
          <p className="text-sm text-slate-500">
            SEO audits, scraping, and chat in one workspace.
          </p>
        </div>

        {status === "loading" ? (
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <UserAvatar image={session.user.image} name={session.user.name} />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {session.user.name ?? "Signed in"}
              </p>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}
