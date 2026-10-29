/*
 * Storage — armazenamento no navegador.
 *
 * IMPORTANTE: esta versão usa localStorage, que pertence ao navegador.
 * Ela ainda não envia nem recebe dados do SQLite ou de uma API.
 */

const CHAVE_REGISTROS = "registros";

/**
 * Lê os registros salvos.
 * Na primeira execução, cria dois exemplos para a interface não ficar vazia.
 */
function carregarRegistro() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_REGISTROS);

    if (dadosSalvos !== null) {
      // JSON transforma o texto salvo de volta em uma lista JavaScript.
      const dadosConvertidos = JSON.parse(dadosSalvos);
      registrosglobais = Array.isArray(dadosConvertidos) ? dadosConvertidos : [];
    } else {
      registrosglobais = [
        {
          id: 1,
          materia: "Estrutura de Dados",
          titulo: "Listas Encadeadas",
          conteudo: "Revisar listas simplesmente encadeadas.\n\nAnote aqui as ideias importantes e exemplos que ajudarem a fixar o conteúdo.",
          data: "2026-07-07"
        },
        {
          id: 2,
          materia: "UX Design",
          titulo: "Wireframe",
          conteudo: "Criar um wireframe de baixa fidelidade.\n\nObjetivo: organizar a hierarquia visual antes de pensar nos detalhes.",
          data: "2026-07-06"
        }
      ];

      salvarRegistros();
    }
  } catch (erro) {
    // Erros podem acontecer se os dados salvos estiverem corrompidos.
    console.error("Erro ao carregar registros:", erro);
    registrosglobais = [];
  }

  // O próximo ID precisa ser maior que todos os IDs já existentes.
  contador = registrosglobais.reduce(
    (maiorId, registro) => Math.max(maiorId, Number(registro.id) || 0),
    0
  ) + 1;
}

/** Converte a lista de registros em JSON e salva no navegador. */
function salvarRegistros() {
  try {
    localStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registrosglobais));
  } catch (erro) {
    console.error("Erro ao salvar registros:", erro);
    alert("Não foi possível salvar no navegador.");
  }
}
