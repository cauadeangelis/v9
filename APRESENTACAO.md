# Roteiro de apresentação — 10 a 12 minutos

> Versão 9. Os blocos marcados com (v9) são novos; se o tempo for curto, priorize 1, 4d, 4c e 4e.

## 1. Proposta — 40 segundos

“A Numera Academy é um jogo para aprender métodos numéricos de Modelagem Computacional. A pessoa entende a ideia, observa o algoritmo, pratica e aplica a um problema. O terminal funciona como ferramenta de investigação e conferência.”

Explique que esta versão cobre **sete métodos** (Bisseção, Falsa Posição, Ponto Fixo, Newton-Raphson, Secante, Gauss e Gauss-Seidel), e não toda a disciplina de Cálculo 4.

## 1b. Abertura interativa — 30 segundos (v6)

Na página inicial, a demonstração roda sozinha. Toque no gráfico para assumir o controle, arraste o ponto azul e clique em **Dar o próximo passo** algumas vezes: o Newton-Raphson chega à raiz de x³ − x − 2. Depois arraste x₀ para perto de 0,6 e mostre o aviso de tangente quase horizontal. Troque para **Bisseção** e **Secante** para comparar os três métodos no mesmo gráfico.

Em Trilhas → Bisseção, mostre o caminho em três níveis e abra "Entenda o método": é uma lição em tela cheia, uma ideia por tela.

## 2. Aprendizado — 90 segundos

Abra Trilhas → Bisseção.

- Em **Entenda**, mostre continuidade e mudança de sinal: as condições importam tanto quanto a fórmula.
- Em **Experimente**, avance alguns passos e mostre o intervalo diminuindo.
- Em **Pratique**, faça a primeira questão e mostre o feedback, as estrelas e o XP.
- Erre uma questão para demonstrar a orientação e o registro no caderno de revisão.

## 3. Modelagem — 60 segundos

Abra Missões → O reservatório cúbico.

Explique as três etapas: reconhecer V=x³, resolver x³−4=0 e interpretar x≈1,587401 m. A raiz precisa fazer sentido físico; a matemática não termina no cálculo.

## 4. Terminal — 90 segundos

Digite `x^2-2=0`.

- Mostre as candidatas positiva e negativa detectadas.
- Abra **Comparar métodos**: o menor custo observado não é uma promessa universal de rapidez.
- Abra **Passo a passo** e **Verificação**.
- Em **Resolver comigo**, calcule uma atualização.

Depois digite:

```text
2x+y=5
x+3y=6
```

Mostre x=1,8 e y=1,4; substitua nas equações para conferir.

## 4b. Teclado científico — 45 segundos (v7)

No Terminal, clique em **C** e monte a equação só com as teclas: `x`, `xⁿ`, `2`, `0`, `−`, `3`, `x`, `xⁿ`, `1`, `0`, `+`, `2`, `=`, `0`. O campo mostra **x²⁰ − 3x¹⁰ + 2 = 0** sem nenhum `^`. Resolva: aparecem as 4 raízes (±1 e ±1,0718), duas delas a 0,07 uma da outra.

Depois digite `x^100 - 10000000000 = 0` no teclado do computador (o `^` sobe sozinho) e abra **Verificação**: a raiz 1,2589 é **certificada por troca de sinal**, porque o resíduo 1e−12 é impossível com termos da ordem de 10¹⁰. Bom gancho para falar de arredondamento em ponto flutuante e do Teorema do Valor Intermediário.

Os testes estão em `TESTES-TERMINAL.md`: 100 equações conferidas uma a uma no navegador (v6: 93; v7: 100) e mais 1.400 casos aleatórios.

## 4c. Treino — 75 segundos (v8, ampliado na v9)

Abra **Treino**. Mostre o tabuleiro de 140 casas e explique: "os métodos estão misturados de propósito, porque a primeira pergunta de um problema real é qual método usar".

- Mostre que, antes do diagnóstico, a pergunta **não diz o método** ("faça 2 iterações do método mais indicado").
- Abra o exercício 2 (velocidade do drone) e escolha **Bisseção** de propósito. O site mostra que a melhor escolha era a **Falsa Posição** e explica por quê; as pistas aparecem grifadas: "sinais opostos nas pontas", "curva quase reta", "raiz sempre cercada".
- Digite **20,5** (o ponto médio). Aparece **"Erro típico identificado"**: "esse é o ponto médio da Bisseção; na Falsa Posição o corte é onde a corda cruza o eixo". Depois responda 20,2915.
- Abra o **gabarito** e role até o **gráfico de convergência** deste problema.
- Feche com os números: 140 gabaritos calculados com sympy/mpmath e conferidos pelo motor do site, 369 erros típicos previstos, 0 divergências.

