function atualizarTela() {
  const busca=getel("buscar").value.trim().toLocaleLowerCase("pt-BR");
  const filtrados=registrosglobais.filter(r=>(!busca||[r.materia,r.titulo,r.conteudo].some(v=>v.toLocaleLowerCase("pt-BR").includes(busca)))&&(!materiaAtiva||r.materia===materiaAtiva));
  renderizarRegistros(ordenarRegistros(filtrados)); renderizarMaterias(); atualizarResumo();
}
function renderizarRegistros(registros) {
  const lista=getel("listaRegistro"); lista.replaceChildren();
  getel("estadoVazio").classList.toggle("hidden",registros.length!==0);
  getel("contadorRegistros").textContent=registros.length+" "+(registros.length===1?"página":"páginas");
  getel("tituloRegistros").textContent=materiaAtiva?"Páginas da matéria":(getel("buscar").value.trim()?"Resultados da pesquisa":"Suas páginas");
  for(const r of registros) {
    const card=document.createElement("article"); card.className="record-card";
    const top=document.createElement("div"); top.className="record-topline";
    const pill=document.createElement("span"); pill.className="subject-pill"; pill.textContent=r.materia;
    const date=document.createElement("span"); date.className="record-date"; date.textContent=formatarData(r.data); top.append(pill,date);
    const title=document.createElement("h3"); title.className="record-title"; title.textContent=r.titulo;
    const body=document.createElement("p"); body.className="record-content"; body.textContent=r.conteudo;
    const footer=document.createElement("div"); footer.className="record-footer";
    const hint=document.createElement("span"); hint.textContent="Página de estudo";
    const actions=document.createElement("div"); actions.className="record-actions";
    for(const [acao,label] of [["editar","Editar"],["excluir","Excluir"]]) { const b=document.createElement("button"); b.className="record-action"; b.dataset.acao=acao; b.dataset.id=r.id; b.textContent=label; actions.append(b); }
    footer.append(hint,actions); card.append(top,title,body,footer); lista.append(card);
  }
}
function renderizarMaterias() {
  const materias=listarMaterias(registrosglobais),nav=getel("listaMateriasSidebar"); nav.replaceChildren();
  getel("totalMaterias").textContent=materias.length; getel("statMaterias").textContent=materias.length;
  for(const nome of materias) {
    const b=document.createElement("button"); b.className="subject-button"+(materiaAtiva===nome?" active":""); b.dataset.materia=nome;
    const icon=document.createElement("span"); icon.className="subject-glyph"; icon.textContent="◈";
    const label=document.createElement("span"); label.className="subject-name"; label.textContent=nome;
    const count=document.createElement("span"); count.className="subject-count"; count.textContent=registrosglobais.filter(r=>r.materia===nome).length;
    b.append(icon,label,count); nav.append(b);
  }
  for(const id of ["listaMaterias","listaMateriasEditor"]) { const dl=getel(id); dl.replaceChildren(); for(const nome of materias) { const o=document.createElement("option"); o.value=nome; dl.append(o); } }
}
function atualizarResumo() {
  getel("statPaginas").textContent=registrosglobais.length;
  const recente=ordenarRegistros(registrosglobais)[0]; getel("statUltima").textContent=recente?formatarDataCurta(recente.data):"—";
  getel("tituloLista").textContent=materiaAtiva||(getel("buscar").value.trim()?"Pesquisar páginas":"Todas as páginas");
  getel("breadcrumbAtual").textContent=materiaAtiva||"Todas as páginas";
  getel("subtituloLista").textContent=materiaAtiva?"Anotações e ideias de "+materiaAtiva+".":"Suas anotações, ideias e descobertas em um só lugar.";
}
function abrirEditor(id) {
  const r=buscarRegistro(id); if(!r)return; idEditando=r.id;
  getel("editMateria").value=r.materia; getel("editTitulo").value=r.titulo; getel("editData").value=r.data; getel("editorConteudo").value=r.conteudo; getel("dialogEditor").showModal();
}
function fecharEditor(){getel("dialogEditor").close();idEditando=null;}
function limparCampos(){getel("materia").value="";getel("titulo").value="";getel("conteudo").value="";getel("dataRegistro").value=dataAtual();}
function focarNovaPagina(){materiaAtiva=null;atualizarTela();getel("composer").scrollIntoView({behavior:"smooth",block:"center"});getel("materia").focus({preventScroll:true});}