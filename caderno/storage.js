const CHAVE_REGISTROS = "registros";
function carregarRegistro() {
  try {
    const dados=localStorage.getItem(CHAVE_REGISTROS);
    if(dados!==null) { const parseado=JSON.parse(dados); registrosglobais=Array.isArray(parseado)?parseado:[]; }
    else {
      registrosglobais=[
        {id:1,materia:"Estrutura de Dados",titulo:"Listas Encadeadas",conteudo:"Revisar listas simplesmente encadeadas.\n\nAnote aqui as ideias importantes e exemplos que ajudarem a fixar o conteúdo.",data:"2026-07-07"},
        {id:2,materia:"UX Design",titulo:"Wireframe",conteudo:"Criar um wireframe de baixa fidelidade.\n\nObjetivo: organizar a hierarquia visual antes de pensar nos detalhes.",data:"2026-07-06"}
      ]; salvarRegistros();
    }
  } catch(erro) { console.error("Erro ao carregar registros:",erro); registrosglobais=[]; }
  contador=registrosglobais.reduce((maior,r)=>Math.max(maior,Number(r.id)||0),0)+1;
}
function salvarRegistros() {
  try { localStorage.setItem(CHAVE_REGISTROS,JSON.stringify(registrosglobais)); }
  catch(erro) { console.error("Erro ao salvar:",erro); alert("Não foi possível salvar no navegador."); }
}