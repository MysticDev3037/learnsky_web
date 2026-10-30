//Globais 
let ambientes = [];
let ambienteAtual = null;
let cadernoAtual = null;





//Inicialização
const ambientesSalvos = localStorage.getItem("ambientes");

if (ambientesSalvos !== null) {
    ambientes = JSON.parse(ambientesSalvos);
}
function migrarCadernos() {
    let houveAlteracao = false;

    ambientes.forEach((ambiente) => {
        ambiente.cadernos?.forEach((caderno) => {

            // Evita migrar novamente um caderno já atualizado
            if (Array.isArray(caderno.blocos)) {
                return;
            }

            caderno.assuntos = [];
            caderno.grupos = [];
            caderno.blocos = [];

            const paginasAntigas = caderno.paginas || [];

            paginasAntigas.forEach((pagina, indicePagina) => {

                // Preserva a separação entre as antigas páginas
                if (indicePagina > 0) {
                    caderno.blocos.push({
                        id: gerarId("bloco"),
                        tipo: "quebra-pagina",
                        assuntoId: null,
                        grupoId: null
                    });
                }

                // Preserva o título da antiga página
                if (pagina.titulo?.trim()) {
                    caderno.blocos.push({
                        id: gerarId("bloco"),
                        tipo: "titulo",
                        conteudo: pagina.titulo,
                        assuntoId: null,
                        grupoId: null
                    });
                }

                // Transfere os blocos existentes
                (pagina.blocos || []).forEach((bloco) => {
                    caderno.blocos.push({
                        ...bloco,
                        id: bloco.id || gerarId("bloco"),
                        assuntoId: bloco.assuntoId ?? null,
                        grupoId: bloco.grupoId ?? null
                    });
                });
            });

            houveAlteracao = true;
        });
    });

    if (houveAlteracao) {
        localStorage.setItem(
            "ambientes",
            JSON.stringify(ambientes)
        );
    }
}

migrarCadernos();

function gerarId(prefixo) {
    if (crypto.randomUUID) {
        return `${prefixo}-${crypto.randomUUID()}`;
    }

    return `${prefixo}-${Date.now()}-${Math.random()
        .toString(36).substring(2, 9)}`;
}



//Montar os cartões no começo
function renderizarAmbientes() {
    listaAmbientes.innerHTML = "";

    ambientes.forEach((ambiente) => {
        const cartao = document.createElement("article");
        cartao.addEventListener("click", () => {
            abrirAmbiente(ambiente);
        });
        const titulo = document.createElement("h3");
        const textoDescricao = document.createElement("p");

        titulo.textContent = ambiente.nome;
        textoDescricao.textContent = ambiente.descricao;

        cartao.appendChild(titulo);

        if (ambiente.descricao !== "") {
            cartao.appendChild(textoDescricao);
        }

        listaAmbientes.appendChild(cartao);
    });

    mensagemVazia.hidden = ambientes.length > 0;
}



//Primeiro acesso para criar ambiente
const botaoCriar = document.querySelector("#criar-ambiente");
const modal = document.querySelector("#modal-ambiente");
const botaoCancelar = document.querySelector("#cancelar-ambiente");

botaoCriar.addEventListener("click", () => {
    modal.showModal();
});

botaoCancelar.addEventListener("click", () => {
    modal.close();
});


//Preencher e finalizar formulário

const formulario = document.querySelector("#form-ambiente");
const campoNome = document.querySelector("#nome-ambiente");
const campoDescricao = document.querySelector("#descricao-ambiente");
const listaAmbientes = document.querySelector("#lista-ambientes");
const mensagemVazia = document.querySelector("#mensagem-vazia");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const descricao = campoDescricao.value.trim();

    if (nome === "") {
        return;
    }

    const ambiente = {
        nome: nome,
        descricao: descricao,
        cadernos: []
    };

    ambientes.push(ambiente);
    localStorage.setItem("ambientes", JSON.stringify(ambientes));
    renderizarAmbientes();

    mensagemVazia.hidden = true;

    formulario.reset();
    modal.close();
});
renderizarAmbientes();



//Tela dentro do Ambiente
const telaInicio = document.querySelector("#inicio");
const secaoAmbientes = document.querySelector("#ambientes");
const telaAmbiente = document.querySelector("#tela-ambiente");

