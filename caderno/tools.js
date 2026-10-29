/*
 * Tools — funções pequenas reutilizadas em outros arquivos.
 * Elas não controlam a interface nem guardam os registros.
 */

/** Atalho para buscar um elemento HTML pelo atributo id. */
function getel(id) {
  return document.getElementById(id);
}

/** Ordena sem alterar a lista original: data mais recente primeiro. */
function ordenarRegistros(registros) {
  return [...registros].sort((a, b) =>
    (b.data || "").localeCompare(a.data || "") || Number(b.id) - Number(a.id)
  );
}

/** Converte uma data AAAA-MM-DD para DD/MM/AAAA. */
function formatarData(data) {
  if (!data) {
    return "Sem data";
  }

  const [ano, mes, dia] = data.split("-");
  return dia + "/" + mes + "/" + ano;
}

/** Versão curta da data, usada no painel de estatísticas. */
function formatarDataCurta(data) {
  if (!data) {
    return "—";
  }

  const [ano, mes, dia] = data.split("-");
  return dia + "/" + mes;
}

/** Retorna a data de hoje no formato esperado pelo input type=date. */
function dataAtual() {
  const agora = new Date();
  const diferencaFuso = agora.getTimezoneOffset() * 60000;

  // Ajusta o fuso antes de usar toISOString para evitar trocar o dia.
  return new Date(agora.getTime() - diferencaFuso).toISOString().slice(0, 10);
}
