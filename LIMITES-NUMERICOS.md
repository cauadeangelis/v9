# Critérios e limites do motor numérico

## A promessa correta

O aplicativo fornece **aproximações numéricas verificadas por critérios específicos**, dentro de um conjunto de sintaxes e métodos. Ele não resolve qualquer problema de Cálculo 4 e não prova a existência, a unicidade ou a completude das raízes de uma função geral.

## Raízes

- Métodos disponíveis: Bisseção, Falsa Posição, Ponto Fixo, Newton-Raphson e Secante.
- Tolerância manual permitida: de 1e−12 inclusive a 1 exclusivo; limite de 1 a 500 iterações.
- Critério de aceitação: resíduo absoluto |f(x)| menor ou igual à tolerância. Estagnação com resíduo maior não é sucesso.
- Newton usa diferenças centrais para aproximar a derivada. As duas avaliações extras por derivada são incluídas na comparação de custo.
- Bisseção registra a meia largura do intervalo. Essa cota de erro depende da continuidade e da manutenção de uma raiz no intervalo. O programa não prova continuidade para expressões arbitrárias.
- A Secante verifica também o primeiro ponto inicial e rejeita denominador sem separação numericamente utilizável.
- **Falsa Posição (v9):** exige a < b e sinais opostos em f(a) e f(b), como a Bisseção. O critério de parada é |f(x)| ≤ tolerância; a tabela mostra a variação entre aproximações, porque a largura do intervalo pode não ir a zero (uma ponta fica parada em curvas convexas ou côncavas). Quando uma ponta fica parada por 3 ou mais iterações seguidas, a observação da execução avisa. É a versão clássica, sem a modificação de Illinois.
- **Ponto Fixo (v9):** itera xₖ₊₁ = g(xₖ) e para quando |xₖ − g(xₖ)| ≤ tolerância (o resíduo de x − g(x) = 0). No Terminal, g(x) vem do campo próprio ou, se ele ficar vazio, do lado direito de uma equação escrita como x = …; a aba Verificação substitui o resultado também na equação original. Divergência (valores acima de 10¹⁵) e saída do domínio de g param a execução com mensagem. A observação estima |g′| no ponto final por diferenças centrais: abaixo de 1 indica contração e convergência linear; acima de 1, que aquela reescrita é ruim. A escolha de g é do usuário: o motor não gera g automaticamente.
- Funções reais podem estar indefinidas em partes do domínio. Pontos não finitos são descartados da amostragem; uma execução manual pode parar com erro de domínio.

### Automático

São amostrados 801 pontos em [mínimo,máximo], inicialmente [−40,40]. Candidatas vêm de valores nulos amostrados, mudanças de sinal ou mínimos locais de |f|. Desde a v7, perto de cada mínimo local de |f| (inclusive amostras nulas ou empatadas) o intervalo é dividido em 64 partes para revelar raízes coladas, e as bordas do domínio (pontos onde f deixa de ser finita) são aproximadas em 4 níveis. Até 400 candidatas são testadas — primeiro as trocas de sinal, depois os mínimos locais, cada grupo pela proximidade de zero — com teto de 400.000 avaliações de f. Resultados com diferença relativa menor que 1e−5 são agrupados.

Para cada candidata, Bisseção, Falsa Posição, Newton e Secante usam suas condições iniciais correspondentes (o Ponto Fixo não entra na comparação automática, porque depende de uma g escolhida pelo usuário). A comparação exige resíduo até 1e−12, permanência na região candidata e uma checagem local adicional da redução do resíduo. Quando nenhum método atinge 1e−12 porque o arredondamento dos termos de f é maior que isso (ex.: x^100 = 1e10), uma candidata com troca de sinal é levada pela Bisseção até intervalos do tamanho da precisão da máquina; se f troca de sinal ali e |f| encolheu pelo menos 1000 vezes em relação às pontas iniciais (o que exclui polos e saltos), a raiz é aceita como **certificada por troca de sinal** e a aba Verificação explica o critério. Entre as execuções aceitas, escolhe-se menor quantidade de avaliações de f; em empates, vence quem fez menos atualizações (sem contar os pontos iniciais) e, depois, o menor resíduo. A busca e as demais tentativas têm custo adicional, exposto na saída.