const tituloAmbiente = document.querySelector("#titulo-ambiente");
const descricaoAmbienteAberto = document.querySelector("#descricao-ambiente-aberto");
const botaoVoltar = document.querySelector("#voltar-inicio");
function abrirAmbiente(ambiente) {
    ambienteAtual = ambiente;
    if (!ambienteAtual.cadernos) {
    ambienteAtual.cadernos = [];
    }
    renderizarCadernos();

    telaInicio.hidden = true;
    secaoAmbientes.hidden = true;
    telaAmbiente.hidden = false;

    tituloAmbiente.textContent = ambiente.nome;
    descricaoAmbienteAberto.textContent = ambiente.descricao;
}
botaoVoltar.addEventListener("click", () => {
    telaAmbiente.hidden = true;
    telaInicio.hidden = false;
    secaoAmbientes.hidden = false;
});

//Criação de Caderno
const botaoCriarCaderno = document.querySelector("#criar-caderno");
const modalCaderno = document.querySelector("#modal-caderno");
const botaoCancelarCaderno = document.querySelector("#cancelar-caderno");

botaoCriarCaderno.addEventListener("click", () => {
    modalCaderno.showModal();
});

botaoCancelarCaderno.addEventListener("click", () => {
    modalCaderno.close();
});

//Formulario Criação caderno

const formularioCaderno = document.querySelector("#form-caderno");
const campoNomeCaderno = document.querySelector("#nome-caderno");
const campoDescricaoCaderno = document.querySelector("#descricao-caderno");
const listaCadernos = document.querySelector("#lista-cadernos");

formularioCaderno.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = campoNomeCaderno.value.trim();
    const descricao = campoDescricaoCaderno.value.trim();

    if (nome === "" || ambienteAtual === null) {
        return;
    }

    const caderno = {
        nome: nome,
        descricao: descricao,
        assuntos: [],
        grupos: [],
        blocos: []
    };

    ambienteAtual.cadernos.push(caderno);

    localStorage.setItem("ambientes", JSON.stringify(ambientes));

    renderizarCadernos();

    formularioCaderno.reset();
    modalCaderno.close();
});
function renderizarCadernos() {
    listaCadernos.innerHTML = "";

    if (ambienteAtual.cadernos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum caderno criado ainda.";
        listaCadernos.appendChild(mensagem);
        return;
    }

    ambienteAtual.cadernos.forEach((caderno) => {
        const cartao = document.createElement("article");
        cartao.addEventListener("click", () => {
            abrirCaderno(caderno);
        });
        const titulo = document.createElement("h3");
        const descricao = document.createElement("p");

        titulo.textContent = caderno.nome;
        descricao.textContent = caderno.descricao;

        cartao.appendChild(titulo);

        if (caderno.descricao !== "") {
            cartao.appendChild(descricao);
        }

        listaCadernos.appendChild(cartao);
    });
}



//Tela do caderno 

const telaCaderno = document.querySelector("#tela-caderno");
const tituloCaderno = document.querySelector("#titulo-caderno");
const descricaoCadernoAberto = document.querySelector("#descricao-caderno-aberto");
const botaoVoltarAmbiente = document.querySelector("#voltar-ambiente");
const listaPaginas = document.querySelector("#lista-paginas");


function abrirCaderno(caderno) {
    cadernoAtual = caderno;

    if (!Array.isArray(cadernoAtual.blocos)) {
        cadernoAtual.blocos = [];
    }

    if (!Array.isArray(cadernoAtual.assuntos)) {
        cadernoAtual.assuntos = [];
    }

    if (!Array.isArray(cadernoAtual.grupos)) {
        cadernoAtual.grupos = [];
    }

    telaAmbiente.hidden = true;
    telaCaderno.hidden = false;

    tituloCaderno.textContent = caderno.nome;
    descricaoCadernoAberto.textContent = caderno.descricao;

    renderizarPaginas();
}



//Tela Paginas

