# Handoff — Landing Page Ambiente Simulado PRF

Landing page de vendas (alta conversão) para os **Simulados PRF no padrão CEBRASPE** da marca **Ambiente Simulado PRF** (@simulados.prf).

---

## 1. O que é este pacote

Este NÃO é só um mockup: é um **site estático completo e funcional** (HTML + CSS + JavaScript puro, sem build, sem framework). Pode ser:

- **Publicado direto** como site estático (recomendado para subir rápido no EasyPanel — ver seção 7); ou
- **Recriado dentro de um projeto** (Next.js, Astro, etc.) seguindo o mesmo padrão visual e de comportamento descrito abaixo.

Para tráfego pago de Instagram (público majoritariamente mobile), a forma mais rápida e barata é publicar o estático como está e só preencher os dados reais (seção 6).

**Fidelidade:** Alta (hi-fi). Cores, tipografia, espaçamentos, ícones e interações estão finais. Se for recriar em outro framework, reproduza pixel a pixel usando os tokens da seção 4.

---

## 2. Estrutura dos arquivos

```
design_handoff_ambiente_simulado_prf/
├── site/                  ← tudo que vai pro servidor
│   ├── index.html         ← a landing inteira (1 página)
│   ├── styles.css         ← todo o estilo (variáveis CSS no topo)
│   ├── app.js             ← interações (FAQ, modal, cupom, exit-intent, contador)
│   └── logos/
│       ├── emblem-light.png   ← emblema espartano (hero, autoridade, rodapé, marca d'água)
│       └── qr-navy.png        ← QR do Instagram (rodapé)
├── Dockerfile             ← imagem Nginx servindo o site/
├── nginx/default.conf     ← cache de assets + gzip
├── .dockerignore
└── README.md              ← este arquivo
```

Tudo em `site/` usa caminhos **relativos** (`styles.css`, `app.js`, `logos/...`), então funciona em qualquer subpasta/domínio sem ajuste.

Fontes: carregadas via Google Fonts no `<head>` (Oswald, Source Sans 3, IBM Plex Mono). Precisa de internet no cliente; se quiser 100% offline, baixe os `.woff2` e troque os `@import`/`<link>` por `@font-face` locais.

---

## 3. Seções da página (ordem)

1. **Promo bar** (topo) — cupom `SIMULADOS20` = 20% OFF no Pacote Completo (botão copiar + fechar).
2. **Hero** — marca, headline, subtítulo, 2 CTAs, faixa de confiança e a **pilha de capas animada** (PRF 2026/2027) com emblema.
3. **Compra rápida** — 3 planos compactos para quem decide rápido.
4. **Dor** — checklist de identificação (ícones).
5. **Solução** — 2 pilares (simulados inéditos + provas anteriores).
6. **Incluído** — grade de cards do que vem no pacote.
7. **Como funciona** — 4 passos.
8. **Benefícios** — antes × depois.
9. **Prova social** — 3 estatísticas + 3 depoimentos.
10. **Autoridade** — credenciais da marca.
11. **Oferta** — barra de prova social, **tabela de 3 planos** (Pacote Completo destacado), **value stack / ancoragem**, formas de pagamento, selo de segurança.
12. **Bônus** — 4 bônus do pacote.
13. **Garantia** — selo de 7 dias.
14. **FAQ** — acordeão.
15. **CTA final** — urgência + contador.
16. **Rodapé** — marca, QR Instagram, links, aviso legal.
17. **CTA fixo (sticky)** — só no mobile.
18. **Modal de cupom** — estados "cupom" e "upsell".

Cada seção tem `data-screen-label` para referência.

---

## 4. Design tokens (variáveis em `styles.css` → `:root`)

**Cores**
- Azul-marinho: `--navy-950 #061322`, `--navy-900 #081627`, `--navy-800 #0A1B33`, `--navy-700 #0E2A4D`, `--navy-600 #14365e`
- Dourado (CTA/destaque): `--gold #F2A900`, `--gold-300 #FFB81C`, `--gold-700 #c98a00`
- Grafite (rodapé): `--graphite #11151c`
- Claros: `--paper #F7F5F0`, `--paper-2 #EFECE4`
- Texto: `--ink #14181f`, `--ink-2 #3c4654`, `--ink-3 #6a7585`
- Status: `--green oklch(0.56 0.10 152)`, `--red oklch(0.55 0.16 26)`

**Tipografia**
- Títulos: `Oswald` (600/700), caixa alta, condensada
- Corpo: `Source Sans 3` (400/600/700)
- Mono (detalhes/labels): `IBM Plex Mono`

**Forma**
- Raio: `--radius 14px`, `--radius-sm 9px`, botões 10px
- Sombras: `--shadow-card`, `--shadow-gold` (definidas no `:root`)

**Breakpoints**: `980px` (tablet) e `620px` (mobile). Mobile-first é prioridade — maioria do tráfego é celular.

**Marca placeholder:** o `.ph` (dourado tracejado) marca textos a preencher. Veja seção 6.

---

## 5. Interações (em `app.js`)

