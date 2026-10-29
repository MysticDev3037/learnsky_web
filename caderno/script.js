//Globais 
let ambientes = [];
let ambienteAtual = null;
let cadernoAtual = null;



//Inicialização
const ambientesSalvos = localStorage.getItem("ambientes");

if (ambientesSalvos !== null) {
    ambientes = JSON.parse(ambientesSalvos);
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
        paginas: []
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

    if (!cadernoAtual.paginas) {
        cadernoAtual.paginas = [];
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

    if (cadernoAtual.paginas.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhuma página criada ainda.";
        listaPaginas.appendChild(mensagem);
        return;
    }

    cadernoAtual.paginas.forEach((pagina) => {
        const cartao = document.createElement("article");
        const titulo = document.createElement("h3");

        titulo.textContent = pagina.titulo;
        cartao.appendChild(titulo);

        listaPaginas.appendChild(cartao);
    });
}

const botaoCriarPagina = document.querySelector("#criar-pagina");
const modalPagina = document.querySelector("#modal-pagina");
const formularioPagina = document.querySelector("#form-pagina");
const campoTituloPagina = document.querySelector("#titulo-pagina");
const botaoCancelarPagina = document.querySelector("#cancelar-pagina");

botaoCriarPagina.addEventListener("click", () => {
    modalPagina.showModal();
});

botaoCancelarPagina.addEventListener("click", () => {
    modalPagina.close();
});

formularioPagina.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const titulo = campoTituloPagina.value.trim();

    if (titulo === "" || cadernoAtual === null) {
        return;
    }

    const pagina = {
        titulo: titulo,
        conteudo: ""
    };

    cadernoAtual.paginas.push(pagina);

    localStorage.setItem("ambientes", JSON.stringify(ambientes));

    renderizarPaginas();

    formularioPagina.reset();
    modalPagina.close();
});