function getel(id){return document.getElementById(id);}
function ordenarRegistros(registros){return [...registros].sort((a,b)=>(b.data||"").localeCompare(a.data||"")||Number(b.id)-Number(a.id));}
function formatarData(data){if(!data)return "Sem data";const [ano,mes,dia]=data.split("-");return dia+"/"+mes+"/"+ano;}
function formatarDataCurta(data){if(!data)return "—";const [ano,mes,dia]=data.split("-");return dia+"/"+mes;}
function dataAtual(){const agora=new Date(),fuso=agora.getTimezoneOffset()*60000;return new Date(agora.getTime()-fuso).toISOString().slice(0,10);}