- **FAQ** — acordeão (abre um, fecha os outros) com altura animada.
- **CTA fixo mobile** — aparece após o hero, some quando a oferta está visível.
- **Reveal on scroll** — `.reveal` ganha `.in` via IntersectionObserver (respeita `prefers-reduced-motion`).
- **Contador** — 48h "rolantes" guardadas em `localStorage` (`prf_deadline`). **Trocar por prazo/lote real** se a urgência for verdadeira.
- **Copiar cupom** — `navigator.clipboard` com fallback.
- **Modal de cupom (2 modos):**
  - `mode-code` (Pacote Completo) → mostra o código `SIMULADOS20`.
  - `mode-upsell` (avulso/provas) → o cupom é **exclusivo do Pacote Completo**; mostra comparação e botão de upgrade que reabre em `mode-code`.
  - Disparado por qualquer botão com `[data-buy]` (`pacote` / `avulso` / `provas`) + `[data-price]`.
- **Popup do cupom (1× por sessão, `sessionStorage` `prf_exit`):**
  - **45s na página** → "Garanta 20% OFF agora".
  - **Exit-intent** → desktop (mouse sai pelo topo) e mobile (botão voltar) → "Leve 20% OFF antes de sair".
  - Ajuste o tempo no `setTimeout(..., 45000)` em `app.js`.

> O cupom `SIMULADOS20` (20%) está no HTML (`data-code`, texto) e nas mensagens do `app.js`. Para mudar valor/código, faça find-and-replace por `SIMULADOS20` e `20%` / `R$ 157,60`.

---

## 6. Placeholders a preencher antes de publicar

Marcados visualmente com `.ph` (dourado + sublinhado tracejado). Buscar por `class="ph"` no `index.html`:

- **Preços/parcelas:** R$ 27 (avulso), R$ 397→R$ 197 / 12x R$ 19,90 (pacote), R$ 47 (provas), economia R$ 200, value stack (R$ 247/47/103) e cupom (R$ 157,60).
- **Prova social:** +3.200 alunos, nota 4,8/5, 2.560 questões.
- **Depoimentos:** nomes, cidade/UF e textos (hoje são exemplos).
- **Entrega/acesso:** "PDF + área de membros", "vitalício".
- **Autoridade:** nome/equipe da marca.
- **Urgência:** status real do edital/lote no CTA final.
- **Rodapé:** Nome da empresa / CNPJ.
- **Checkout:** todos os botões de compra usam `href="#"` — trocar pelos links reais do gateway (Hotmart/Kiwify/Eduzz/etc.) e mapear o cupom `SIMULADOS20` lá. O texto "[Conectar ao checkout real]" no modal sinaliza isso.

Remova a regra visual do `.ph` quando os dados forem reais (ou apenas tire a classe `ph`).

---

## 7. Deploy no EasyPanel

O site é estático servido por Nginx (Dockerfile incluso). Duas formas:

### Opção A — App via Git + Dockerfile (recomendada)
1. Suba esta pasta para um repositório Git (GitHub/GitLab).
2. No EasyPanel: **Create → App**.
3. **Source:** conecte o repositório (e a branch).
4. **Build:** selecione **Dockerfile** (o EasyPanel detecta o `Dockerfile` na raiz).
5. **Port:** `80`.
6. **Deploy.** Em **Domains**, adicione seu domínio e ative **HTTPS (Let's Encrypt)**.

### Opção B — Serviço "Static" (sem Docker)
Se preferir o template estático do EasyPanel: aponte a pasta publicada para `site/` (root do conteúdo). Sem necessidade do Dockerfile.

### Testar local antes
```bash
cd design_handoff_ambiente_simulado_prf
docker build -t ambiente-prf .
docker run -p 8080:80 ambiente-prf
# abrir http://localhost:8080
```

> Dica: o `nginx/default.conf` já liga gzip e cache de 30 dias nos assets. Se trocar imagens com o mesmo nome, faça um redeploy para invalidar o cache do navegador (ou renomeie o arquivo).

---

## 8. Padrão a manter (para futuras alterações)

- **Ritmo visual:** seções alternam fundo escuro (azul-marinho) e claro (off-white). CTA dourado a cada 1–2 seções, sempre apontando para a oferta.
- **Hierarquia:** título Oswald caixa alta + subtítulo Source Sans + corpo claro. Nada de emoji — use os ícones SVG do sprite (`#i-ticket`, `#i-star`, `#i-shield`, `#i-check`, `#i-x`, etc. no topo do `index.html`).
- **Cards:** padding contido e proporcional; sombra suave; raio 14px.
- **Cor:** só as variáveis do `:root`. Evite inventar cores novas.
- **Cupom:** sempre exclusivo do Pacote Completo (mantenha a lógica de upsell).
- **Mobile-first:** valide qualquer mudança a ~390px (maioria do público).

---

## 9. Roadmap de conversão (próximos passos sugeridos)

Alto impacto: prova social real (prints/aprovações), VSL no hero, notificações "X comprou agora", FAQ da objeção de preço (custo por questão), captura de lead (1 simulado grátis) + pixel/remarketing. Médio: garantia mais ousada, order bump no checkout, contador ligado a lote real. Avançado: A/B test de headline e preço.
