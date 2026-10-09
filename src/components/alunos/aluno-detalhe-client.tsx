"use client";

import { useState } from "react";
import Link from "next/link";
import {
  adicionarPeriodoAoAluno,
  atualizarConclusaoAula,
  atualizarNota,
  trocarPeriodoMatricula,
} from "@/actions/alunos-detalhes";
import type { Aluno } from "@/repositories/alunos";
import type {
  AulaDaMatricula,
  MatriculaDetalhe,
  MatriculaDoAluno,
} from "@/repositories/matriculas";
import type { Periodo } from "@/repositories/periodos";
import { PeriodoSwitcher } from "@/components/alunos/periodo-switcher";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ConfirmarAulaModal } from "@/components/alunos/confirmar-aula-modal";
import { NovoPeriodoAlunoModal } from "@/components/alunos/novo-periodo-aluno-modal";
import { AulaCheckCard } from "@/components/alunos/aula-check-card";

const styles = {
  alunoDetalheContainer: "flex flex-col gap-1",
  erro: "text-sm text-red-600",
  form: "flex flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm",
  formRow: "flex items-center gap-3",
  formHeader: "flex items-center justify-between",
  aulasContainer: "flex flex-col gap-3",
  formHeaderTitle: "text-lg font-semibold text-card-foreground",
  formHeaderNota: "rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground",
  formInput: "w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none",
  formSubmitButton: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60",
  alunoInfo: "flex items-center gap-1 text-sm text-muted-foreground",
  addPeriodoButton: "flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-medium text-foreground transition-colors hover:border-primary hover:text-primary",
  nomeAluno: "text-2xl font-semibold tracking-tight text-foreground",
  backButton: "self-start text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
};

type AlunoDetalheClientProps = {
  aluno: Aluno;
  matricula: MatriculaDetalhe | null;
  periodosDoAluno: MatriculaDoAluno[];
  todosPeriodos: Periodo[];
};

