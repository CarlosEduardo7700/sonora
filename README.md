# Sonora

Aplicação web em Next.js para gerenciamento de alunos, períodos, aulas e acompanhamento de progresso musical. O projeto já está integrado ao Supabase e substituiu os mocks por leitura e gravação reais no banco.

## Visão geral

O fluxo atual cobre três áreas principais:

- Cadastro e listagem de períodos, com criação do período e de suas aulas no mesmo fluxo.
- Cadastro e listagem de alunos, vinculando cada aluno a um período e criando a matrícula e as aulas pendentes automaticamente.
- Página de detalhe do aluno, com atualização de nota e confirmação de aulas concluídas.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (`@supabase/supabase-js`)

## Estrutura principal

- `src/app` - rotas e Server Actions
- `src/components` - componentes de interface reutilizáveis
- `src/lib` - acesso aos dados e cliente do Supabase

## Rotas

- `/` - página inicial com atalhos para alunos e períodos
- `/periodos` - listagem e cadastro de períodos
- `/alunos` - listagem e cadastro de alunos
- `/alunos/[id]` - detalhe de uma matrícula de aluno, com nota e progresso por aula

## Funcionalidades

### Períodos

- Lista os períodos cadastrados no banco.
- Permite criar um período e, no mesmo fluxo, cadastrar as aulas dele.
- Exibe as aulas de cada período na listagem.

### Alunos

- Lista matrículas com nome, instrumento, período, nota e progresso.
- Permite cadastrar um aluno escolhendo um período existente.
- Cria automaticamente o aluno, a matrícula e os registros de aulas da matrícula com `concluida = false`.

### Detalhe do aluno

- Exibe nome, instrumento, período e barra de progresso.
- Permite salvar a nota da matrícula.
- Permite marcar/desmarcar aulas como concluídas com confirmação.

## Banco de dados

O projeto foi pensado para esta estrutura de tabelas no Supabase:

- `periodos` - períodos cadastrados
- `aulas` - aulas vinculadas a um período
- `alunos` - dados base do aluno
- `matriculas` - vínculo entre aluno e período, com nota
- `aula_matricula` - vínculo entre matrícula e aula, com status de conclusão

### Observação importante sobre segurança

Hoje o app usa a chave anônima do Supabase no cliente. Isso exige RLS e políticas corretas no banco. Sem isso, qualquer pessoa com acesso ao front-end pode consultar e alterar dados diretamente via API do Supabase.

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com estas chaves:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Instalação e execução

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

- `npm run dev` - inicia o ambiente de desenvolvimento
- `npm run build` - gera a build de produção
- `npm run start` - executa a build gerada
- `npm run lint` - roda o ESLint

## Validação

O projeto foi ajustado para passar em `tsc --noEmit` e `npm run lint`.

## Observações

- O login ainda não está implementado.
- O botão de sair no header é apenas visual por enquanto.
- O comportamento do app depende de o Supabase estar com RLS/policies configuradas corretamente para leitura e escrita.
