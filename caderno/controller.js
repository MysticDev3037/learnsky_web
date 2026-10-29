/*
 * Controller — conecta as ações do usuário às funções do sistema.
 * Exemplo: clicar em Salvar -> ler campos -> validar -> criar registro
 * -> atualizar a tela.
 */

function iniciarEventos() {
  // Criação e limpeza do formulário principal.
  getel("btnSalvar").addEventListener("click", salvarNovaPagina);
  getel("btnLimpar").addEventListener("click", limparCampos);

  // Todos estes botões levam o usuário ao formulário de nova página.
  for (const id of ["btnNovoTopo", "btnNovaPagina", "btnCriarVazio", "atalhoNova"]) {
    getel(id).addEventListener("click", focarNovaPagina);
  }

  // Mostra todas as páginas e limpa o campo de pesquisa.
  getel("atalhoHoje").addEventListener("click", () => {
    materiaAtiva = null;
    getel("buscar").value = "";
    atualizarTela();
    getel("workspace-scroll").scrollTo({ top: 0, behavior: "smooth" });
  });

  getel("btnInicio").addEventListener("click", () => {
    materiaAtiva = null;
    atualizarTela();
  });

  // A pesquisa atualiza os resultados enquanto o usuário digita.
  getel("buscar").addEventListener("input", atualizarTela);

  // Um clique na matéria filtra por ela; clicar novamente remove o filtro.
  getel("listaMateriasSidebar").addEventListener("click", evento => {
    const botao = evento.target.closest("[data-materia]");

    if (!botao) {
      return;
    }

    materiaAtiva = materiaAtiva === botao.dataset.materia
      ? null
      : botao.dataset.materia;

    atualizarTela();
  });

  // Os botões Editar/Excluir são criados dinamicamente nos cartões.
  getel("listaRegistro").addEventListener("click", evento => {
    const botao = evento.target.closest("[data-acao]");

    if (!botao) {
      return;
    }

    const id = Number(botao.dataset.id);

    if (botao.dataset.acao === "editar") {
      abrirEditor(id);
    }

    if (botao.dataset.acao === "excluir") {
      confirmarExclusao(id);
    }
  });

  // Salvar o formulário de edição atualiza a página selecionada.
  getel("formEditar").addEventListener("submit", evento => {
    evento.preventDefault();

    const dados = lerDadosEditor();

    if (!validarDados(dados)) {
      return;
    }

    alterarRegistro(idEditando, dados);
    fecharEditor();
    atualizarTela();
  });

  getel("btnFecharEditor").addEventListener("click", fecharEditor);
  getel("btnCancelarEditor").addEventListener("click", fecharEditor);

  getel("btnExcluir").addEventListener("click", () => {
    if (idEditando !== null) {
      confirmarExclusao(idEditando, true);
    }
  });

  // Fecha a janela se o clique ocorrer no fundo, fora do formulário.
  getel("dialogEditor").addEventListener("click", evento => {
    if (evento.target === getel("dialogEditor")) {
      fecharEditor();
    }
  });

  // Estes botões são apenas informativos nesta versão do protótipo.
  getel("btnPerfil").addEventListener("click", () => {
    alert("Seu espaço pessoal do LearnSky. O perfil será configurado futuramente.");
  });

  getel("btnPerfilDetalhes").addEventListener("click", () => {
    alert("Mais opções estarão disponíveis futuramente.");
  });
}

/** Lê os campos principais, valida e cria uma página. */
function salvarNovaPagina() {
  const dados = {
    materia: getel("materia").value,
    titulo: getel("titulo").value,
    conteudo: getel("conteudo").value,
    data: getel("dataRegistro").value
  };

  if (!validarDados(dados)) {
    return;
  }

  criarRegistro(dados);
  materiaAtiva = null;
  limparCampos();
  atualizarTela();
}

/** Lê os valores digitados na janela de edição. */
function lerDadosEditor() {
  return {
    materia: getel("editMateria").value,
    titulo: getel("editTitulo").value,
    conteudo: getel("editorConteudo").value,
    data: getel("editData").value
  };
}

/** Impede que uma página seja criada sem os campos obrigatórios. */
function validarDados(dados) {
  if (!dados.materia.trim() || !dados.titulo.trim() || !dados.conteudo.trim()) {
    alert("Preencha matéria, título e conteúdo antes de salvar.");
    return false;
  }

  return true;
}

/** Pede confirmação antes de excluir e atualiza a interface depois. */
function confirmarExclusao(id, fecharDepois = false) {
  const registro = buscarRegistro(id);

  if (!registro) {
    return;
  }

  const confirmou = confirm(
    "Excluir a página “" + registro.titulo + "”? Essa ação não pode ser desfeita."
  );

  if (!confirmou) {
    return;
  }

  deletarRegistro(id);

  if (fecharDepois) {
    fecharEditor();
  }

  atualizarTela();
}
