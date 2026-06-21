/**
 * JOGO DA FORCA - Node.js
 * Autor: Luiz Gabriel Abreu Oliveira
 *
 * Jogo da forca executado via terminal, utilizando apenas módulos nativos
 * do Node.js (readline e fs). Não utiliza bibliotecas externas.
 */

'use strict';

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// =======================================================
// CONFIGURAÇÕES GERAIS
// =======================================================

const MAX_TENTATIVAS = 6;
const RANKING_PATH = path.join(__dirname, 'ranking.json');

// =======================================================
// BANCO DE PALAVRAS
// =======================================================
// Cada palavra possui: palavra, categoria e dica.

const BANCO_DE_PALAVRAS = {
  Tecnologia: [
    { palavra: 'javascript', dica: 'Linguagem utilizada no desenvolvimento web' },
    { palavra: 'python', dica: 'Linguagem famosa por sua simplicidade e uso em IA' },
    { palavra: 'teclado', dica: 'Periférico usado para digitar' },
    { palavra: 'internet', dica: 'Rede mundial de computadores' },
    { palavra: 'processador', dica: 'Considerado o cérebro do computador' },
    { palavra: 'algoritmo', dica: 'Sequência lógica de passos para resolver um problema' },
    { palavra: 'servidor', dica: 'Máquina que fornece serviços a outros computadores' },
    { palavra: 'software', dica: 'Conjunto de programas e instruções de um computador' },
  ],
  Animais: [
    { palavra: 'elefante', dica: 'Maior mamífero terrestre, possui tromba' },
    { palavra: 'girafa', dica: 'Animal com pescoço muito longo' },
    { palavra: 'tartaruga', dica: 'Réptil conhecido por sua lentidão e casco' },
    { palavra: 'crocodilo', dica: 'Réptil predador que vive em rios e pântanos' },
    { palavra: 'macaco', dica: 'Primata conhecido por sua agilidade em árvores' },
    { palavra: 'leao', dica: 'Conhecido como o rei da selva' },
    { palavra: 'borboleta', dica: 'Inseto colorido que passa por metamorfose' },
    { palavra: 'pinguim', dica: 'Ave que não voa e vive em regiões geladas' },
  ],
  Frutas: [
    { palavra: 'abacaxi', dica: 'Fruta tropical com casca espinhosa' },
    { palavra: 'morango', dica: 'Fruta vermelha pequena e doce' },
    { palavra: 'melancia', dica: 'Fruta grande, verde por fora e vermelha por dentro' },
    { palavra: 'banana', dica: 'Fruta amarela e alongada, rica em potássio' },
    { palavra: 'laranja', dica: 'Fruta cítrica usada para fazer suco' },
    { palavra: 'manga', dica: 'Fruta tropical doce de caroço grande' },
    { palavra: 'uva', dica: 'Fruta pequena usada também para fazer vinho' },
    { palavra: 'abacate', dica: 'Fruta cremosa usada em vitaminas e saladas' },
  ],
};

// =======================================================
// INTERFACE DE LEITURA (readline)
// =======================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Faz uma pergunta ao jogador e retorna a resposta via Promise.
 * @param {string} pergunta
 * @returns {Promise<string>}
 */
function perguntar(pergunta) {
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => {
      resolve(resposta.trim());
    });
  });
}

// =======================================================
// FUNÇÕES UTILITÁRIAS
// =======================================================

/**
 * Remove acentos de uma string (para facilitar comparação de letras).
 * @param {string} texto
 * @returns {string}
 */
