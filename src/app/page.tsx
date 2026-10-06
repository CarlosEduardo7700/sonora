import { NavCard } from "@/components/nav-card";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Bem-vindo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha uma área para continuar.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NavCard
          href="/alunos"
          title="Listagem dos Alunos"
          description="Veja e gerencie os alunos cadastrados."
        />
        <NavCard
          href="/periodos"
          title="Listagem dos Períodos"
          description="Veja e gerencie os períodos cadastrados."
        />
      </section>
    </main>
  );
}
