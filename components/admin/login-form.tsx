"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/actions/auth";
import { adminButton, errorText, input, label } from "./ui";

type Labels = { password: string; submit: string; wrong: string; locked: string };

export function LoginForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const error = state?.error === "locked" ? labels.locked : state?.error === "wrong" ? labels.wrong : null;

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="password" className={label}>
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className={`${input} mt-2`}
        />
        {error && (
          <p id="login-error" role="alert" className={errorText}>
            {error}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={`${adminButton.primary} w-full`}>
        {labels.submit}
      </button>
    </form>
  );
}
