# Planning Poker Free

Aplicação web em português para estimativas em **camiseta (tempo)** com **uma sala única**, **WebSockets** via [PartyKit](https://partykit.io/) e interface com **tema claro/escuro**, **flip 3D** nas cartas, **contagem dramática de 3 segundos** antes da revelação, **gráfico de votos**, **anel de sincronia** e **confetes** quando há unanimidade (entre votos que contam nas estatísticas — café fica de fora).

## Regras do deck

| Carta | Significado |
|--------|-------------|
| XS | ~2 h |
| S | ~4 h |
| M | 6–8 h |
| L | ~16 h (~2 dias) |
| XL | 32–40 h (~5 dias) |
| ? | Desconhecido |
| Café | Pausa; **não** entra no cálculo de acordo nem nas barras |

## Arquitetura

- **Next.js 15** na Vercel: páginas, tema, API opcional do Jira (`/api/jira`).
- **PartyKit**: servidor em tempo real **sem banco** — estado só na party (memória), adequado a estrela de sucesso sem persistência durável.
- **Front** mantém o estado recebido após cada `STATE`; nova rodada zera votos no servidor e reabre o rascunho.

Por que PartyKit e não só Vercel? Funções serverless da Vercel não mantêm WebSocket long-lived; PartyKit roda na edge com o modelo certo para salas colaborativas.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Isso sobe o PartyKit (porta **1999**) e o Next em paralelo. Abra o endereço que o Next indicar (geralmente `http://localhost:3000`).

Fluxo:

1. **Anfitrião**: `/anfitriao` → nome da sala + nome → `/sala?host=1&...`.
2. **Convidados**: `/sala` → informam o nome → entram quando a sala já foi aberta.

Copie o link da sala (`/sala`) a partir do painel do anfitrião no **lobby**.

### Integração Jira (opcional)

Crie um token de API no Jira Cloud e configure no `.env.local`:

- `JIRA_BASE_URL` (ex.: `https://empresa.atlassian.net`)
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`

Sem essas variáveis, o botão “Buscar” apenas informa que a integração não está configurada.

## Testes

```bash
npm test
```

Cobertura voltada a **estatísticas e exclusão do café** (`shared/vote-stats.test.ts`).

## Deploy

1. **PartyKit**: `npx partykit deploy` no repositório; anote o host público (ex.: `*.partykit.dev`).
2. **Vercel**: importe o projeto Next; defina `NEXT_PUBLIC_PARTYKIT_HOST`, `NEXT_PUBLIC_PARTYKIT_PARTY` (padrão `main`) e `NEXT_PUBLIC_PARTYKIT_ROOM` (padrão `global-room`, alinhado a `ROOM_PARTY_ID` em `shared/types.ts`).

Veja `.env.example` para a lista completa.

## Estrutura útil

| Caminho | Conteúdo |
|---------|-----------|
| `party/index.ts` | Servidor PartyKit (mensagens + broadcast por conexão) |
| `party/engine-state.ts` / `reduce-message.ts` / `snapshot.ts` | Estado, regras e visibilidade das cartas |
| `shared/*` | Tipos, métricas de votação, contrato de mensagens |
| `src/app/sala/page.tsx` | Conexão + bootstrap host/convidado |
| `src/components/room-view.tsx` | Mesa, rascunho, votação, revelação, resultados |

## Licença

Conforme o arquivo `LICENSE` do repositório.
