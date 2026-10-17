# Análise educativa e melhorias — Numera Academy v4

## Avaliação do projeto recebido

A proposta tinha uma base funcional: cinco métodos reais, questões com correção, persistência, recompensas e um laboratório. O problema principal era a distância entre “responder um cálculo” e “entender e aplicar a modelagem”. Muitas atividades focavam uma atualização isolada, enquanto o terminal era mais completo que a experiência de aprendizagem.

A análise usou o código e o conteúdo do ZIP fornecido. Não houve observação de alunos, aplicação em turma nem acesso à ementa completa. Assim, as melhorias pedagógicas são decisões de projeto; não são evidência de aumento medido de aprendizagem.

## Problemas observados e decisões

| Achado | Consequência | Melhoria implementada |
| --- | --- | --- |
| Conteúdo curto por método, concentrado em substituições | Possibilidade de memorizar a fórmula sem entender quando usá-la | Explicação com requisitos, sequência, armadilhas, critério de parada e pseudocódigo; 4 atividades adicionais em cada trilha |
| Pouca conexão entre problema e equação | O jogo podia ensinar cálculo sem ensinar modelagem | 5 missões com hipóteses, variáveis, formulação, cálculo e interpretação |
| Gráficos e tabelas principalmente como saída do terminal | O aluno podia olhar a resposta sem acompanhar a mudança | Simulações com controle de cada passo e gráficos com intervalo, tangente ou secante |
| Progresso centrado em XP/conclusão | Concluir não indica autonomia | Estrelas por melhor tentativa e distinção explícita entre conclusão e desempenho |
| Erros sem roteiro posterior | O aluno podia abandonar uma dificuldade | Caderno de revisão e programação simples de retomadas |
| Busca automática centrada em uma candidata e mudança de sinal | Outras raízes e raízes repetidas podiam passar despercebidas | Várias candidatas, mínimos locais de |f|, faixa configurável e limite declarado |
| Newton e Secante podiam aceitar pequena variação com resíduo acima da tolerância | Critério inconsistente em execuções manuais | Estagnação não é anunciada como convergência quando o resíduo falha |
| Secante ignorava uma raiz já presente no primeiro ponto inicial | Atualizações desnecessárias ou falha indevida | Verificação das duas condições iniciais |
| Gauss usava um limiar absoluto fixo para pivôs | Sistemas equivalentes em escala pequena podiam ser rejeitados | Limiar relativo e validação em escalas de 1e−20 a 1e15 |
| Um sistema singular podia convergir em Seidel para apenas uma de suas soluções | Resposta isolada poderia sugerir unicidade inexistente | Teste de posto numérico antes das soluções de sistemas; identificação de incompatibilidade/dependência |
| Terminal exigia matriz para sistemas | Barreira entre a equação da aula e a entrada no app | Parser estrutural de equações lineares com nomes de incógnitas |
| Não havia transporte do progresso | Mudança de navegador podia interromper a jornada | Backup JSON, validação e restauração com confirmação |

## Estrutura pedagógica

1. **Entenda:** modelo mental, fórmula, pré-condições e riscos.
2. **Experimente:** observe uma execução calculada e mova-se pelos passos.
3. **Pratique:** avance do conceito ao cálculo e à crítica do resultado.
4. **Aplique:** transforme um cenário em equações e interprete a solução.
5. **Revise:** recupere o raciocínio em outra tentativa.

O terminal permanece livre. Não se bloqueia uma ferramenta de consulta para forçar o aluno a jogar. As atividades dão orientação antes do gabarito; a explicação completa aparece no acerto. O modo guiado do terminal permite reconstruir seus próprios exemplos.

## Critérios de recompensa

- Trilhas: 20 XP por atividade inédita; Arena: 30 XP; missões aplicadas: 40 XP.
- Meta diária: +30 XP ao concluir 3 atividades distintas no dia, uma vez ao dia.
- Repetir uma atividade melhora a melhor classificação por estrelas e pode contar como estudo em outro dia, mas não repete seu XP base.
- Sem limite de tentativas nas trilhas. Na Arena, vidas se recuperam sem apagar o progresso.
- Revisão por agenda simples: 1, 3, 7 e 14 dias. Não é um modelo de aprendizagem adaptativa validado.

## Arquitetura e extensibilidade

Separação em conteúdo, matemática, progresso e interface. O site funciona localmente sem instalação. Uma nova trilha exige método implementado, condições/limites documentados, questões verificadas, registro na interface e testes próprios. Acrescentar só um card não representa um novo método funcionando.

Não foi acrescentada infraestrutura de contas, ranking entre alunos, professor/turma ou banco remoto. Esses recursos exigiriam decisões adicionais sobre dados, autenticação e validação. A versão atual é um projeto de aprendizagem individual, com estado local.

## O que ainda deve ser validado com alunos/professor

- Se os cinco métodos correspondem ao recorte solicitado da disciplina.
- Se as perguntas exigem explicação suficiente, além da resposta numérica.
- Tempo de conclusão, pontos de abandono e dificuldade real de cada etapa.
- Capacidade de resolver uma questão nova depois da prática, sem dicas.
- Layout, navegação por teclado, leitura em celular e exportações no navegador usado na apresentação.

Não foi atribuída nota “100%” ou eficácia pedagógica garantida. A versão amplia e organiza a experiência; avaliação em uso continua necessária.

## v9: o que saiu do debate depois da v8

| Proposta | Por que importa | O que foi feito |
| --- | --- | --- |
| Gráfico de convergência | Ordem de convergência é abstrata no papel; no gráfico log ela vira inclinação | Aba Convergência no Terminal e gráfico em cada gabarito do Treino, com ordem observada e tabela |
| Modo prova | Treino sem pressão não mede autonomia; o professor precisa de um registro | Prova sorteada, cronômetro, nota 0,4/0,6, relatório em PDF, histórico; erros vão para a revisão |
| Dicas por erro típico | “Ainda não” não ensina; o erro mais comum de cada conta é previsível | 369 erros típicos calculados pelo gerador e reconhecidos na correção |
| Falsa Posição e Ponto Fixo | São os métodos de raízes que costumam completar o conteúdo do curso | Motor, Terminal, trilhas, simulações, missões, Arena e 40 exercícios |
| Profissionalização | Projeto apresentável e mantido como software de verdade | PWA, testes no GitHub, publicação no Pages, acessibilidade WCAG 2.1 AA, compatibilidade e relatório técnico |

Uma consequência importante: com sete métodos, vários exercícios da v8 ficaram ambíguos (por exemplo, palpites da Secante que já cercavam a raiz, o que tornava a Falsa Posição igualmente válida). Eles foram revisados para que cada gabarito continue tendo uma justificativa clara. A eficácia educativa continua sem medição em turma: os testes garantem a correção do software e da matemática, não o aprendizado.
