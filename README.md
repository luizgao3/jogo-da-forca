#  Jogo da Forca — Node.js

**Autor:** Luiz Gabriel Abreu Oliveira

##  Descrição do projeto

Um jogo da forca clássico, executado inteiramente pelo terminal, desenvolvido em **JavaScript puro** com **Node.js**. O projeto não utiliza nenhuma biblioteca externa ou framework — apenas os módulos nativos `readline` e `fs`.

O jogador deve adivinhar uma palavra secreta, sorteada aleatoriamente entre diversas categorias, tentando letra por letra antes que suas tentativas acabem. O jogo também conta com sistema de dicas e um ranking persistente de pontuações.

---

##  Regras do jogo

- No início, o jogador informa seu **nome**.
- Uma **categoria** e uma **palavra** são sorteadas aleatoriamente.
- O jogador tenta adivinhar a palavra **uma letra por vez**.
- O jogo tem um número máximo de **6 tentativas erradas** (representadas pelo desenho da forca).
- Letras repetidas e entradas inválidas são identificadas e não consomem tentativas.
- O jogador pode digitar `dica` para receber uma ajuda sobre a palavra — isso tem uma penalidade de **1 tentativa**.
- O jogador pode digitar `sair` a qualquer momento para encerrar o jogo.
- Ao final de cada rodada, é exibido se o jogador **venceu ou perdeu**, a **palavra correta** e a **pontuação obtida**.
- O jogador pode optar por **jogar novamente** quantas vezes quiser.
- Ao final, a pontuação total é salva no **ranking** (`ranking.json`), exibido em ordem decrescente.

---

##  Como jogar

1. Digite seu nome quando solicitado.
2. Observe a categoria, a palavra parcialmente revelada, as letras já tentadas e as tentativas restantes.
3. Digite uma única letra e pressione ENTER.
4. Se quiser uma dica, digite `dica` (isso custa 1 tentativa).
5. Continue até acertar toda a palavra ou esgotar as tentativas.
6. Ao final da rodada, escolha se deseja jogar novamente (`s` ou `n`).
7. Ao encerrar, veja sua pontuação final e o ranking geral.

### Exemplo de exibição durante o jogo

```
Categoria: Tecnologia

Palavra: J _ V _ S C R _ P T

Letras tentadas: A, E, I

Tentativas restantes: 4
```

---

##  Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 14 ou superior recomendada).

### Passos

```bash
# 1. Clone ou baixe este repositório
git clone <url-do-repositorio>

# 2. Entre na pasta do projeto
cd jogo-da-forca

# 3. Instale as dependências (não há dependências externas, mas o comando é padrão)
npm install

# 4. Inicie o jogo
npm start
```

---

## 🛠️ Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript no servidor/terminal
- **JavaScript (ES6+)** — lógica do jogo
- **readline** (módulo nativo) — leitura de entrada do usuário no terminal
- **fs** (módulo nativo) — leitura e escrita do arquivo de ranking

Nenhuma biblioteca externa, framework ou TypeScript foi utilizado — apenas recursos nativos do Node.js.

---

##  Estrutura do projeto

```
jogo-da-forca/
│
├── index.js          # Código principal do jogo
├── package.json       # Configuração do projeto e script de start
├── README.md           # Documentação do projeto
├── LICENSE              # Licença MIT
├── .gitignore            # Arquivos ignorados pelo Git
└── ranking.json           # Armazena as pontuações dos jogadores
```

---

##  Sistema de pontuação

- Vitória: pontuação base de **50 pontos**, mais **10 pontos** por cada tentativa restante.
- Uso de dica: penalidade de **15 pontos** na pontuação da rodada.
- Derrota: **0 pontos** na rodada.
- A pontuação de todas as rodadas jogadas em uma sessão é somada e registrada no ranking ao final.

---

##  Créditos / Fontes

Projeto desenvolvido como exercício de prática em **JavaScript** e **Node.js**, utilizando apenas recursos nativos da linguagem, sem bibliotecas externas.

---

##  Licença

Este projeto está licenciado sob os termos da licença **MIT** — veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
