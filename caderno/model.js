let registrosglobais = [];
let contador = 1;
let idEditando = null;
let materiaAtiva = null;

function listarMaterias(registros) {
  return [...new Set(registros.map(r => r.materia.trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b,"pt-BR"));
}
function buscarRegistro(id) { return registrosglobais.find(r => r.id === Number(id)) ?? null; }
function criarRegistro(dados) {
  const registro = { id: contador++, materia: dados.materia.trim(), titulo: dados.titulo.trim(), conteudo: dados.conteudo.trim(), data: dados.data || dataAtual() };
  registrosglobais.push(registro); salvarRegistros(); return registro;
}
function alterarRegistro(id,dados) {
  const r=buscarRegistro(id); if(!r) return false;
  r.materia=dados.materia.trim(); r.titulo=dados.titulo.trim(); r.conteudo=dados.conteudo.trim(); r.data=dados.data||r.data;
  salvarRegistros(); return true;
}
function deletarRegistro(id) {
  const antes=registrosglobais.length; registrosglobais=registrosglobais.filter(r=>r.id!==Number(id));
  if(antes===registrosglobais.length) return false; salvarRegistros(); return true;
}