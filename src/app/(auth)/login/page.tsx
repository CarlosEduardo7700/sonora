"use client";

import { useState } from "react";
import { signIn } from "@/actions/auth";

const styles = {
  main: "mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-12 sm:px-8",
  form: "flex flex-col gap-4",
  input: "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none",
  title: "text-2xl font-semibold font-medium text-foreground",
  subtitle: "mt-1 text-sm text-muted-foreground",
  error: "text-sm text-red-600",
  label: "flex flex-col gap-1 text-sm font-medium text-foreground",
  button: "mt-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60",
};

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
    <main className={styles.main}>

      <div>
        <h1 className={styles.title}>
          Entrar
        </h1>
        <p className={styles.subtitle}>
          Acesse sua conta para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>

        <label className={styles.label}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
            className={styles.input}
          />
        </label>

        {erro && <p className={styles.error}>{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className={styles.button}
        >
          {enviando ? "Entrando..." : "Entrar"}
        </button>

      </form>
      
    </main>
  );
}