function renderizarPaginas() {
    listaPaginas.innerHTML = "";

    if (!Array.isArray(cadernoAtual.blocos)) {
        cadernoAtual.blocos = [];
    }

    // Área de adicionar blocos
    const areaAdicionar = document.createElement("div");
    areaAdicionar.classList.add("area-adicionar-bloco");

    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.textContent = "+ Adicionar bloco";

    const menuBlocos = document.createElement("div");
    menuBlocos.classList.add("menu-blocos");
    menuBlocos.style.display = "none";

    const tiposBloco = [
        { tipo: "texto", texto: "Texto corrido" },
        { tipo: "texto-isolado", texto: "Texto isolado" },
        { tipo: "titulo", texto: "Título" },
        { tipo: "subtitulo", texto: "Subtítulo" },
        { tipo: "codigo", texto: "Bloco de código" }
    ];

    tiposBloco.forEach((opcao) => {
        const botao = document.createElement("button");
        botao.textContent = opcao.texto;

        botao.addEventListener("click", () => {
            const bloco = {
                id: gerarId("bloco"),
                tipo: opcao.tipo === "texto-isolado" ? "texto" : opcao.tipo,
                conteudo: "",
                assuntoId: null,
                grupoId: null
            };

            if (opcao.tipo === "texto-isolado") {
                bloco.estilo = "isolado";
            }

            if (opcao.tipo === "texto") {
                bloco.estilo = "corrido";
            }

            if (opcao.tipo === "codigo") {
                bloco.linguagem = "javascript";
            }

            cadernoAtual.blocos.push(bloco);

            localStorage.setItem("ambientes", JSON.stringify(ambientes));
            renderizarPaginas();
        });

        menuBlocos.appendChild(botao);
    });

    botaoAdicionar.addEventListener("click", () => {
        menuBlocos.style.display =
            menuBlocos.style.display === "none" ? "flex" : "none";
    });

    areaAdicionar.appendChild(botaoAdicionar);
    areaAdicionar.appendChild(menuBlocos);
    listaPaginas.appendChild(areaAdicionar);

    // Caderno contínuo
    const cartao = document.createElement("article");
    cartao.classList.add("caderno-continuo");

    const areaConteudo = document.createElement("div");
    areaConteudo.classList.add("conteudo-pagina");
    
    let folhaAtual = document.createElement("div");
    folhaAtual.classList.add("folha-caderno");

    areaConteudo.appendChild(folhaAtual);

    cadernoAtual.blocos.forEach((bloco, indiceBloco) => {
        const elementoBloco = document.createElement("div");
        elementoBloco.classList.add("elemento-bloco");

        // Quebra de página
        if (bloco.tipo === "quebra-pagina") {
            elementoBloco.dataset.quebraPagina = "true";
        }

        // Texto
        if (bloco.tipo === "texto") {
            const texto = document.createElement("textarea");

            if (bloco.estilo === "isolado") {
                texto.classList.add("bloco-isolado");
            }

            texto.value = bloco.conteudo;
            texto.placeholder = "Comece a escrever...";

            texto.addEventListener("input", () => {
                bloco.conteudo = texto.value;

                texto.style.height = "auto";
                texto.style.height = texto.scrollHeight + "px";

                localStorage.setItem("ambientes", JSON.stringify(ambientes));
                solicitarPaginacao(areaConteudo);
            });

            elementoBloco.appendChild(texto);

            requestAnimationFrame(() => {
                texto.style.height = "auto";
                texto.style.height = texto.scrollHeight + "px";
            });
        }

        // Título
        if (bloco.tipo === "titulo") {
            const titulo = document.createElement("input");

            titulo.type = "text";
            titulo.placeholder = "Digite seu título...";
            titulo.value = bloco.conteudo;

            titulo.addEventListener("input", () => {
                bloco.conteudo = titulo.value;
                localStorage.setItem("ambientes", JSON.stringify(ambientes));
                solicitarPaginacao(areaConteudo);
            });

            elementoBloco.appendChild(titulo);
        }

        // Subtítulo
        if (bloco.tipo === "subtitulo") {
            const subtitulo = document.createElement("input");

            subtitulo.type = "text";
            subtitulo.placeholder = "Digite seu subtítulo...";
            subtitulo.value = bloco.conteudo;
            subtitulo.classList.add("bloco-subtitulo");

            subtitulo.addEventListener("input", () => {
                bloco.conteudo = subtitulo.value;
                localStorage.setItem("ambientes", JSON.stringify(ambientes));
                solicitarPaginacao(areaConteudo);
            });

            elementoBloco.appendChild(subtitulo);
        }

        // Código com Prism
        if (bloco.tipo === "codigo") {
            const editorContainer = document.createElement("div");
            editorContainer.classList.add("editor-codigo-container");

            const destaque = document.createElement("pre");
            const codigoDestacado = document.createElement("code");

            codigoDestacado.className =
                `language-${bloco.linguagem || "javascript"}`;
            codigoDestacado.textContent = bloco.conteudo;

            destaque.appendChild(codigoDestacado);
            editorContainer.appendChild(destaque);

            const editorCodigo = document.createElement("textarea");

            editorCodigo.classList.add("bloco-codigo");
            editorCodigo.placeholder = "Digite seu código...";
            editorCodigo.value = bloco.conteudo;
            editorCodigo.spellcheck = false;
            editorCodigo.wrap = "off";

            editorContainer.appendChild(editorCodigo);

            function atualizarDestaque() {
                codigoDestacado.className =
                    `language-${bloco.linguagem || "javascript"}`;

                codigoDestacado.textContent = editorCodigo.value;

                if (typeof Prism !== "undefined") {
                    Prism.highlightElement(codigoDestacado);
                }
            }

            function ajustarAltura() {
                editorCodigo.style.height = "auto";
                editorCodigo.style.height =
                    editorCodigo.scrollHeight + "px";

                destaque.style.height = editorCodigo.style.height;
            }

            
            editorCodigo.addEventListener("input", () => {
                bloco.conteudo = editorCodigo.value;

                localStorage.setItem("ambientes", JSON.stringify(ambientes));

                atualizarDestaque();
                ajustarAltura();
            });

            editorCodigo.addEventListener("scroll", () => {
                destaque.scrollTop = editorCodigo.scrollTop;
                destaque.scrollLeft = editorCodigo.scrollLeft;
            });

            editorCodigo.addEventListener("keydown", (evento) => {
                if (evento.key !== "Tab") return;

                evento.preventDefault();

                const inicio = editorCodigo.selectionStart;
                const fim = editorCodigo.selectionEnd;
                const conteudo = editorCodigo.value;

                const inicioLinha =
                    conteudo.lastIndexOf("\n", inicio - 1) + 1;

                let fimSelecao = fim;

                if (fim > inicio && conteudo[fim - 1] === "\n") {
                    fimSelecao--;
                }

                let fimLinha = conteudo.indexOf("\n", fimSelecao);

                if (fimLinha === -1) {
                    fimLinha = conteudo.length;
                }

                const trecho = conteudo.substring(inicioLinha, fimLinha);
                const linhas = trecho.split("\n");

                const novasLinhas = evento.shiftKey
                    ? linhas.map((linha) => {
                        if (linha.startsWith("\t")) {
                            return linha.substring(1);
                        }

                        return linha.replace(/^ {1,4}/, "");
                    })
                    : linhas.map((linha) => "    " + linha);

                editorCodigo.setRangeText(
                    novasLinhas.join("\n"),
                    inicioLinha,
                    fimLinha,
                    "select"
                );
                editorCodigo.addEventListener("input", () => {
                    bloco.conteudo = editorCodigo.value;

                    localStorage.setItem("ambientes", JSON.stringify(ambientes));

                    atualizarDestaque();
                    ajustarAltura();

                    solicitarPaginacao(areaConteudo);
                });

                bloco.conteudo = editorCodigo.value;

                localStorage.setItem("ambientes", JSON.stringify(ambientes));

                atualizarDestaque();
                ajustarAltura();
                solicitarPaginacao(areaConteudo);
            });

            elementoBloco.appendChild(editorContainer);

            requestAnimationFrame(() => {
                atualizarDestaque();
                ajustarAltura();
            });
        }

        // Controles do bloco
        const controles = document.createElement("div");
        controles.classList.add("controles-bloco");

        const botaoSubir = document.createElement("button");
        botaoSubir.textContent = "↑";
        botaoSubir.title = "Mover para cima";
        botaoSubir.disabled = indiceBloco === 0;

        botaoSubir.addEventListener("click", () => {
            const blocoMovido =
                cadernoAtual.blocos.splice(indiceBloco, 1)[0];

            cadernoAtual.blocos.splice(indiceBloco - 1, 0, blocoMovido);

            localStorage.setItem("ambientes", JSON.stringify(ambientes));
            renderizarPaginas();
        });

        const botaoDescer = document.createElement("button");
        botaoDescer.textContent = "↓";
        botaoDescer.title = "Mover para baixo";
        botaoDescer.disabled =
            indiceBloco === cadernoAtual.blocos.length - 1;

        botaoDescer.addEventListener("click", () => {
            const blocoMovido =
                cadernoAtual.blocos.splice(indiceBloco, 1)[0];

            cadernoAtual.blocos.splice(indiceBloco + 1, 0, blocoMovido);

            localStorage.setItem("ambientes", JSON.stringify(ambientes));
            renderizarPaginas();
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir bloco";
        botaoExcluir.classList.add("botao-excluir-bloco");

        botaoExcluir.addEventListener("click", () => {
            cadernoAtual.blocos.splice(indiceBloco, 1);

            localStorage.setItem("ambientes", JSON.stringify(ambientes));
            renderizarPaginas();
        });

        controles.appendChild(botaoSubir);
        controles.appendChild(botaoDescer);
        controles.appendChild(botaoExcluir);

        elementoBloco.appendChild(controles);
        folhaAtual.appendChild(elementoBloco);
    });

    cartao.appendChild(areaConteudo);
    listaPaginas.appendChild(cartao);

    solicitarPaginacao(areaConteudo);
}

function solicitarPaginacao(areaConteudo) {
    requestAnimationFrame(() => {
        paginarFolhas(areaConteudo);
    });
}


function paginarFolhas(areaConteudo) {
    // Guarda todos os blocos, inclusive os que já estão em outras folhas
    const blocos = Array.from(
        areaConteudo.querySelectorAll(".folha-caderno > .elemento-bloco")
    );

    // Preserva o foco e a posição do cursor
    const elementoFocado = document.activeElement;
    let inicioSelecao = null;
    let fimSelecao = null;

    if (
        elementoFocado &&
        (elementoFocado.tagName === "TEXTAREA" ||
         elementoFocado.tagName === "INPUT")
    ) {
        inicioSelecao = elementoFocado.selectionStart;
        fimSelecao = elementoFocado.selectionEnd;
    }

    

    areaConteudo.innerHTML = "";

    function criarFolha() {
        const folha = document.createElement("div");
        folha.classList.add("folha-caderno");
        areaConteudo.appendChild(folha);
        return folha;
    }

    let folhaAtual = criarFolha();

    blocos.forEach((elementoBloco, indice) => {

        // Quebra manual
        if (elementoBloco.dataset.quebraPagina === "true") {
            folhaAtual.appendChild(elementoBloco);

            const existemBlocosDepois = blocos
                .slice(indice + 1)
                .some((bloco) => bloco.dataset.quebraPagina !== "true");

            if (existemBlocosDepois) {
                const separador = document.createElement("div");
                separador.classList.add("quebra-pagina");
                separador.textContent = "Quebra de página";

                areaConteudo.appendChild(separador);
                folhaAtual = criarFolha();
            }

            return;
        }

        folhaAtual.appendChild(elementoBloco);

        // Verifica se o bloco ultrapassou o espaço disponível
        if (
            folhaAtual.scrollHeight > folhaAtual.clientHeight &&
            folhaAtual.children.length > 1
        ) {
            folhaAtual.removeChild(elementoBloco);

            folhaAtual = criarFolha();
            folhaAtual.appendChild(elementoBloco);
        }
    });

    // Restaura o foco e a posição do cursor
    if (elementoFocado && elementoFocado.isConnected) {
        elementoFocado.focus();

        if (
            inicioSelecao !== null &&
            typeof elementoFocado.setSelectionRange === "function"
        ) {
            elementoFocado.setSelectionRange(
                inicioSelecao,
                fimSelecao
            );
        }
    }
}


const botaoCriarPagina = document.querySelector("#criar-pagina");

botaoCriarPagina.textContent = "Inserir quebra de página";

botaoCriarPagina.addEventListener("click", () => {
    if (!cadernoAtual) return;

    cadernoAtual.blocos.push({
        id: gerarId("bloco"),
        tipo: "quebra-pagina",
        assuntoId: null,
        grupoId: null
    });

    localStorage.setItem("ambientes", JSON.stringify(ambientes));
    renderizarPaginas();
});
