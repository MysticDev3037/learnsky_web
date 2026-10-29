/*
 * View — tudo que desenha ou atualiza informações na página.
 * O controller.js chama estas funções depois de uma ação do usuário.
 */

/** Atualiza a lista de páginas, as matérias e as estatísticas. */
function atualizarTela() {
  const busca = getel("buscar").value.trim().toLocaleLowerCase("pt-BR");

  // Aplica dois filtros opcionais: texto da busca e matéria selecionada.
  const filtrados = registrosglobais.filter(registro => {
    const correspondeBusca = !busca || [
      registro.materia,
      registro.titulo,
      registro.conteudo
    ].some(valor => valor.toLocaleLowerCase("pt-BR").includes(busca));

    const correspondeMateria = !materiaAtiva || registro.materia === materiaAtiva;

    return correspondeBusca && correspondeMateria;
  });

  renderizarRegistros(ordenarRegistros(filtrados));
  renderizarMaterias();
  atualizarResumo();
}

/** Cria os cartões das páginas encontradas na busca/filtro. */
function renderizarRegistros(registros) {
  const lista = getel("listaRegistro");
  lista.replaceChildren();

  // O estado vazio só aparece quando não há resultados.
  getel("estadoVazio").classList.toggle("hidden", registros.length !== 0);

  getel("contadorRegistros").textContent =
    registros.length + " " + (registros.length === 1 ? "página" : "páginas");

  getel("tituloRegistros").textContent = materiaAtiva
    ? "Páginas da matéria"
    : (getel("buscar").value.trim() ? "Resultados da pesquisa" : "Suas páginas");

  for (const registro of registros) {
    // Criar elementos com textContent evita interpretar a anotação como HTML.
    const cartao = document.createElement("article");
    cartao.className = "record-card";

    const linhaTopo = document.createElement("div");
    linhaTopo.className = "record-topline";

    const etiquetaMateria = document.createElement("span");
    etiquetaMateria.className = "subject-pill";
    etiquetaMateria.textContent = registro.materia;

    const data = document.createElement("span");
    data.className = "record-date";
    data.textContent = formatarData(registro.data);
    linhaTopo.append(etiquetaMateria, data);

    const titulo = document.createElement("h3");
    titulo.className = "record-title";
    titulo.textContent = registro.titulo;

    const conteudo = document.createElement("p");
    conteudo.className = "record-content";
    conteudo.textContent = registro.conteudo;

    const rodape = document.createElement("div");
    rodape.className = "record-footer";

    const dica = document.createElement("span");
    dica.textContent = "Página de estudo";

    const acoes = document.createElement("div");
    acoes.className = "record-actions";

    // Os botões carregam o ID no data-id para sabermos qual página editar.
    for (const [acao, rotulo] of [["editar", "Editar"], ["excluir", "Excluir"]]) {
      const botao = document.createElement("button");
      botao.className = "record-action";
      botao.dataset.acao = acao;
      botao.dataset.id = registro.id;
      botao.textContent = rotulo;
      acoes.append(botao);
    }

    rodape.append(dica, acoes);
    cartao.append(linhaTopo, titulo, conteudo, rodape);
    lista.append(cartao);
  }
}

/** Atualiza a lista lateral de matérias e os campos de sugestão. */
function renderizarMaterias() {
  const materias = listarMaterias(registrosglobais);
  const navegacao = getel("listaMateriasSidebar");
  navegacao.replaceChildren();

  getel("totalMaterias").textContent = materias.length;
  getel("statMaterias").textContent = materias.length;

  for (const nome of materias) {
    const botao = document.createElement("button");
    botao.className = "subject-button" + (materiaAtiva === nome ? " active" : "");
    botao.dataset.materia = nome;

    const icone = document.createElement("span");
    icone.className = "subject-glyph";
    icone.textContent = "◈";

    const rotulo = document.createElement("span");
    rotulo.className = "subject-name";
    rotulo.textContent = nome;

    const quantidade = document.createElement("span");
    quantidade.className = "subject-count";
    quantidade.textContent = registrosglobais.filter(
      registro => registro.materia === nome
    ).length;

    botao.append(icone, rotulo, quantidade);
    navegacao.append(botao);
  }

  // Datalists sugerem matérias já existentes sem impedir nomes novos.
  for (const id of ["listaMaterias", "listaMateriasEditor"]) {
    const listaSugestoes = getel(id);
    listaSugestoes.replaceChildren();

    for (const nome of materias) {
      const opcao = document.createElement("option");
      opcao.value = nome;
      listaSugestoes.append(opcao);
    }
  }
}

/** Atualiza título, caminho de navegação e painel de estatísticas. */
function atualizarResumo() {
  getel("statPaginas").textContent = registrosglobais.length;

  const registroMaisRecente = ordenarRegistros(registrosglobais)[0];
  getel("statUltima").textContent = registroMaisRecente
    ? formatarDataCurta(registroMaisRecente.data)
    : "—";

  getel("tituloLista").textContent = materiaAtiva
    || (getel("buscar").value.trim() ? "Pesquisar páginas" : "Todas as páginas");

  getel("breadcrumbAtual").textContent = materiaAtiva || "Todas as páginas";
  getel("subtituloLista").textContent = materiaAtiva
    ? "Anotações e ideias de " + materiaAtiva + "."
    : "Suas anotações, ideias e descobertas em um só lugar.";
}

/** Preenche e abre a janela de edição de uma página. */
function abrirEditor(id) {
  const registro = buscarRegistro(id);

  if (!registro) {
    return;
  }

  idEditando = registro.id;
  getel("editMateria").value = registro.materia;
  getel("editTitulo").value = registro.titulo;
  getel("editData").value = registro.data;
  getel("editorConteudo").value = registro.conteudo;
  getel("dialogEditor").showModal();
}

/** Fecha a janela de edição e limpa o ID selecionado. */
function fecharEditor() {
  getel("dialogEditor").close();
  idEditando = null;
}

/** Limpa o formulário e volta a preencher a data atual. */
function limparCampos() {
  getel("materia").value = "";
  getel("titulo").value = "";
  getel("conteudo").value = "";
  getel("dataRegistro").value = dataAtual();
}

/** Leva a tela até o formulário e coloca o cursor no campo Matéria. */
function focarNovaPagina() {
  materiaAtiva = null;
  atualizarTela();
  getel("composer").scrollIntoView({ behavior: "smooth", block: "center" });
  getel("materia").focus({ preventScroll: true });
}
