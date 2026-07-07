"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (loading) {
    return <span className="text-sm text-warm-tan">…</span>;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Log in
      </Link>
    );
  }

  const displayEmail = user.email ?? "Account";

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-sm text-warm-muted sm:inline">
        {displayEmail}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm font-medium text-warm-muted transition-colors hover:text-warm-dark"
      >
        Sign out
      </button>
    </div>
  );
}
