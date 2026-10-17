# Numera Academy

Laboratório interativo de **métodos numéricos** para a disciplina de Modelagem Computacional. Sete métodos (Bisseção, Falsa Posição, Ponto Fixo, Newton-Raphson, Secante, Eliminação de Gauss e Gauss-Seidel) em trilhas com lições, missões de modelagem, Arena, um **Treino de diagnóstico** com 140 exercícios, **modo prova** e um **Terminal** que mostra cada passo do cálculo, com gráfico de convergência.

É um site estático: HTML, CSS e JavaScript puros, sem build, sem servidor, sem conta e sem rastreadores. Funciona offline e pode ser instalado como app.

**Versão 9** · [O que mudou](CHANGELOG.md) · [Relatório técnico](RELATORIO-TECNICO.md) · [Treino: os 140 exercícios](TREINO.md) · [Qualidade: testes, acessibilidade e navegadores](QUALIDADE.md)

## Abrir

- **No computador, sem instalar nada:** extraia o ZIP e abra `dist/index.html` no navegador. Tudo funciona, inclusive o cálculo; só o modo offline instalável (PWA) exige abrir por um endereço `http(s)`.
- **Com um servidor local** (para testar o PWA): `python3 -m http.server 8000 -d dist` e abra http://localhost:8000.
- **Publicado no GitHub Pages:** veja [Publicar](#publicar-no-github-pages).

## O que tem

| Parte | Conteúdo |
|---|---|
| **Trilhas** | 7 métodos × 12 etapas = 84 etapas em três níveis, cada trilha com leitura guiada (6 telas) e simulação passo a passo da execução real: intervalo e corda (Falsa Posição), diagrama em teia (Ponto Fixo), tangente, secante, matriz e vetor |
| **Missões** | 7 problemas aplicados em três etapas (formular, calcular, interpretar): reservatório, taxa do carnê (Falsa Posição), órbita do cometa (Ponto Fixo), placa, sensor, mistura e equilíbrio térmico |
| **Arena** | 42 desafios com vidas, sequência e filtro por método |
| **Treino** | 140 problemas misturados (20 por método, 53 áreas): diagnosticar o método, resolver, conferir. Pergunta sem o nome do método até o diagnóstico, pistas grifadas, gabarito com passo a passo, gráfico de convergência e **369 erros típicos** reconhecidos |
| **Modo prova** | 5, 10 ou 15 questões sorteadas, cronômetro opcional, nota de 0 a 10 e relatório para imprimir ou salvar em PDF |
| **Revisão** | caderno com revisão espaçada (1, 3, 7 e 14 dias) das questões e dos diagnósticos errados do Treino |
| **Terminal** | equações de uma variável e sistemas lineares (2 a 6), teclado científico com expoentes elevados, busca automática de raízes com comparação de métodos, passo a passo, **aba Convergência**, verificação e modo guiado |
| **Progresso** | XP, níveis, estrelas, conquistas, sequência de dias e backup em JSON |

## Terminal em 30 segundos

```text
x³ - x - 2 = 0              busca automática: compara Bisseção, Falsa Posição, Newton e Secante
x = cos(x)                  com o método "Ponto Fixo", g(x) vem do lado direito
2x + y = 5                  sistemas: uma equação por linha
x + 3y = 6
```

Sintaxe: `x`, `^`, `*`, `/`, parênteses, multiplicação implícita (`2x`), `pi`, `e`, `sin`/`sen`, `cos`, `tan`/`tg`, `sqrt`, `abs`, `exp`, `ln`, `log` (base 10), `asin`, `acos`, `atan`, `sinh`, `cosh`. Ângulos em radianos. Ponto ou vírgula decimal. Comandos: `/help`, `/history`, `/clear`. Ctrl/⌘ + Enter resolve.

A aba **Convergência** roda todos os métodos a partir dos mesmos dados e desenha o erro |xₖ − x*| por iteração em escala logarítmica, com a ordem observada de cada um (Bisseção ≈ 1, Secante ≈ 1,6, Newton ≈ 2).

## Testes

```bash
npm run testar          # 1.505 verificações + gabarito do Treino refeito pelo motor + cache offline em dia
npm run servir          # em outro terminal, para os testes de navegador
npm run testar-navegador
```

| Suíte | O que confere | Resultado |
|---|---|---|
| `tests/verify.cjs` | motor, conteúdo, progresso, interface (DOM simulado), Treino, prova, revisão, PWA | 1.505 / 1.505 |
| `tests/treino/conferir-com-motor.cjs` | os 140 gabaritos (feitos com sympy/mpmath) refeitos pelo motor; 369 erros típicos; 140 gráficos | 0 divergências |
| `tests/terminal/` | 100 equações digitadas no navegador; 19 cenários do teclado; 1.400 equações no motor | 100 / 100 |
| `tests/e2e/testar-fluxos.mjs` | fluxos completos, teclado, celular, modo escuro, impressão do relatório | 41 / 41 |
| `tests/e2e/testar-offline.mjs` | o site abre e calcula sem internet | 10 / 10 |
| `tests/e2e/auditar-a11y.mjs` | axe-core, WCAG 2.1 AA, 25 telas no modo claro e no escuro | 0 violações |
| `tests/e2e/testar-webkit.py` | motor do Safari (WebKit) | 21 / 21 |
| `tests/e2e/checar-compat.mjs` | ES2021 e recursos suportados por Safari 15+, Firefox 90+, Chrome 90+ | 99 / 99 |

No GitHub, `.github/workflows/testes.yml` roda tudo isso a cada push. Detalhes em [QUALIDADE.md](QUALIDADE.md) e [TESTES-TERMINAL.md](TESTES-TERMINAL.md).

Antes de publicar uma mudança, rode `npm run atualizar`: ele acerta o número de verificações mostrado no site e a versão do cache offline.

## Publicar no GitHub Pages

1. Crie um repositório **público** no GitHub e envie esta pasta inteira (o `.gitignore` já deixa de fora `node_modules` e arquivos temporários):
   ```bash
   git init && git add . && git commit -m "Numera Academy v9"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/numera-academy.git
   git push -u origin main
   ```
2. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Pronto: a cada push na `main`, o workflow `Publicar no GitHub Pages` roda os testes e, se passarem, publica `dist/` em `https://SEU-USUARIO.github.io/numera-academy/`.

## Organização

```text
dist/                      o site (é isto que vai para o ar)
  index.html               página única; carrega os scripts na ordem certa e registra o service worker
  math-engine.js           motor numérico: interpretador sem eval, 7 métodos, busca automática, convergência
  content.js               trilhas, Arena, missões, aprofundamento e glossário
  progress.js              XP, estrelas, revisão, backup e migração
  convergencia.js/.css     gráfico de convergência (Terminal e gabarito do Treino)
  treino.js/.css           Treino, modo prova e revisão de diagnósticos
  treino-data.js           os 140 exercícios (GERADO por tests/treino/gerar-treino.py)
  app.js                   interface, navegação, Terminal, simulações e gráficos
  calculator.js/.css       teclado científico e escrita com expoentes elevados
  styles.css               identidade visual, modo escuro, celular, impressão
  sw.js, manifest.webmanifest, ícones   PWA (offline e instalação)
tests/                     verificações (Node), gerador do Treino (Python), navegador (Playwright, WebKit)
.github/workflows/         testes automáticos e publicação no GitHub Pages
previews/                  capturas de tela por versão
```

## Navegadores

Chrome/Edge 90+, Firefox 90+ e Safari 15+ (iOS 15+). Testado de verdade no Chromium e no WebKit (motor do Safari); o Firefox foi verificado por análise estática de compatibilidade. Detalhes em [QUALIDADE.md](QUALIDADE.md).

## Escopo e limites

Raízes de equações reais e sistemas lineares quadrados. Não resolve EDOs, integrais, interpolação, raízes complexas nem álgebra simbólica. "Automático" escolhe a execução aceita de menor custo no modelo declarado; não existe um método sempre mais rápido. A busca de raízes é amostrada: não encontrar uma raiz não prova que ela não existe. Resíduo pequeno não garante erro pequeno. Tudo isso está em [LIMITES-NUMERICOS.md](LIMITES-NUMERICOS.md).

## Dados e privacidade

O progresso fica no `localStorage` do navegador (chaves `numera-academy-v4`, `numera-treino-v9` e `numera-academy-v6-visitas`). Nada é enviado para servidor. Em navegação privada ou limpando os dados do site, o progresso some; use o backup em JSON na página Progresso. O progresso do Treino da v8 é trazido automaticamente para os 84 exercícios que não mudaram.

## Créditos

Projeto de Cauã De Angelis (Engenharia de Computação, UVA), para Modelagem Computacional. Interface inspirada na estrutura de plataformas de aprendizado interativo, sem copiar código, textos, ilustrações ou marcas de terceiros. Fórmulas e condições dos métodos conferidas nas referências listadas no [relatório técnico](RELATORIO-TECNICO.md).