## 4d. Convergência — 45 segundos (v9)

No Terminal, clique no exemplo **Cosseno** (cos(x) − x = 0), resolva e abra a aba **Convergência**.

- "Cada linha horizontal do gráfico é um fator de 10 no erro."
- A Bisseção é uma reta: perde o erro pela metade a cada passo (fator ≈ 0,5, ordem 1). A Falsa Posição também é linear, mas com fator menor.
- A Secante e o Newton mergulham cada vez mais rápido: ordem observada ≈ 1,6 e ≈ 2. "Ordem 2 quer dizer que as casas corretas quase dobram a cada passo."
- Passe o mouse no gráfico para mostrar o erro de cada método em uma iteração; com Tab e as setas, dá para fazer o mesmo pelo teclado.
- Gancho com o Ponto Fixo: digite `x = cos(x)`, escolha **Ponto Fixo** nos controles e resolva. Aparece o **diagrama em teia**: os valores oscilam em volta de 0,739 porque g′ é negativa, e convergem porque |g′| ≈ 0,67 < 1.

## 4e. Modo prova — 45 segundos (v9)

Em **Treino → Modo prova**, escolha 5 questões e 20 minutos e comece. Mostre o cronômetro, a escolha do método (vale 0,4) e a resposta (vale 0,6), sem gabarito durante a prova. Entregue e mostre a **nota** e o **relatório** com o erro típico de cada questão errada. Clique em **Imprimir ou salvar em PDF**: sai só o relatório, pronto para entregar.

Mostre também a **Revisão**: os diagnósticos errados da prova entram no caderno e voltam em 1, 3, 7 e 14 dias.

## 4f. Projeto profissional — 30 segundos (v9)

- O site funciona **offline** e pode ser **instalado como app** (botão no rodapé).
- No GitHub, cada mudança roda **1.505 verificações**, os 140 gabaritos, as 100 equações do Terminal, a acessibilidade (WCAG 2.1 AA, 0 violações em 25 telas) e o motor do Safari; o site só é publicado se tudo passar.
- O **relatório técnico** descreve objetivos, metodologia e validação.

## 5. Limites e progresso — 60 segundos

Use `1/x=0`: a busca não deve anunciar zero como raiz. Explique que não encontrar uma raiz em uma busca limitada não prova que ela não exista.

Mostre o caderno, as conquistas e o backup. O progresso fica no navegador; não existe ranking remoto fictício.

## Perguntas prováveis

**Por que não basta a resposta final?**
Porque aprender envolve reconhecer condições, escolher procedimentos, calcular e interpretar. Cada etapa é praticada separadamente e depois conectada.

**Qual método é mais rápido?**
Depende da função, condições iniciais, precisão e custo das operações. O terminal compara execuções aceitas com uma métrica declarada.

**Um resíduo de 1e−12 significa erro de 1e−12 em x?**
Não. Resíduo e erro são diferentes; a sensibilidade da função ou matriz afeta essa relação.

**Por que Gauss-Seidel usa os valores novos?**
É a característica da atualização sequencial do método. Usar somente a rodada anterior seria outro procedimento.

**O jogo já foi comprovado com alunos?**
Não. Há testes de software e validação matemática; eficácia educativa e usabilidade precisam ser avaliadas em uso.

**Como adicionar outro método?**
Foi exatamente o que a v9 fez com a Falsa Posição e o Ponto Fixo: implementar o algoritmo no motor, definir entradas e critérios de parada, escrever a trilha, a missão e os desafios, integrar o Terminal e as simulações, gerar e conferir os exercícios do Treino e acrescentar testes de propriedades e de falhas. Não basta acrescentar um nome no menu.

**Por que a Falsa Posição, se ela também fica no intervalo como a Bisseção?**
Porque corta onde a corda cruza o eixo, aproveitando os valores de f. Numa curva quase reta isso economiza muitas avaliações (no ponto de equilíbrio da fábrica, exercício 98 do Treino, são 3 cortes contra 22 da Bisseção). Em curvas muito tortas, uma ponta fica parada e ela pode ficar lenta: o próprio Treino tem exercícios em que a Bisseção é a melhor escolha por isso.

**Quando o Ponto Fixo converge?**
Quando |g′(x)| < 1 perto da raiz. O fator de convergência é aproximadamente |g′(x*)|; com g′ negativa os valores oscilam em volta da raiz. Newton é um Ponto Fixo especial, com g′(x*) = 0.

**Como a nota da prova é calculada?**
0,4 por escolher o método mais indicado e 0,6 pela resposta dentro da tolerância do exercício, em cada questão; a soma é convertida para 0 a 10.
