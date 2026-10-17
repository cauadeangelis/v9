# Histórico de versões

## v9 — sete métodos, convergência, modo prova e projeto profissional

**Conteúdo**
- **Falsa Posição** e **Ponto Fixo** completos: motor (`falsePosition`, `fixedPoint`), Terminal, trilhas de 12 etapas com leitura guiada e simulação (corda e diagrama em teia), orientações, aprofundamento, 12 desafios novos na Arena e duas missões (taxa embutida num carnê; posição de um cometa pela equação de Kepler).
- As trilhas seguem a ordem clássica do curso: Bisseção, Falsa Posição, Ponto Fixo, Newton-Raphson, Secante, Gauss e Gauss-Seidel. Agora são 84 etapas, 42 desafios, 7 missões e 147 atividades com progresso.
- Glossário com **contração** e **ordem de convergência**.

**Gráfico de convergência** (`convergencia.js`)
- Nova aba **Convergência** no Terminal e gráfico no gabarito de cada exercício do Treino: erro |xₖ − x*| por iteração, em escala logarítmica, com todos os métodos aplicados aos mesmos dados de partida.
- Ordem observada calculada pelos próprios dados (inclinação de ln eₖ₊₁ contra ln eₖ): Bisseção ≈ 1 com fator 0,5; Secante ≈ 1,6; Newton ≈ 2. Em sistemas, Gauss-Seidel contra Jacobi.
- Cores validadas para daltonismo e contraste nos dois temas, legenda com a ordem e os passos até 10⁻⁸, dica ao passar o mouse, navegação pelo teclado (setas) e tabela com os números.

**Treino** (140 exercícios)
- 40 exercícios novos (20 de Falsa Posição e 20 de Ponto Fixo); total de 140, 20 por método, 53 áreas, ordem misturada sem métodos repetidos em sequência.
- A pergunta aparece **sem o nome do método** até o diagnóstico.
- **Dicas por erro típico:** 369 erros previstos e explicados (uma iteração a menos ou a mais, metade errada do intervalo, sinal trocado na fórmula, calculadora em graus, f(x) no lugar de x, Jacobi no lugar de Gauss-Seidel, lado direito esquecido no escalonamento, ordem trocada das incógnitas, outra raiz da equação…).
- Exercícios da v8 revisados para continuar coerentes com sete métodos: as pistas da Bisseção agora falam em cota de erro ou curva torta demais para a corda; os palpites da Secante deixaram de cercar a raiz; Wien e Bishop passaram para o Ponto Fixo; Kepler (Newton) ganhou órbita alongada, em que a iteração direta é lenta.
- **Modo prova:** 5, 10 ou 15 questões, cronômetro opcional, nota (0,4 pelo método e 0,6 pela resposta), relatório para imprimir ou salvar em PDF e histórico das últimas provas.
- **Revisão espaçada dos diagnósticos** errados (1, 3, 7 e 14 dias), integrada ao caderno de Revisão e à contagem do topo.
- Progresso da v8 trazido automaticamente para os 84 exercícios que não mudaram.

**Profissionalização**
- **PWA:** manifesto, ícones, service worker com cache versionado pelo conteúdo e botão “Instalar como app”. Depois da primeira visita, o site abre e calcula sem internet.
- **Testes automáticos no GitHub** (`.github/workflows/testes.yml`) e **publicação no GitHub Pages** (`pages.yml`), só quando os testes passam.
- **Acessibilidade:** auditoria com axe-core (WCAG 2.1 AA) em 25 telas, nos modos claro e escuro, com 0 violações. Contraste do texto secundário corrigido, atributos ARIA corrigidos e fluxo completo pelo teclado testado.
- **Navegadores:** testes no motor do Safari (WebKit) e verificação estática para Safari 15+, Firefox 90+ e Chrome 90+. Corrigida uma expressão regular com lookbehind que derrubava o teclado científico em Safari anterior a 16.4.
- `package.json` com os comandos do projeto, `.gitignore`, `.editorconfig`, `RELATORIO-TECNICO.md`, `QUALIDADE.md` e `TREINO.md` gerado a partir dos dados.
- `tests/verify.cjs` passou de 879 para **1.505 verificações**; o número mostrado no site é conferido pelo próprio teste.

## v8 — aba Treino
- 100 problemas misturados (20 por método) para treinar a decisão de qual método usar: diagnóstico, resolução e gabarito com passo a passo e “por que não os outros”.
- Pistas grifadas depois do diagnóstico, tabuleiro 10 × 10, estatísticas de diagnóstico, “Conferir no terminal” e impressão da lista com gabarito.
- Gabaritos gerados com sympy/mpmath e refeitos pelo motor do site (0 divergências). 879 verificações.

## v7 — Terminal
- Teclado científico com expoentes elevados sem digitar `^`, linha de status e escrita bonita no histórico.
- Busca de raízes reforçada: raízes muito próximas, raízes na borda do domínio, até 400 candidatas e raízes certificadas por troca de sinal.
- 100 equações testadas no navegador (v6: 93; v7: 100) e 1.400 no motor. 556 verificações.

## v6 — nova interface
- Abertura com demonstrações interativas, trilhas em caminho de três níveis, lições em tela cheia, modo escuro. Motor, conteúdo e progresso da v4 preservados. 510 verificações.

## v4 e anteriores
- Cinco métodos, trilhas de 12 etapas, Arena, missões de modelagem, caderno de revisão, estrelas, XP, backup e o Terminal com comparação de métodos e verificação.
