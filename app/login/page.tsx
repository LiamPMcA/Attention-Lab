import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="px-6 py-16">
      <Suspense fallback={<p className="text-center text-warm-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
