# Planning Poker Free

Aplicação web em português para estimativas em **camiseta (tempo)** com **salas por token** (cada anfitrião gera um token; o Party room id é esse token), **WebSockets** via [PartyKit](https://partykit.io/) e interface com **tema claro/escuro**, **flip 3D** nas cartas, **contagem dramática de 3 segundos** antes da revelação, **gráfico de votos**, **anel de sincronia** e **confetes** quando há unanimidade (entre votos que contam nas estatísticas — café fica de fora).

Cada aparelho guarda no **localStorage** um `pp_user_id` (timestamp + sufixo aleatório de 8 caracteres) usado como id estável do WebSocket, e a lista de **sessões recentes** com token, nome, papel (anfitrião/convidado) e `lastConnectedAt`. Reconexão automática ao abrir `/sala` sem query só acontece se a última atividade tiver **menos de 10 minutos**; convite: `/sala?token=<token>` (também `name=` para pular o formulário quando reconecta).

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

- **Next.js 15** na Vercel: UI, tema, rotas estáticas.
- **PartyKit**: servidor em tempo real **sem banco** — estado só em memória da party, alinhado ao requisito de "sem persistência durável".
- **Front** mantém o estado após cada `STATE`; nova rodada zera votos e volta à fase de preparo (`draft`) antes de nova votação.

Por que PartyKit e não só Vercel? O app Next na Vercel **não** termina o WebSocket: o **browser fala em tempo real com o host do PartyKit** (ex.: `*.partykit.dev`). Funções serverless da Vercel não mantêm conexão WS; a sala fica no PartyKit. Ajustes de **reconexão** (valores em `src/lib/party-socket-options.ts`), **PING** periódico, retomada em `online` e ao voltar a aba, e badge **Reconectando** cobrem quedas de rede ou throttling de aba — não têm a ver com “múltiplas máquinas” da Vercel no request HTTP.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Isso sobe o PartyKit (porta **1999**) e o Next em paralelo. Abra o endereço que o Next indicar (geralmente `http://localhost:3000`).

Fluxo:

1. **Anfitrião**: `/anfitriao` → gera `token` → `/sala?host=1&room=…&name=…&token=…`.
2. **Convidados**: abrem o link com `token` (ex. `/sala?token=…`) → informam o nome (ou vêm de sessão com `name=` se reconexão) → entram quando a sala já foi aberta.

Copie a URL completa a partir do **lobby** (inclui o query `token`).

## Testes

```bash
npm test
```

Cobertura focada nos pontos de risco: estatísticas e exclusão do café (`shared/vote-stats.test.ts`), máquina de estados do servidor (`party/reduce-message.test.ts`) e visibilidade de votos por fase (`party/snapshot.test.ts`).

## Deploy

1. **PartyKit**: `npx partykit deploy` no repositório; anote o host público (ex.: `*.partykit.dev`).
2. **Vercel**: importe o projeto Next; defina `NEXT_PUBLIC_PARTYKIT_HOST` e `NEXT_PUBLIC_PARTYKIT_PARTY` (padrão `main`). Cada convite usa o **token** no path da room do PartyKit (não é necessário `NEXT_PUBLIC_PARTYKIT_ROOM` fixo).

Veja `.env.example` para a lista completa.

## Estrutura útil

| Caminho | Conteúdo |
|---------|-----------|
| `party/index.ts` | Servidor PartyKit (mensagens + broadcast por conexão) |
| `party/engine-state.ts` / `reduce-message.ts` / `snapshot.ts` | Máquina de estados, regras e visibilidade dos votos |
| `shared/*` | Tipos, contrato Zod e métricas de votação compartilhados entre cliente e servidor |
| `src/app/sala/page.tsx` | Conexão + bootstrap host/convidado |
| `src/components/room-view.tsx` | Orquestrador: cabeçalho, mesa, fase atual, resultados |
| `src/components/room/*.tsx` | Painéis por fase (lobby, draft, voting, revealed, header, banners) |
| `src/lib/constants.ts` | Constantes (feedback de cópia, etc.) |
| `src/lib/user-id.ts` / `room-sessions.ts` / `room-token.ts` / `invite-url.ts` | Id de cliente, sessões 10 min, geração de token, URL de convite |
| `src/lib/party-socket-options.ts` | Atrasos/timeout de reconexão e intervalo de PING para o `PartySocket` |

## Licença

Conforme o arquivo `LICENSE` do repositório.