function removerAcentos(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Escolhe uma categoria aleatória do banco de palavras.
 * @returns {string}
 */
function escolherCategoriaAleatoria() {
  const categorias = Object.keys(BANCO_DE_PALAVRAS);
  const indice = Math.floor(Math.random() * categorias.length);
  return categorias[indice];
}

/**
 * Escolhe uma palavra aleatória dentro de uma categoria.
 * @param {string} categoria
 * @returns {{palavra: string, dica: string}}
 */
function escolherPalavraAleatoria(categoria) {
  const palavras = BANCO_DE_PALAVRAS[categoria];
  const indice = Math.floor(Math.random() * palavras.length);
  return palavras[indice];
}

/**
 * Monta a string da palavra parcialmente descoberta.
 * Exemplo: "JAVASCRIPT" com letras tentadas [J, A] -> "J A _ A _ _ _ _ _ _"
 * @param {string} palavra
 * @param {string[]} letrasTentadas
 * @returns {string}
 */
function montarPalavraParcial(palavra, letrasTentadas) {
  return palavra
    .split('')
    .map((letra) => {
      const letraSemAcento = removerAcentos(letra);
      return letrasTentadas.includes(letraSemAcento) ? letra.toUpperCase() : '_';
    })
    .join(' ');
}

/**
 * Verifica se a palavra foi completamente descoberta.
 * @param {string} palavra
 * @param {string[]} letrasTentadas
 * @returns {boolean}
 */
function palavraCompleta(palavra, letrasTentadas) {
  return palavra
    .split('')
    .every((letra) => letrasTentadas.includes(removerAcentos(letra)));
}

/**
 * Desenha o boneco da forca de acordo com o número de erros.
 * @param {number} erros
 * @returns {string}
 */
function desenharForca(erros) {
  const estagios = [
    `
  +---+
  |   |
      |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
    `
  +---+
  |   |
  O   |
 /|\\  |
 /  \\ |
      |
=========`,
  ];
  const indice = Math.min(erros, estagios.length - 1);
  return estagios[indice];
}

// =======================================================
// FUNÇÕES DE EXIBIÇÃO
// =======================================================

/**
 * Limpa o console (efeito visual entre rodadas).
 */
function limparTela() {
  console.clear();
}

/**
 * Exibe o estado atual do jogo no terminal.
 * @param {object} estado
 */
function exibirEstadoJogo(estado) {
  const { categoria, palavra, letrasTentadas, tentativasRestantes, erros } = estado;

  limparTela();
  console.log('===========================================');
  console.log('               JOGO DA FORCA               ');
  console.log('===========================================');
  console.log(desenharForca(erros));
  console.log('-------------------------------------------');
  console.log(`Categoria: ${categoria}`);
  console.log(`Palavra: ${montarPalavraParcial(palavra, letrasTentadas)}`);
  console.log(
    `Letras tentadas: ${letrasTentadas.length > 0 ? letrasTentadas.join(', ').toUpperCase() : '(nenhuma)'}`
  );
  console.log(`Tentativas restantes: ${tentativasRestantes}`);
  console.log('-------------------------------------------');
  console.log('Digite uma letra, "dica" para pedir ajuda, ou "sair" para encerrar.');
  console.log('===========================================');
}

// =======================================================
// FUNÇÕES DE RANKING
// =======================================================

/**
 * Lê o ranking salvo em disco. Retorna array vazio caso não exista.
 * @returns {Array<{nome: string, pontuacao: number}>}
 */
function lerRanking() {
  try {
    if (!fs.existsSync(RANKING_PATH)) {
      return [];
    }
    const conteudo = fs.readFileSync(RANKING_PATH, 'utf-8');
    const dados = JSON.parse(conteudo);
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.log('Aviso: não foi possível ler o ranking. Iniciando um novo.');
    return [];
  }
}

/**
 * Salva uma nova pontuação no ranking, mantendo-o ordenado.
 * @param {string} nome
 * @param {number} pontuacao
 */
function salvarNoRanking(nome, pontuacao) {
  const ranking = lerRanking();
  ranking.push({ nome, pontuacao });

  // Ordena do maior para o menor
  ranking.sort((a, b) => b.pontuacao - a.pontuacao);

  try {
    fs.writeFileSync(RANKING_PATH, JSON.stringify(ranking, null, 2), 'utf-8');
  } catch (erro) {
    console.log('Aviso: não foi possível salvar o ranking.');
  }
}

/**
 * Exibe o ranking ordenado no terminal.
 */
function exibirRanking() {
  const ranking = lerRanking();

  console.log('\n=============== RANKING ===============');
  if (ranking.length === 0) {
    console.log('Nenhuma pontuação registrada ainda.');
  } else {
    ranking.forEach((registro, indice) => {
      console.log(`${indice + 1}. ${registro.nome} - ${registro.pontuacao} pontos`);
    });
  }
  console.log('=========================================\n');
}

// =======================================================
// LÓGICA PRINCIPAL DO JOGO
// =======================================================

/**
 * Valida a entrada do jogador para letras.
 * @param {string} entrada
 * @returns {boolean}
 */
function entradaValida(entrada) {
  // Aceita apenas uma única letra (incluindo acentuadas)
  return /^[a-zA-ZÀ-ÿ]$/.test(entrada);
}

/**
 * Executa uma rodada completa do jogo da forca para um jogador.
 * @param {string} nomeJogador
 * @returns {Promise<number>} pontuação obtida na rodada
 */
async function jogarRodada(nomeJogador) {
  const categoria = escolherCategoriaAleatoria();
  const { palavra, dica } = escolherPalavraAleatoria(categoria);
  const palavraNormalizada = removerAcentos(palavra.toLowerCase());

  let letrasTentadas = [];
  let tentativasRestantes = MAX_TENTATIVAS;
  let erros = 0;
  let pontuacao = 0;
  let dicaUsada = false;

  while (tentativasRestantes > 0 && !palavraCompleta(palavraNormalizada, letrasTentadas)) {
    exibirEstadoJogo({
      categoria,
      palavra: palavraNormalizada,
      letrasTentadas,
      tentativasRestantes,
      erros,
    });

    const entrada = (await perguntar('Sua jogada: ')).toLowerCase();

    // Opção: sair do jogo
    if (entrada === 'sair') {
      console.log('\nVocê saiu do jogo. Até a próxima!');
      rl.close();
      process.exit(0);
    }

    // Opção: pedir dica
    if (entrada === 'dica') {
      if (dicaUsada) {
        console.log('\nVocê já utilizou a dica nesta palavra!');
      } else {
        console.log(`\nDica: ${dica}`);
        dicaUsada = true;
        tentativasRestantes -= 1; // penalidade: perde 1 tentativa
        erros += 1;
      }
      await perguntar('Pressione ENTER para continuar...');
      continue;
    }

    // Validação de entrada inválida
    if (!entradaValida(entrada)) {
      console.log('\nEntrada inválida! Digite apenas UMA letra.');
      await perguntar('Pressione ENTER para continuar...');
      continue;
    }

    const letra = removerAcentos(entrada);

    // Validação de letra repetida
    if (letrasTentadas.includes(letra)) {
      console.log('\nVocê já tentou essa letra! Escolha outra.');
      await perguntar('Pressione ENTER para continuar...');
      continue;
    }

    letrasTentadas.push(letra);

    // Verifica se a letra existe na palavra
    if (!palavraNormalizada.includes(letra)) {
      tentativasRestantes -= 1;
      erros += 1;
      console.log('\nLetra incorreta!');
    } else {
      console.log('\nBoa! Letra correta.');
    }

    await perguntar('Pressione ENTER para continuar...');
  }

  // Estado final da rodada
  const venceu = palavraCompleta(palavraNormalizada, letrasTentadas);

  exibirEstadoJogo({
    categoria,
    palavra: palavraNormalizada,
    letrasTentadas,
    tentativasRestantes,
    erros,
  });

  if (venceu) {
    // Pontuação: base fixa + bônus por tentativas restantes, com penalidade se usou dica
    pontuacao = 50 + tentativasRestantes * 10 - (dicaUsada ? 15 : 0);
    pontuacao = Math.max(pontuacao, 0);

    console.log(`\n🎉 Parabéns, ${nomeJogador}! Você venceu!`);
    console.log(`A palavra era: ${palavra.toUpperCase()}`);
    console.log(`Pontuação obtida nesta rodada: ${pontuacao}`);
  } else {
    pontuacao = 0;
    console.log(`\n💀 Que pena, ${nomeJogador}! Você perdeu.`);
    console.log(`A palavra era: ${palavra.toUpperCase()}`);
    console.log(`Pontuação obtida nesta rodada: ${pontuacao}`);
  }

  return pontuacao;
}

/**
 * Função principal: controla o fluxo geral do jogo
 * (nome do jogador, rodadas, ranking, jogar novamente).
 */
async function iniciarJogo() {
  limparTela();
  console.log('===========================================');
  console.log('         BEM-VINDO AO JOGO DA FORCA         ');
  console.log('===========================================\n');

  let nomeJogador = '';
  while (nomeJogador.length === 0) {
    nomeJogador = await perguntar('Digite seu nome: ');
    if (nomeJogador.length === 0) {
      console.log('Nome inválido. Tente novamente.');
    }
  }

  let pontuacaoTotal = 0;
  let continuarJogando = true;

  while (continuarJogando) {
    const pontuacaoRodada = await jogarRodada(nomeJogador);
    pontuacaoTotal += pontuacaoRodada;

    console.log(`\nPontuação total acumulada: ${pontuacaoTotal}`);

    let resposta = '';
    while (!['s', 'n'].includes(resposta)) {
      resposta = (await perguntar('\nDeseja jogar novamente? (s/n): ')).toLowerCase();
      if (!['s', 'n'].includes(resposta)) {
        console.log('Resposta inválida. Digite "s" para sim ou "n" para não.');
      }
    }

    continuarJogando = resposta === 's';
  }

  // Salva pontuação final no ranking
  salvarNoRanking(nomeJogador, pontuacaoTotal);

  console.log(`\nObrigado por jogar, ${nomeJogador}!`);
  console.log(`Pontuação final: ${pontuacaoTotal}`);

  exibirRanking();

  rl.close();
}

// =======================================================
// PONTO DE ENTRADA
// =======================================================

iniciarJogo().catch((erro) => {
  console.error('Ocorreu um erro inesperado:', erro);
  rl.close();
  process.exit(1);
});