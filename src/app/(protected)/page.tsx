import { NavCard } from "@/components/ui/nav-card";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 sm:px-8",
  title: "text-2xl font-semibold tracking-tight text-foreground",
  subtitle: "mt-1 text-sm text-muted-foreground",
  section: "grid grid-cols-1 gap-4 sm:grid-cols-2",
}; 

export default function Home() {
  return (
    <main className={styles.main}>

      <div>
        <h1 className={styles.title}>
          Bem-vindo!
        </h1>
        <p className={styles.subtitle}>
          Escolha uma área para continuar.
        </p>
      </div>

      <section className={styles.section}>
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
