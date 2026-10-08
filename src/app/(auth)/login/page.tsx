"use client";

import { useState } from "react";
import { signIn } from "@/actions/auth";

const inputClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !senha.trim()) return;

    setEnviando(true);
    setErro(null);
    const resultado = await signIn(email, senha);
    if (resultado?.error) {
      setErro(resultado.error);
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-12 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Entrar
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse sua conta para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
            className={inputClassName}
          />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