export function AlunoDetalheClient({
  aluno,
  matricula: matriculaInicial,
  periodosDoAluno: periodosIniciais,
  todosPeriodos,
}: AlunoDetalheClientProps) {
  const [matricula, setMatricula] = useState(matriculaInicial);
  const [periodosDoAluno, setPeriodosDoAluno] = useState(periodosIniciais);
  const [modalPeriodoAberto, setModalPeriodoAberto] = useState(false);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [aulaSelecionada, setAulaSelecionada] =
    useState<AulaDaMatricula | null>(null);
  const [notaDraft, setNotaDraft] = useState(
    matriculaInicial?.nota != null ? String(matriculaInicial.nota) : ""
  );
  const [salvandoAula, setSalvandoAula] = useState(false);
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [trocandoPeriodo, setTrocandoPeriodo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const aulas = matricula?.aulas ?? [];
  const totalAulas = aulas.length;
  const aulasConcluidas = aulas.filter((aula) => aula.concluida).length;
  const percentual =
    totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  async function handleTrocarPeriodo(matriculaId: string) {
    if (matriculaId === matricula?.matriculaId) return;

    setTrocandoPeriodo(true);
    setErro(null);
    try {
      const novaMatricula = await trocarPeriodoMatricula(
        aluno.id,
        matriculaId
      );
      setMatricula(novaMatricula);
      setNotaDraft(
        novaMatricula.nota !== null ? String(novaMatricula.nota) : ""
      );
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao trocar período"
      );
    } finally {
      setTrocandoPeriodo(false);
    }
  }

  const periodosNaoMatriculados = todosPeriodos.filter(
    (periodo) => !periodosDoAluno.some((item) => item.periodoId === periodo.id)
  );

  function fecharModalPeriodo() {
    setModalPeriodoAberto(false);
    setErroModal(null);
  }

  async function handleAdicionarPeriodo(periodoId: string) {
    setErroModal(null);
    try {
      const resultado = await adicionarPeriodoAoAluno(
        aluno.id,
        periodoId
      );
      setPeriodosDoAluno(resultado.periodosDoAluno);
      setMatricula(resultado.matricula);
      setNotaDraft(
        resultado.matricula.nota !== null ? String(resultado.matricula.nota) : ""
      );
      setModalPeriodoAberto(false);
    } catch (error) {
      setErroModal(
        error instanceof Error ? error.message : "Erro ao adicionar período"
      );
    }
  }

  async function handleConfirmar() {
    if (!aulaSelecionada || !matricula) return;
    const novoEstado = !aulaSelecionada.concluida;

    setSalvandoAula(true);
    setErro(null);
    try {
      await atualizarConclusaoAula(
        matricula.matriculaId,
        aulaSelecionada.aulaId,
        novoEstado
      );
      setMatricula((prev) =>
        prev && {
          ...prev,
          aulas: prev.aulas.map((aula) =>
            aula.aulaId === aulaSelecionada.aulaId
              ? { ...aula, concluida: novoEstado }
              : aula
          ),
        }
      );
      setAulaSelecionada(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao atualizar aula");
    } finally {
      setSalvandoAula(false);
    }
  }

  async function handleSalvarNota(event: React.FormEvent) {
    event.preventDefault();
    if (!matricula) return;
    const valor = notaDraft.trim() === "" ? null : Number(notaDraft);
    if (valor !== null && (Number.isNaN(valor) || valor < 0 || valor > 10)) {
      return;
    }

    setSalvandoNota(true);
    setErro(null);
    try {
      await atualizarNota(matricula.matriculaId, valor);
      setMatricula((prev) => prev && { ...prev, nota: valor });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar nota");
    } finally {
      setSalvandoNota(false);
    }
  }

  return (
    <>
      <Link
        href="/alunos"
        className={styles.backButton}
      >
        ← Voltar para a listagem
      </Link>

      <div className={styles.alunoDetalheContainer}>

        <h1 className={styles.nomeAluno}>
          {aluno.nome}
        </h1>

        <div className={styles.alunoInfo}>

          <span>{aluno.instrumento}</span>

          <span>·</span>

          {matricula ? (
            <PeriodoSwitcher
              periodoAtual={matricula.nomePeriodo}
              periodos={periodosDoAluno}
              matriculaAtualId={matricula.matriculaId}
              disabled={trocandoPeriodo}
              onSelecionar={handleTrocarPeriodo}
            />
          ) : (
            <span>Sem período</span>
          )}

          <button
            type="button"
            onClick={() => setModalPeriodoAberto(true)}
            aria-label="Adicionar período"
            className={styles.addPeriodoButton}
          >
            +
          </button>

        </div>

      </div>

      {matricula && (

        <div
          className={`flex flex-col gap-6 ${
            trocandoPeriodo ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <ProgressBar
            value={percentual}
            label={`${aulasConcluidas} de ${totalAulas} aulas concluídas`}
          />

          {erro && <p className={styles.erro}>{erro}</p>}

          <form
            onSubmit={handleSalvarNota}
            className={styles.form}
          >

            <div className={styles.formHeader}>

              <h2 className={styles.formHeaderTitle}>
                Nota do período
              </h2>

              {matricula.nota !== null && (
                <span className={styles.formHeaderNota}>
                  {matricula.nota.toFixed(1)}
                </span>
              )}

            </div>

            <div className={styles.formRow}>

              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="0.0 a 10.0"
                value={notaDraft}
                onChange={(event) => setNotaDraft(event.target.value)}
                className={styles.formInput}
              />

              <button
                type="submit"
                disabled={salvandoNota}
                className={styles.formSubmitButton}
              >
                {salvandoNota ? "Salvando..." : "Salvar nota"}
              </button>

            </div>

          </form>

          <div className={styles.aulasContainer}>
            {aulas.map((aula) => (
              <AulaCheckCard
                key={aula.aulaId}
                aula={aula}
                onToggle={() => setAulaSelecionada(aula)}
              />
            ))}
          </div>

        </div>
      )}

      <NovoPeriodoAlunoModal
        open={modalPeriodoAberto}
        onClose={fecharModalPeriodo}
        onConfirmar={handleAdicionarPeriodo}
        periodosDisponiveis={periodosNaoMatriculados}
        erro={erroModal}
      />

      <ConfirmarAulaModal
        aula={aulaSelecionada}
        salvando={salvandoAula}
        onClose={() => setAulaSelecionada(null)}
        onConfirmar={handleConfirmar}
      />
    </>
  );
}