Mínimos locais de |f| ajudam a encontrar raízes de multiplicidade par, mas não garantem detectá-las. Funções com oscilações mais rápidas que a amostragem, raízes mais próximas que o refino local (cerca de 0,003 na faixa padrão), escalas extremas e raízes fora da faixa ainda podem ser perdidas. Uma equação sem raiz real, mas tão próxima de ter uma que a diferença fica abaixo do arredondamento, pode ser apresentada com raiz. Resíduo pequeno em raiz múltipla pode coexistir com erro em x significativamente maior.

Amostragem não determina se todas as raízes foram encontradas. “Nenhuma raiz detectada” também não prova ausência. Um valor numérico exatamente zero pode resultar de arredondamento/underflow. O motor rejeita expressões nulas em todas as amostras finitas como identidade ou perda de precisão, sem atribuir uma raiz isolada.

### Gráfico de convergência (v9)

- Todos os métodos partem dos mesmos dados: os do usuário no modo manual; no automático, um intervalo “redondo” em volta da raiz encontrada, com uma única troca de sinal, e x₀ e x₁ dentro dele (a busca automática costuma deixar intervalos pequenos demais para comparar).
- O erro é |xₖ − x*|, com x* = a aproximação mais precisa disponível perto da raiz, polida por Newton. Valores abaixo de 10⁻¹⁵·(1 + |x*|) são o limite do ponto flutuante e aparecem na linha “limite da precisão do computador”.
- A ordem observada é a inclinação da reta de mínimos quadrados de ln eₖ₊₁ contra ln eₖ, usando só os erros entre 10⁻¹³ e 0,5 (em escala relativa). Com poucos pontos (Newton costuma ter 2 ou 3), é uma estimativa: a Secante pode aparecer com 1,4 a 1,7 em vez de 1,618.
- Um método que termina longe de x* (outra raiz ou sem convergência) sai do gráfico e aparece listado com o motivo.
- Em sistemas, o gráfico compara Gauss-Seidel e Jacobi (só como referência didática) a partir do mesmo vetor inicial; a Eliminação de Gauss é direta e aparece só no texto, com a contagem de operações.

## Sistemas lineares

- De 2 a 6 equações e igual número de incógnitas; coeficientes reais finitos.
- Parser de expressões lineares por árvore sintática. Produtos entre incógnitas, divisões por incógnitas e funções não lineares são rejeitados.
- Gauss com pivotamento parcial e retrossubstituição; Gauss-Seidel com atualização sequencial.
- Teste de posto numérico para impedir apresentação de uma solução como única em sistema dependente. É uma decisão em ponto flutuante e pode sinalizar mau condicionamento como ausência de unicidade identificável.
- Critério normalizado: η = ||Ax−b||∞ / (||A||∞ ||x||∞ + ||b||∞). Gauss-Seidel exige também variação ≤ tolerância·(1+||x||∞).
- O normalizador reduz a dependência da escala. Um pequeno resíduo normalizado não garante pequeno erro no vetor solução quando a matriz é mal condicionada.
- Comparação simplificada: Gauss ≈ 2n³/3+2n²; Seidel ≈ 2kn². Não inclui todo o custo de validação, pivotamento, memória ou interface. Não mede tempo.
- Não se fornece solução paramétrica de sistemas dependentes. O terminal informa a limitação e solicita conferência das equações.

## Referências para conferência

Conteúdo explicativo autoral; fórmulas e condições podem ser conferidas nos textos dos próprios autores:

- Tobin A. Driscoll e Richard J. Braun, *Fundamentals of Numerical Computation*, Newton: https://fncbook.com/newton/
- Driscoll e Braun, métodos de interpolação e Bisseção: https://fncbook.com/secant/
- Richard Barrett et al., *Templates for the Solution of Linear Systems*, Gauss-Seidel, Netlib: https://www.netlib.org/linalg/html_templates/node14.html

As referências sustentam os conceitos matemáticos, não uma alegação de eficácia educativa do aplicativo.
