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

    const cartao = document.createElement("article");
    const titulo = document.createElement("h3");
    const textoDescricao = document.createElement("p");

    titulo.textContent = nome;
    textoDescricao.textContent = descricao;

    cartao.appendChild(titulo);

    if (descricao !== "") {
        cartao.appendChild(textoDescricao);
    }

    listaAmbientes.appendChild(cartao);

    mensagemVazia.hidden = true;

    formulario.reset();
    modal.close();
});
