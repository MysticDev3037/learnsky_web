/*
 * Model — regras e operações sobre as páginas.
 * Aqui manipulamos os dados em memória; storage.js cuida de persistir
 * esses dados no localStorage do navegador.
 */

let registrosglobais = [];
let contador = 1;
let idEditando = null;
let materiaAtiva = null;

/**
 * Retorna uma lista sem matérias repetidas, em ordem alfabética.
 * Set remove duplicatas; map extrai o nome de cada matéria.
 */
function listarMaterias(registros) {
  return [...new Set(
    registros
      .map(registro => registro.materia.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/** Procura um registro pelo ID e retorna null se não existir. */
function buscarRegistro(id) {
  return registrosglobais.find(registro => registro.id === Number(id)) ?? null;
}

/**
 * Cria uma página, atribui um ID novo e pede para salvar os dados.
 * Recebe um objeto com materia, titulo, conteudo e data.
 */
function criarRegistro(dados) {
  const registro = {
    id: contador++,
    materia: dados.materia.trim(),
    titulo: dados.titulo.trim(),
    conteudo: dados.conteudo.trim(),
    data: dados.data || dataAtual()
  };

  registrosglobais.push(registro);
  salvarRegistros();

  return registro;
}

/** Atualiza os campos de uma página já existente. */
function alterarRegistro(id, dados) {
  const registro = buscarRegistro(id);

  if (!registro) {
    return false;
  }

  registro.materia = dados.materia.trim();
  registro.titulo = dados.titulo.trim();
  registro.conteudo = dados.conteudo.trim();
  registro.data = dados.data || registro.data;

  salvarRegistros();
  return true;
}

/** Remove uma página pelo ID. Retorna false se nada foi removido. */
function deletarRegistro(id) {
  const quantidadeAntes = registrosglobais.length;

  registrosglobais = registrosglobais.filter(
    registro => registro.id !== Number(id)
  );

  if (quantidadeAntes === registrosglobais.length) {
    return false;
  }

  salvarRegistros();
  return true;
}
