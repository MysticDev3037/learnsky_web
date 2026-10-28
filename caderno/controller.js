function iniciarEventos() {
  getel("btnSalvar").addEventListener("click",salvarNovaPagina);
  getel("btnLimpar").addEventListener("click",limparCampos);
  for(const id of ["btnNovoTopo","btnNovaPagina","btnCriarVazio","atalhoNova"]) getel(id).addEventListener("click",focarNovaPagina);
  getel("atalhoHoje").addEventListener("click",()=>{materiaAtiva=null;getel("buscar").value="";atualizarTela();getel("workspace-scroll").scrollTo({top:0,behavior:"smooth"});});
  getel("btnInicio").addEventListener("click",()=>{materiaAtiva=null;atualizarTela();});
  getel("buscar").addEventListener("input",atualizarTela);
  getel("listaMateriasSidebar").addEventListener("click",e=>{const b=e.target.closest("[data-materia]");if(!b)return;materiaAtiva=materiaAtiva===b.dataset.materia?null:b.dataset.materia;atualizarTela();});
  getel("listaRegistro").addEventListener("click",e=>{const b=e.target.closest("[data-acao]");if(!b)return;const id=Number(b.dataset.id);if(b.dataset.acao==="editar")abrirEditor(id);if(b.dataset.acao==="excluir")confirmarExclusao(id);});
  getel("formEditar").addEventListener("submit",e=>{e.preventDefault();const d=lerDadosEditor();if(!validarDados(d))return;alterarRegistro(idEditando,d);fecharEditor();atualizarTela();});
  getel("btnFecharEditor").addEventListener("click",fecharEditor); getel("btnCancelarEditor").addEventListener("click",fecharEditor);
  getel("btnExcluir").addEventListener("click",()=>{if(idEditando!==null)confirmarExclusao(idEditando,true);});
  getel("dialogEditor").addEventListener("click",e=>{if(e.target===getel("dialogEditor"))fecharEditor();});
  getel("btnPerfil").addEventListener("click",()=>alert("Seu espaço pessoal do LearnSky. O perfil será configurado futuramente."));
  getel("btnPerfilDetalhes").addEventListener("click",()=>alert("Mais opções estarão disponíveis futuramente."));
}
function salvarNovaPagina() {
  const d={materia:getel("materia").value,titulo:getel("titulo").value,conteudo:getel("conteudo").value,data:getel("dataRegistro").value};
  if(!validarDados(d))return; criarRegistro(d);materiaAtiva=null;limparCampos();atualizarTela();
}
function lerDadosEditor(){return {materia:getel("editMateria").value,titulo:getel("editTitulo").value,conteudo:getel("editorConteudo").value,data:getel("editData").value};}
function validarDados(d){if(!d.materia.trim()||!d.titulo.trim()||!d.conteudo.trim()){alert("Preencha matéria, título e conteúdo antes de salvar.");return false;}return true;}
function confirmarExclusao(id,fecharDepois=false){const r=buscarRegistro(id);if(!r)return;if(!confirm("Excluir a página “"+r.titulo+"”? Essa ação não pode ser desfeita."))return;deletarRegistro(id);if(fecharDepois)fecharEditor();atualizarTela();}