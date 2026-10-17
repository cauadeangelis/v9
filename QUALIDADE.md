# Qualidade: testes, acessibilidade, navegadores e funcionamento offline

Este documento resume como a v9 foi conferida e como repetir cada conferência. Todos os números abaixo vêm da última execução das suítes.

## Testes automáticos

| Suíte | Como rodar | O que confere | Resultado |
|---|---|---|---|
| Verificações gerais | `node tests/verify.cjs` | parser sem `eval`, propriedades dos 7 métodos, entradas inválidas, busca automática, sistemas em escalas de 1e−20 a 1e15, convergência e ordem observada, conteúdo das 84 etapas, Arena e missões, progresso e backup, interface com DOM simulado (todas as páginas, Terminal, modo guiado), Treino (os 140 exercícios resolvidos pela interface), prova, revisão, migração da v8, PWA e o número exibido no site | **1.505 / 1.505** |
| Gabarito do Treino | `node tests/treino/conferir-com-motor.cjs` | refaz as 140 respostas (geradas com sympy/mpmath, 50 dígitos) com o motor do site; confere que nenhum dos 369 erros típicos é aceito como certo e que os 140 gráficos de convergência mostram o método certo chegando à raiz | **0 divergências** |
| Gerador reproduzível | `python3 tests/treino/gerar-treino.py /tmp/t.js && cmp /tmp/t.js dist/treino-data.js` | o arquivo publicado é exatamente o que o gerador produz | idêntico |
| Terminal no navegador | `tests/terminal/` (ver TESTES-TERMINAL.md) | 100 equações digitadas tecla por tecla; 19 cenários do teclado científico; 1.000 polinômios e 400 equações transcendentes direto no motor | **100 / 100**; 19 / 19; 1.000 / 1.000 e 398 / 400 (2 erros da referência, explicados) |
| Fluxos completos | `node tests/e2e/testar-fluxos.mjs URL` | trilhas dos métodos novos, missões, Terminal (Ponto Fixo, Falsa Posição, convergência com mouse e teclado), Treino (erro típico, gabarito), uso só com teclado, revisão, prova completa com nota 10, impressão do relatório, celular (8 páginas sem rolagem lateral), modo escuro | **41 / 41** |
| Offline (PWA) | `node tests/e2e/testar-offline.mjs URL` | service worker ativo, 20 arquivos em cache, manifesto, páginas e Terminal funcionando sem internet | **10 / 10** |
| Acessibilidade | `node tests/e2e/auditar-a11y.mjs URL` | axe-core 4.10, regras WCAG 2.0/2.1 A e AA, em 25 telas, nos modos claro e escuro | **0 violações** (52 / 52) |
| Motor do Safari | `xvfb-run -a python3 tests/e2e/testar-webkit.py URL` | WebKitGTK 2.52 + Selenium: todos os scripts carregam, 8 páginas, teclado científico, convergência, Ponto Fixo, Treino e prova | **21 / 21** |
| Compatibilidade | `node tests/e2e/checar-compat.mjs` | todo `.js` é ES2021 válido (acorn) e não usa recursos ausentes em Safari 15, Firefox 90 ou Chrome 90; CSS recente só como melhoria progressiva | **99 / 99** |

No GitHub, `.github/workflows/testes.yml` roda todas essas suítes a cada push e pull request (em três trabalhos: motor e conteúdo, navegador Chromium e WebKit). `pages.yml` só publica o site se os testes passarem.

## Acessibilidade

Telas auditadas (cada uma no tema claro e no escuro): início, trilhas, página de uma trilha, lição (leitura, simulação e prática), missões, missão, Arena, Terminal vazio e com resultado (solução, passos, comparação, convergência, verificação e “resolver comigo”), Treino (exercício, gabarito, revisão, prova: início, questão e relatório, gabarito completo), Revisão e Progresso.

Correções feitas na v9 a partir da auditoria:
- **Contraste:** o tom de texto secundário (`--subtle`) passou de #8B9396 (2,8:1 sobre o fundo) para #687175 (4,5:1) no tema claro e de #7D888B para #8E999C no escuro. O botão “Resolver” do Terminal ganhou um estado de foco/hover com contraste suficiente. As etapas bloqueadas do Treino deixaram de usar transparência no texto.
- **ARIA:** `aria-label` em `div` e `span` sem papel recebeu o papel adequado (`img` nas barras de progresso, estrelas e vidas; `group` no gráfico interativo e na barra da prova), e as fórmulas deixaram de esconder o próprio conteúdo atrás de um rótulo genérico.
- **Teclado:** o gráfico de convergência recebe foco e é percorrido com as setas (Home e End vão ao começo e ao fim); o diagnóstico e a resposta do Treino funcionam só com Tab e Enter. O foco visível já existia (contorno azul de 3 px) e o modo “movimento reduzido” desliga animações.
- **Cor nunca sozinha:** no gráfico, cada método tem cor, nome na legenda e tabela de números; no Treino, o estado de cada casa do tabuleiro também é anunciado em texto.

A auditoria automática cobre o que pode ser medido por regras. Testes com pessoas usando leitores de tela não foram feitos.

## Navegadores

| Navegador | Versão mínima | Como foi conferido |
|---|---|---|
| Chrome / Edge | 90 | Chromium 141 (Playwright): todas as suítes |
| Safari (macOS e iOS) | 15 | WebKitGTK 2.52 (mesmo motor) com Selenium; análise estática |
| Firefox | 90 | análise estática (o Firefox não pôde ser baixado no ambiente de testes); recomenda-se abrir uma vez antes da apresentação |

Recursos de CSS recentes aparecem só como melhoria: `:has()` (destaque do campo no modo expoente), `text-wrap: balance` (títulos) e `aspect-ratio` (casas do tabuleiro). Sem eles, a página continua completa.

## Funcionamento offline (PWA)

- `dist/manifest.webmanifest`: nome, ícones (192, 512 e adaptável), cores e atalhos para Treino e Terminal.
- `dist/sw.js`: guarda os 20 arquivos do site na primeira visita. A versão do cache é um resumo do conteúdo dos arquivos (`tests/pwa/atualizar-sw.cjs`), então qualquer mudança gera um cache novo e o antigo é apagado. Páginas tentam a rede primeiro; arquivos vêm do cache. As fontes do Google ficam num cache próprio.
- O botão **Instalar como app** aparece no rodapé quando o navegador permite.
- Abrindo `index.html` direto do disco (`file://`), o site funciona igual, mas o navegador não permite service worker; o modo offline instalável vale para o endereço publicado.

## Antes de publicar uma mudança

```bash
npm run gerar-treino      # se mudou o gerador do Treino
node tests/treino/gerar-treino-md.cjs   # atualiza TREINO.md
npm run atualizar         # acerta o número de verificações do site e a versão do cache offline
npm run testar
```
