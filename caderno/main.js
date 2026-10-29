/*
 * Ponto de entrada do front-end.
 * Este arquivo coordena o início da aplicação; as funções de cada
 * responsabilidade ficam nos outros arquivos para facilitar o estudo.
 */

function iniciarSistema() {
  // Primeiro recupera os registros salvos no navegador.
  carregarRegistro();

  // Preenche a data de hoje no formulário de criação.
  getel("dataRegistro").value = dataAtual();

  // Conecta os botões, campos e demais interações da página.
  iniciarEventos();

  // Desenha a interface com os dados carregados.
  atualizarTela();
}

// Executa a inicialização quando o navegador lê este script.
iniciarSistema();
