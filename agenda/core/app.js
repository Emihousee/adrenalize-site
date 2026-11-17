
(function(){
'use strict';
var KEY='agenda-atendimentos-v1:'+location.pathname.replace(/index\.html$/,'');
var PRESET=window.AGENDA_PRESET||null;
var VIEWS=['agenda','clientes','caixa','ajustes'];
var DS=['dom','seg','ter','qua','qui','sex','sáb'];
var DSL=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
var ST={agendado:'Agendado',confirmado:'Confirmado',atendido:'Atendido',faltou:'Faltou',cancelado:'Cancelado'};
var CORES=['#1F8A84','#C2416B','#7A5AC8','#2F6FD1','#D9732B','#3E8E41','#B08A2E','#2B2B2B'];
var ZAP='<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z"/></svg>';

function $(id){return document.getElementById(id)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function p2(n){return (n<10?'0':'')+n}
function iso(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function parse(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function mais(s,n){var d=parse(s);d.setDate(d.getDate()+n);return iso(d)}
function hoje(){return iso(new Date())}
function min(h){var a=String(h).split(':');return (+a[0])*60+(+a[1]||0)}
function hhmm(m){return p2(Math.floor(m/60))+':'+p2(m%60)}
function brl(v){return (+v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function cap(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function longo(s){return cap(parse(s).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}))}
function curto(s){var d=parse(s);return p2(d.getDate())+'/'+p2(d.getMonth()+1)}
function medio(s){return DS[parse(s).getDay()]+', '+curto(s)}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function soNum(t){return String(t||'').replace(/\D/g,'')}
function iniciais(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(function(p){return p[0]}).join('').toUpperCase()}

/* ---------- dados ---------- */
function exemplo(){
  var h=hoje(),S=[{id:'s1',nome:'Design de sobrancelha',dur:40,valor:60},{id:'s2',nome:'Limpeza de pele',dur:60,valor:150},{id:'s3',nome:'Extensão de cílios',dur:90,valor:180},{id:'s4',nome:'Manutenção de cílios',dur:60,valor:110},{id:'s5',nome:'Manicure',dur:45,valor:45}];
  var C=[['Ana Souza','47991110001','03-12'],['Carla Mendes','47991110002',''],['Juliana Rocha','47991110003',''],['Mariana Costa','47991110004',''],['Patrícia Lima','47991110005',''],['Rita Fernandes','47991110006','']].map(function(c,i){return {id:'c'+(i+1),nome:c[0],tel:c[1],aniv:c[2]}});
  C[2].aniv=h.slice(5);
  var A=[],k=0;
  function ag(dia,hora,c,s,st,pago){var sv=S.filter(function(x){return x.id===s})[0];A.push({id:'a'+(++k),cli:c,srv:s,data:mais(h,dia),hora:hora,dur:sv.dur,valor:sv.valor,status:st,pago:!!pago,obs:''})}
  ag(-7,'09:00','c1','s1','atendido',1);ag(-7,'14:00','c2','s2','atendido',1);ag(-6,'10:00','c4','s3','atendido',1);ag(-5,'15:00','c5','s5','faltou');ag(-3,'09:30','c6','s4','atendido',1);ag(-2,'11:00','c3','s2','atendido',1);ag(-1,'16:00','c1','s5','atendido',0);
  ag(0,'08:30','c1','s1','confirmado');ag(0,'09:30','c4','s4','agendado');ag(0,'14:00','c3','s3','confirmado');ag(0,'16:00','c5','s5','agendado');
  ag(1,'10:00','c2','s2','agendado');ag(1,'15:00','c6','s1','agendado');ag(2,'09:00','c3','s4','agendado');ag(3,'13:30','c4','s2','agendado');ag(4,'10:00','c1','s3','agendado');
  var hr={};for(var i=0;i<7;i++)hr[i]=(i===0)?{on:false,ini:'09:00',fim:'18:00'}:(i===6?{on:true,ini:'08:00',fim:'12:00'}:{on:true,ini:'08:00',fim:'18:00'});
  return {exemplo:true,cfg:{nome:'Studio Bella',sigla:'SB',cor:'#1F8A84',tel:'47991110000',logo:'',passo:30,horas:hr,
    msg:'Olá, {nome}! Passando para confirmar seu horário de {servico} {dia} às {hora} aqui no {negocio}. Posso confirmar? 😊',
    msgAniv:'Feliz aniversário, {nome}! 🎉 Todo o time do {negocio} deseja um dia lindo. Tem um mimo esperando por você no seu próximo horário!'},
    servicos:S,clientes:C,ag:A};
}
var D;
function carregar(){
  try{var t=localStorage.getItem(KEY);if(t){D=JSON.parse(t);return}}catch(e){}
  if(PRESET){var e=exemplo();D={exemplo:false,cfg:e.cfg,servicos:PRESET.servicos||e.servicos,clientes:[],ag:[]};
    ['nome','sigla','cor','tel'].forEach(function(k){if(PRESET[k])D.cfg[k]=PRESET[k]});if(PRESET.horas)D.cfg.horas=PRESET.horas;salvar();}
  else D=exemplo();
}
function vencido(){return PRESET&&PRESET.validade&&hoje()>PRESET.validade}
function trava(){
  var t=document.querySelector('.trava');if(t)t.remove();
  if(!vencido())return;
  var d=document.createElement('div');d.className='trava';
  var msg='Olá! Quero renovar o plano anual da agenda do '+D.cfg.nome+'.';
  d.innerHTML='<h2>Seu plano anual venceu em '+curto(PRESET.validade)+'/'+PRESET.validade.slice(0,4)+'</h2><p>Seus dados continuam guardados neste aparelho. Renove para voltar a agendar.</p><a class="btn zap" href="'+esc(zap(PRESET.suporte||'47992814041',msg))+'" target="_blank" rel="noopener">'+ZAP+'Renovar pelo WhatsApp</a><button class="btn" data-act="copiar">Copiar backup dos meus dados</button>';
  $('app').appendChild(d);
}
function salvar(){try{localStorage.setItem(KEY,JSON.stringify(D));return true}catch(e){toast('Não foi possível salvar neste aparelho.');return false}}

var ui={view:'agenda',modo:'dia',dia:hoje(),busca:'',mes:hoje().slice(0,7)};
function cli(id){return D.clientes.filter(function(c){return c.id===id})[0]||{nome:'Cliente removido',tel:''}}
function srv(id){return D.servicos.filter(function(s){return s.id===id})[0]||{nome:'Serviço removido',dur:30,valor:0}}
function agd(id){return D.ag.filter(function(a){return a.id===id})[0]}
function doDia(d){return D.ag.filter(function(a){return a.data===d}).sort(function(a,b){return min(a.hora)-min(b.hora)})}
function ativos(d){return doDia(d).filter(function(a){return a.status!=='cancelado'})}
function expediente(d){var h=D.cfg.horas[parse(d).getDay()];return h&&h.on?[min(h.ini),min(h.fim)]:null}
function livres(d,dur,ignora){
  var ex=expediente(d);if(!ex)return [];
  var oc=ativos(d).filter(function(a){return a.id!==ignora}).map(function(a){return [min(a.hora),min(a.hora)+(+a.dur||30)]});
  var out=[],p=+D.cfg.passo||30,agora=new Date(),lim=d===hoje()?agora.getHours()*60+agora.getMinutes():-1;
  for(var m=ex[0];m+dur<=ex[1];m+=p){
    if(m<lim)continue;
    if(!oc.some(function(o){return m<o[1]&&m+dur>o[0]}))out.push(m);
  }
  return out;
}
function lacunas(d){
  var ex=expediente(d);if(!ex)return [];
  var oc=ativos(d).map(function(a){return [min(a.hora),min(a.hora)+(+a.dur||30)]}).sort(function(a,b){return a[0]-b[0]});
  var g=[],c=ex[0],agora=new Date(),lim=d===hoje()?agora.getHours()*60+agora.getMinutes():-1;
  oc.forEach(function(o){if(o[0]-c>=(+D.cfg.passo||30))g.push([c,o[0]]);c=Math.max(c,o[1])});
  if(ex[1]-c>=(+D.cfg.passo||30))g.push([c,ex[1]]);
  return g.filter(function(x){return x[1]>lim}).map(function(x){var p=+D.cfg.passo||30;var s=Math.max(x[0],lim>x[0]?Math.ceil(lim/p)*p:x[0]);return [s,x[1]]}).filter(function(x){return x[1]-x[0]>=15});
}
function texto(modelo,a){
  var c=cli(a.cli),s=srv(a.srv),dd=a.data===hoje()?'hoje':a.data===mais(hoje(),1)?'amanhã':DSL[parse(a.data).getDay()].toLowerCase()+', '+curto(a.data);
  return modelo.replace(/\{nome\}/g,c.nome.split(' ')[0]).replace(/\{servico\}/g,s.nome.toLowerCase()).replace(/\{dia\}/g,dd).replace(/\{hora\}/g,a.hora).replace(/\{negocio\}/g,D.cfg.nome);
}
function zap(tel,msg){var n=soNum(tel);if(n&&n.length<=11)n='55'+n;return 'https://wa.me/'+n+'?text='+encodeURIComponent(msg)}
function anivHoje(c){return c.aniv&&c.aniv===hoje().slice(5)}
function anivMes(c,ym){return c.aniv&&c.aniv.slice(0,2)===ym.slice(5,7)}

/* ---------- marca ---------- */
function marca(){
  var cor=D.cfg.cor||'#1F8A84';
  document.documentElement.style.setProperty('--brand',cor);var tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',cor);
  $('logo').innerHTML=D.cfg.logo?'<img src="'+esc(D.cfg.logo)+'" alt="">':esc(D.cfg.sigla||iniciais(D.cfg.nome));
  $('nome').textContent=D.cfg.nome;
  $('sub').textContent=longo(hoje());
}

/* ---------- telas ---------- */
function linha(a){
  var c=cli(a.cli),s=srv(a.srv);
  return '<li class="hr"><time>'+a.hora+'</time><button class="item s-'+a.status+'" data-act="ver" data-id="'+a.id+'"><span class="corpo"><strong>'+esc(c.nome)+'</strong><span>'+esc(s.nome)+' · '+a.dur+' min · '+brl(a.valor)+(a.pago?' · pago':'')+'</span></span><span class="chip">'+ST[a.status]+'</span></button></li>';
}
function telaAgenda(){
  var d=ui.dia,h=hoje(),out='';
  if(D.exemplo)out+='<div class="aviso info">Você está vendo dados de exemplo. <button data-act="limpar-ex">Apagar exemplos e começar</button></div>';
  var bday=D.clientes.filter(anivHoje);
  bday.forEach(function(c){out+='<div class="aviso">🎂 Hoje é aniversário de '+esc(c.nome)+'. <a href="'+esc(zap(c.tel,texto(D.cfg.msgAniv,{cli:c.id,srv:'',data:h,hora:''})))+'" target="_blank" rel="noopener">Mandar parabéns</a></div>'});
  out+='<div class="seg" role="group" aria-label="Visualização"><button data-act="modo" data-m="dia" aria-pressed="'+(ui.modo==='dia')+'">Dia</button><button data-act="modo" data-m="semana" aria-pressed="'+(ui.modo==='semana')+'">Semana</button></div>';
  var ini=mais(d,-((parse(d).getDay()+6)%7)),dias='';
  for(var i=0;i<7;i++){var x=mais(ini,i),n=ativos(x).length;dias+='<button class="dia'+(x===d&&ui.modo==='dia'?' sel':'')+(x===h?' hoje':'')+(n?' tem':'')+'" data-act="dia" data-d="'+x+'" aria-label="'+esc(longo(x))+(n?', '+n+' horários':'')+'"><span>'+DS[parse(x).getDay()]+'</span><b>'+parse(x).getDate()+'</b><i></i></button>'}
  out+='<div class="semana"><button class="seta" data-act="dia" data-d="'+mais(d,-7)+'" aria-label="Semana anterior">‹</button><div class="dias">'+dias+'</div><button class="seta" data-act="dia" data-d="'+mais(d,7)+'" aria-label="Próxima semana">›</button></div>';
  if(ui.modo==='semana')return out+telaSemana(ini);
  var l=doDia(d),at=l.filter(function(a){return a.status!=='cancelado'});
  out+='<div class="cab"><h2>'+(d===h?'Hoje':esc(longo(d)))+'</h2>'+(d!==h?'<button class="link" data-act="dia" data-d="'+h+'">Hoje</button>':'')+'</div>';
  var ex=expediente(d);
  out+='<p class="resumo"><span><b>'+at.length+'</b> '+(at.length===1?'horário':'horários')+'</span><span><b>'+brl(at.filter(function(a){return a.status!=='faltou'}).reduce(function(t,a){return t+(+a.valor||0)},0))+'</b> previstos</span><span>'+(ex?'Expediente '+hhmm(ex[0])+' às '+hhmm(ex[1]):'Dia de folga')+'</span></p>';
  var itens=l.map(function(a){return {m:min(a.hora),h:linha(a)}});
  lacunas(d).forEach(function(g){itens.push({m:g[0],h:'<li class="hr"><time>'+hhmm(g[0])+'</time><button class="livre" data-act="novo" data-d="'+d+'" data-h="'+hhmm(g[0])+'"><b>Livre</b> até '+hhmm(g[1])+' · toque para agendar</button></li>'})});
  itens.sort(function(a,b){return a.m-b.m});
  if(!itens.length)return out+'<div class="vazio">'+(ex?'Nenhum horário livre restante neste dia.':'Você não atende neste dia. Mude o expediente em Ajustes.')+'</div>';
  out+='<ol class="lista">'+itens.map(function(x){return x.h}).join('')+'</ol>';
  var pend=at.filter(function(a){return a.status==='agendado'&&a.data>=h});
  if(pend.length)out+='<p class="resumo">'+pend.length+(pend.length===1?' horário ainda sem confirmação. Toque nele para confirmar pelo WhatsApp.':' horários ainda sem confirmação. Toque em cada um para confirmar pelo WhatsApp.')+'</p>';
  return out;
}
function telaSemana(ini){
  var h=hoje(),out='<div class="semlista">',tot=0,n=0;
  for(var i=0;i<7;i++){
    var x=mais(ini,i),l=ativos(x),ex=expediente(x),v=l.filter(function(a){return a.status!=='faltou'}).reduce(function(t,a){return t+(+a.valor||0)},0);tot+=v;n+=l.length;
    var livreMin=0;lacunas(x).forEach(function(g){livreMin+=g[1]-g[0]});
    out+='<button class="semdia'+(x===h?' hoje':'')+'" data-act="dia-ver" data-d="'+x+'"><span class="d"><span>'+DS[parse(x).getDay()]+'</span><b>'+parse(x).getDate()+'</b></span><span class="x">'+
      (ex?(l.length?'<span class="horas">'+l.map(function(a){return '<i class="s-'+a.status+'">'+a.hora+'</i>'}).join('')+'</span><small>'+l.length+' horários · '+brl(v)+' · '+(livreMin>=60?Math.floor(livreMin/60)+'h'+(livreMin%60?p2(livreMin%60):'')+' livres':livreMin?livreMin+' min livres':'agenda cheia')+'</small>':'<small>Nenhum horário marcado · '+(livreMin?'dia livre':'')+'</small>'):'<small>Folga</small>')+'</span></button>';
  }
  return '<p class="resumo"><span><b>'+n+'</b> horários na semana</span><span><b>'+brl(tot)+'</b> previstos</span></p>'+out+'</div>';
}
function telaClientes(){
  var q=ui.busca.toLowerCase(),h=hoje();
  var l=D.clientes.filter(function(c){return !q||c.nome.toLowerCase().indexOf(q)>=0||soNum(c.tel).indexOf(soNum(q)||'#')>=0}).sort(function(a,b){return a.nome.localeCompare(b.nome,'pt-BR')});
  var out='<div class="cab"><h2>'+D.clientes.length+' clientes</h2><button class="link" data-act="novo-cli">+ Nova cliente</button></div><input class="busca" id="busca" type="search" placeholder="Buscar por nome ou telefone" value="'+esc(ui.busca)+'" aria-label="Buscar cliente">';
  var mes=D.clientes.filter(function(c){return anivMes(c,h)});
  if(mes.length&&!q)out+='<div class="aviso">🎂 Aniversariantes do mês: '+mes.map(function(c){return esc(c.nome.split(' ')[0])+' ('+c.aniv.split('-').reverse().join('/')+')'}).join(', ')+'</div>';
  if(!l.length)return out+'<div class="vazio">'+(q?'Nenhuma cliente encontrada.':'Cadastre a primeira cliente para começar.')+'</div>';
  return out+'<ul class="lista">'+l.map(function(c){
    var ags=D.ag.filter(function(a){return a.cli===c.id&&a.status!=='cancelado'}),prox=ags.filter(function(a){return a.data>=h&&a.status!=='atendido'&&a.status!=='faltou'}).sort(function(a,b){return (a.data+a.hora)<(b.data+b.hora)?-1:1})[0];
    var feitos=ags.filter(function(a){return a.status==='atendido'}).length;
    return '<li><button class="cli" data-act="ver-cli" data-id="'+c.id+'"><span class="av">'+esc(iniciais(c.nome))+'</span><span class="corpo"><strong>'+esc(c.nome)+'</strong><span>'+(prox?'Próximo: '+(prox.data===h?'hoje':medio(prox.data))+', '+prox.hora:feitos?feitos+(feitos===1?' atendimento':' atendimentos'):'Sem atendimentos ainda')+'</span></span>'+(anivHoje(c)?'<span class="bolo">Aniversário hoje</span>':'')+'</button></li>';
  }).join('')+'</ul>';
}
function telaCaixa(){
  var ym=ui.mes,l=D.ag.filter(function(a){return a.data.slice(0,7)===ym}),feitos=l.filter(function(a){return a.status==='atendido'});
  var rec=feitos.filter(function(a){return a.pago}).reduce(function(t,a){return t+(+a.valor||0)},0);
  var areceber=feitos.filter(function(a){return !a.pago}).reduce(function(t,a){return t+(+a.valor||0)},0);
  var prev=l.filter(function(a){return a.status==='agendado'||a.status==='confirmado'}).reduce(function(t,a){return t+(+a.valor||0)},0);
  var falt=l.filter(function(a){return a.status==='faltou'}).length;
  var d=new Date(+ym.slice(0,4),+ym.slice(5)-1,1),nome=cap(d.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}));
  var pm=new Date(d.getFullYear(),d.getMonth()-1,1),nm=new Date(d.getFullYear(),d.getMonth()+1,1);
  var out='<div class="cab"><button class="seta" data-act="mes" data-m="'+pm.getFullYear()+'-'+p2(pm.getMonth()+1)+'" aria-label="Mês anterior">‹</button><h2>'+esc(nome)+'</h2><button class="seta" data-act="mes" data-m="'+nm.getFullYear()+'-'+p2(nm.getMonth()+1)+'" aria-label="Próximo mês">›</button></div>';
  out+='<div class="kpis"><div class="kpi dest"><small>Recebido</small><b>'+brl(rec)+'</b></div><div class="kpi"><small>A receber</small><b>'+brl(areceber)+'</b></div><div class="kpi"><small>Agendado no mês</small><b>'+brl(prev)+'</b></div><div class="kpi"><small>Atendimentos · faltas</small><b>'+feitos.length+' · '+falt+'</b></div></div>';
  var por={};feitos.forEach(function(a){var k=srv(a.srv).nome;por[k]=por[k]||{n:0,v:0};por[k].n++;por[k].v+=+a.valor||0});
  var ks=Object.keys(por).sort(function(a,b){return por[b].v-por[a].v}),mx=ks.length?por[ks[0]].v:1;
  out+='<div class="barras"><h3 style="font-size:16px">Por serviço</h3>'+(ks.length?ks.map(function(k){return '<div class="barra"><span>'+esc(k)+' · '+por[k].n+'x</span><b>'+brl(por[k].v)+'</b><em><i style="width:'+Math.round(por[k].v/mx*100)+'%"></i></em></div>'}).join(''):'<p class="resumo">Nenhum atendimento concluído neste mês.</p>')+'</div>';
  var pend=feitos.filter(function(a){return !a.pago}).sort(function(a,b){return a.data<b.data?-1:1});
  if(pend.length)out+='<div class="cab"><h2 style="font-size:17px">Atendidos sem pagamento</h2></div><ol class="lista">'+pend.map(function(a){return '<li class="hr"><time>'+curto(a.data)+'</time><button class="item s-faltou" data-act="ver" data-id="'+a.id+'"><span class="corpo"><strong>'+esc(cli(a.cli).nome)+'</strong><span>'+esc(srv(a.srv).nome)+' · '+brl(a.valor)+'</span></span><span class="chip">A receber</span></button></li>'}).join('')+'</ol>';
  return out;
}
function telaAjustes(){
  var c=D.cfg,out='';
  out+='<section class="bloco"><h3>Seu negócio</h3><form data-form="cfg"><div class="campo"><label for="cf-nome">Nome</label><input id="cf-nome" name="nome" required value="'+esc(c.nome)+'"></div>'+
    '<div class="duo"><div class="campo"><label for="cf-sigla">Sigla do ícone</label><input id="cf-sigla" name="sigla" maxlength="3" value="'+esc(c.sigla)+'"></div><div class="campo"><label for="cf-tel">WhatsApp do negócio</label><input id="cf-tel" name="tel" inputmode="tel" value="'+esc(c.tel)+'"></div></div>'+
    '<div class="campo"><label>Cor</label><div class="cores">'+CORES.map(function(k){return '<button type="button" data-act="cor" data-c="'+k+'" style="background:'+k+'" aria-label="Cor '+k+'" aria-pressed="'+(k.toLowerCase()===String(c.cor).toLowerCase())+'"></button>'}).join('')+'</div></div>'+
    '<div class="campo"><label for="cf-logo">Logo</label><input id="cf-logo" type="file" accept="image/*"><small>'+(c.logo?'Logo carregada. <button type="button" class="link" data-act="tira-logo">Remover logo</button>':'Imagem quadrada fica melhor.')+'</small></div>'+
    '<button class="btn pri" type="submit">Salvar dados do negócio</button></form></section>';
  out+='<section class="bloco"><div class="cab"><h3>Serviços</h3><button class="link" data-act="novo-srv">+ Novo serviço</button></div>'+(D.servicos.length?D.servicos.map(function(s){return '<div class="linha"><span><strong>'+esc(s.nome)+'</strong><br><small>'+s.dur+' min · '+brl(s.valor)+'</small></span><button class="link" data-act="ver-srv" data-id="'+s.id+'">Editar</button></div>'}).join(''):'<p class="resumo">Cadastre os serviços com duração e valor.</p>')+'</section>';
  out+='<section class="bloco"><h3>Expediente</h3><form data-form="horas"><div class="hrs">'+[1,2,3,4,5,6,0].map(function(i){var h=c.horas[i];return '<label><input type="checkbox" name="on'+i+'"'+(h.on?' checked':'')+'>'+DS[i]+'</label><input type="time" name="ini'+i+'" value="'+h.ini+'" aria-label="Início '+DSL[i]+'"><input type="time" name="fim'+i+'" value="'+h.fim+'" aria-label="Fim '+DSL[i]+'">'}).join('')+'</div>'+
    '<div class="campo"><label for="cf-passo">Intervalo entre horários</label><select id="cf-passo" name="passo">'+[15,20,30,45,60].map(function(p){return '<option value="'+p+'"'+(+c.passo===p?' selected':'')+'>'+p+' minutos</option>'}).join('')+'</select></div><button class="btn pri" type="submit">Salvar expediente</button></form></section>';
  out+='<section class="bloco"><h3>Mensagens do WhatsApp</h3><form data-form="msg"><div class="campo"><label for="cf-msg">Confirmação de horário</label><textarea id="cf-msg" name="msg">'+esc(c.msg)+'</textarea></div><div class="campo"><label for="cf-aniv">Aniversário</label><textarea id="cf-aniv" name="msgAniv">'+esc(c.msgAniv)+'</textarea><small>Use {nome}, {servico}, {dia}, {hora} e {negocio}. O app troca pelos dados de cada horário.</small></div><button class="btn pri" type="submit">Salvar mensagens</button></form></section>';
  if(PRESET&&PRESET.validade)out+='<section class="bloco"><h3>Plano anual</h3><p class="resumo">Válido até '+curto(PRESET.validade)+'/'+PRESET.validade.slice(0,4)+'. Suporte: Adrenalize Marketing Digital.</p></section>';
  out+='<section class="bloco"><h3>Backup</h3><p class="resumo">Seus dados ficam só neste aparelho. Faça um backup toda semana e guarde no seu e-mail ou no Drive.</p><div class="acoes"><button class="btn" data-act="baixar">Baixar backup</button><button class="btn" data-act="copiar">Copiar backup</button></div><div class="campo"><label for="cf-rest">Restaurar de um arquivo</label><input id="cf-rest" type="file" accept=".json,application/json"></div><div id="rest-msg"></div></section>';
  return out;
}
function render(){
  marca();trava();
  var m=$('main'),sc=m.scrollTop;
  m.innerHTML=ui.view==='agenda'?telaAgenda():ui.view==='clientes'?telaClientes():ui.view==='caixa'?telaCaixa():telaAjustes();
  m.scrollTop=sc;
  $('fab').hidden=ui.view==='ajustes'||ui.view==='caixa';
  [].forEach.call(document.querySelectorAll('nav a'),function(a){if(a.dataset.v===ui.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
function rota(){var h=location.hash.slice(1);ui.view=VIEWS.indexOf(h)>=0?h:'agenda';fechar();$('main').scrollTop=0;render()}

/* ---------- folhas ---------- */
function abrir(t,html){$('folha').innerHTML='<header><h2 id="folha-t">'+esc(t)+'</h2><button class="fechar" data-act="fechar" aria-label="Fechar">×</button></header>'+html;$('folha').setAttribute('aria-labelledby','folha-t');$('fundo').hidden=false;var f=$('folha').querySelector('input,select,textarea,button:not(.fechar)');if(f)f.focus()}
function fechar(){$('fundo').hidden=true;$('folha').innerHTML=''}
var tt;function toast(m){var o=document.querySelector('.toast');if(o)o.remove();var e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=m;$('app').appendChild(e);clearTimeout(tt);tt=setTimeout(function(){e.remove()},2600)}

function ver(id){
  var a=agd(id);if(!a)return;var c=cli(a.cli),s=srv(a.srv);
  var bts=[];
  if(a.status==='agendado'||a.status==='confirmado'){bts.push('<button class="btn" data-act="st" data-s="atendido" data-id="'+id+'">Marcar atendido</button>');bts.push('<button class="btn" data-act="st" data-s="faltou" data-id="'+id+'">Faltou</button>')}
  if(a.status==='agendado')bts.unshift('<button class="btn" data-act="st" data-s="confirmado" data-id="'+id+'">Cliente confirmou</button>');
  if(a.status==='atendido')bts.push('<button class="btn'+(a.pago?'':' pri')+'" data-act="pago" data-id="'+id+'">'+(a.pago?'Desfazer pagamento':'Marcar como pago')+'</button>');
  if(a.status!=='agendado'&&a.status!=='confirmado')bts.push('<button class="btn" data-act="st" data-s="agendado" data-id="'+id+'">Voltar para agendado</button>');
  abrir(c.nome,'<dl class="dados"><dt>Status</dt><dd><span class="chip s-'+a.status+'">'+ST[a.status]+'</span>'+(a.pago?' <span class="chip s-atendido">Pago</span>':'')+'</dd><dt>Quando</dt><dd>'+esc(longo(a.data).toLowerCase())+', '+a.hora+' às '+hhmm(min(a.hora)+(+a.dur||0))+'</dd><dt>Serviço</dt><dd>'+esc(s.nome)+' · '+a.dur+' min</dd><dt>Valor</dt><dd>'+brl(a.valor)+'</dd>'+(c.tel?'<dt>WhatsApp</dt><dd>'+esc(c.tel)+'</dd>':'')+(a.obs?'<dt>Obs.</dt><dd>'+esc(a.obs)+'</dd>':'')+'</dl>'+
    (c.tel&&(a.status==='agendado'||a.status==='confirmado')?'<a class="btn zap" href="'+esc(zap(c.tel,texto(D.cfg.msg,a)))+'" target="_blank" rel="noopener">'+ZAP+'Confirmar pelo WhatsApp</a>':'')+
    '<div class="acoes">'+bts.join('')+'</div><div class="acoes"><button class="btn" data-act="editar" data-id="'+id+'">Remarcar ou editar</button>'+(a.status!=='cancelado'?'<button class="btn perigo" data-act="st" data-s="cancelado" data-id="'+id+'">Cancelar horário</button>':'<button class="btn perigo" data-act="pede-del" data-id="'+id+'">Excluir</button>')+'</div>');
}
function formAg(a,d0,h0){
  var novo=!a;
  if(!D.servicos.length){toast('Cadastre um serviço em Ajustes primeiro.');return}
  a=a||{cli:'',srv:D.servicos[0].id,data:d0||(ui.dia<hoje()?hoje():ui.dia),hora:h0||'',dur:D.servicos[0].dur,valor:D.servicos[0].valor,obs:''};
  var cs=D.clientes.slice().sort(function(x,y){return x.nome.localeCompare(y.nome,'pt-BR')});
  abrir(novo?'Novo agendamento':'Remarcar ou editar','<form data-form="ag" data-id="'+(novo?'':a.id)+'">'+
    '<div class="campo"><label for="ag-cli">Cliente</label><select id="ag-cli" name="cli"><option value="">'+(cs.length?'Escolha a cliente':'Nenhuma cliente cadastrada')+'</option><option value="__nova">+ Nova cliente</option>'+cs.map(function(c){return '<option value="'+c.id+'"'+(c.id===a.cli?' selected':'')+'>'+esc(c.nome)+'</option>'}).join('')+'</select></div>'+
    '<div id="ag-nova" class="duo" hidden><div class="campo"><label for="ag-nn">Nome</label><input id="ag-nn" name="nn"></div><div class="campo"><label for="ag-nt">WhatsApp</label><input id="ag-nt" name="nt" inputmode="tel" placeholder="47 99999-9999"></div></div>'+
    '<div class="campo"><label for="ag-srv">Serviço</label><select id="ag-srv" name="srv">'+D.servicos.map(function(s){return '<option value="'+s.id+'"'+(s.id===a.srv?' selected':'')+'>'+esc(s.nome)+' · '+s.dur+' min</option>'}).join('')+'</select></div>'+
    '<div class="duo"><div class="campo"><label for="ag-data">Dia</label><input id="ag-data" name="data" type="date" required value="'+a.data+'"></div><div class="campo"><label for="ag-hora">Horário</label><input id="ag-hora" name="hora" type="time" required value="'+a.hora+'"></div></div>'+
    '<div class="campo"><label>Horários livres</label><div class="slots" id="ag-slots"></div></div>'+
    '<div class="duo"><div class="campo"><label for="ag-dur">Duração (min)</label><input id="ag-dur" name="dur" type="number" min="5" step="5" value="'+a.dur+'"></div><div class="campo"><label for="ag-val">Valor (R$)</label><input id="ag-val" name="valor" type="number" min="0" step="0.01" value="'+a.valor+'"></div></div>'+
    '<div class="campo"><label for="ag-obs">Observação</label><input id="ag-obs" name="obs" value="'+esc(a.obs)+'" placeholder="Ex.: prefere a sala 2"></div>'+
    '<div id="ag-alerta"></div><button class="btn pri" type="submit">'+(novo?'Agendar':'Salvar alterações')+'</button></form>');
  slots(a.id);
}
function slots(ignora){
  var b=$('ag-slots');if(!b)return;
  var d=$('ag-data').value,dur=+$('ag-dur').value||30,h=$('ag-hora').value;
  var l=d?livres(d,dur,ignora):[];
  b.innerHTML=l.length?l.map(function(m){var x=hhmm(m);return '<button type="button" data-act="slot" data-h="'+x+'" aria-pressed="'+(x===h)+'">'+x+'</button>'}).join(''):'<small style="color:var(--muted)">'+(d&&!expediente(d)?'Dia de folga. Você ainda pode digitar um horário.':'Sem horários livres para essa duração.')+'</small>';
}
function formCli(c){
  var novo=!c;c=c||{nome:'',tel:'',aniv:''};
  var av=c.aniv?'2000-'+c.aniv:'';
  abrir(novo?'Nova cliente':'Editar cliente','<form data-form="cli" data-id="'+(novo?'':c.id)+'"><div class="campo"><label for="cl-nome">Nome</label><input id="cl-nome" name="nome" required value="'+esc(c.nome)+'"></div><div class="campo"><label for="cl-tel">WhatsApp</label><input id="cl-tel" name="tel" inputmode="tel" value="'+esc(c.tel)+'" placeholder="47 99999-9999"></div><div class="campo"><label for="cl-aniv">Aniversário (dia e mês)</label><input id="cl-aniv" name="aniv" type="date" value="'+av+'"><small>O ano não importa. O app avisa no dia.</small></div><button class="btn pri" type="submit">Salvar</button></form>'+(novo?'':'<button class="btn perigo" data-act="pede-del-cli" data-id="'+c.id+'">Excluir cliente</button>'));
}
function verCli(id){
  var c=D.clientes.filter(function(x){return x.id===id})[0];if(!c)return;var h=hoje();
  var ags=D.ag.filter(function(a){return a.cli===id}).sort(function(a,b){return (b.data+b.hora)<(a.data+a.hora)?-1:1});
  var gasto=ags.filter(function(a){return a.status==='atendido'}).reduce(function(t,a){return t+(+a.valor||0)},0);
  var ult=ags.filter(function(a){return a.status==='atendido'})[0],falt=ags.filter(function(a){return a.status==='faltou'}).length;
  abrir(c.nome,'<dl class="dados">'+(c.tel?'<dt>WhatsApp</dt><dd>'+esc(c.tel)+'</dd>':'')+(c.aniv?'<dt>Aniversário</dt><dd>'+c.aniv.split('-').reverse().join('/')+'</dd>':'')+'<dt>Atendimentos</dt><dd>'+ags.filter(function(a){return a.status==='atendido'}).length+(falt?' · '+falt+(falt===1?' falta':' faltas'):'')+'</dd><dt>Total gasto</dt><dd>'+brl(gasto)+'</dd>'+(ult?'<dt>Última visita</dt><dd>'+medio(ult.data)+' · '+esc(srv(ult.srv).nome)+'</dd>':'')+'</dl>'+
    '<div class="acoes"><button class="btn pri" data-act="novo-para" data-id="'+id+'">Agendar</button>'+(c.tel?'<a class="btn zap" href="'+esc(zap(c.tel,'Olá, '+c.nome.split(' ')[0]+'! '))+'" target="_blank" rel="noopener">'+ZAP+'WhatsApp</a>':'')+'</div>'+
    (ags.length?'<ol class="lista">'+ags.slice(0,12).map(function(a){return '<li class="hr"><time>'+curto(a.data)+'</time><button class="item s-'+a.status+'" data-act="ver" data-id="'+a.id+'"><span class="corpo"><strong>'+esc(srv(a.srv).nome)+'</strong><span>'+a.hora+' · '+brl(a.valor)+'</span></span><span class="chip">'+ST[a.status]+'</span></button></li>'}).join('')+'</ol>':'')+
    '<button class="btn" data-act="edita-cli" data-id="'+id+'">Editar cadastro</button>');
}
function formSrv(s){
  var novo=!s;s=s||{nome:'',dur:60,valor:''};
  abrir(novo?'Novo serviço':'Editar serviço','<form data-form="srv" data-id="'+(novo?'':s.id)+'"><div class="campo"><label for="sv-nome">Nome</label><input id="sv-nome" name="nome" required value="'+esc(s.nome)+'"></div><div class="duo"><div class="campo"><label for="sv-dur">Duração (min)</label><input id="sv-dur" name="dur" type="number" min="5" step="5" required value="'+s.dur+'"></div><div class="campo"><label for="sv-val">Valor (R$)</label><input id="sv-val" name="valor" type="number" min="0" step="0.01" required value="'+s.valor+'"></div></div><button class="btn pri" type="submit">Salvar</button></form>'+(novo?'':'<button class="btn perigo" data-act="del-srv" data-id="'+s.id+'">Excluir serviço</button>'));
}

/* ---------- ações ---------- */
function ok(m){salvar();fechar();render();if(m)toast(m)}
function enviar(f){
  var d={},t=f.dataset.form,id=f.dataset.id;
  [].forEach.call(f.elements,function(e){if(e.name)d[e.name]=e.type==='checkbox'?e.checked:String(e.value).trim()});
  if(t==='ag'){
    var al=$('ag-alerta');
    if(d.cli==='__nova'){if(!d.nn){al.innerHTML='<div class="alerta">Digite o nome da nova cliente.</div>';return}var nc={id:uid(),nome:d.nn,tel:d.nt,aniv:''};D.clientes.push(nc);d.cli=nc.id}
    if(!d.cli){al.innerHTML='<div class="alerta">Escolha a cliente.</div>';return}
    if(!d.hora){al.innerHTML='<div class="alerta">Escolha um horário.</div>';return}
    var ini=min(d.hora),fim=ini+(+d.dur||30);
    var choque=ativos(d.data).filter(function(a){return a.id!==id&&ini<min(a.hora)+(+a.dur||30)&&fim>min(a.hora)})[0];
    if(choque&&f.dataset.forca!=='1'){al.innerHTML='<div class="alerta">Esse horário bate com '+esc(cli(choque.cli).nome)+' ('+choque.hora+'). Toque em salvar de novo para agendar mesmo assim.</div>';f.dataset.forca='1';return}
    var o={cli:d.cli,srv:d.srv,data:d.data,hora:d.hora,dur:+d.dur||30,valor:+d.valor||0,obs:d.obs};
    if(id){var a=agd(id);for(var k in o)a[k]=o[k];ui.dia=d.data;ok('Horário atualizado')}
    else{o.id=uid();o.status='agendado';o.pago=false;D.ag.push(o);ui.dia=d.data;ui.modo='dia';if(location.hash!=='#agenda')location.hash='agenda';ok('Agendado para '+medio(d.data)+' às '+d.hora)}
  }else if(t==='cli'){
    var aniv=d.aniv?d.aniv.slice(5):'';
    if(id){var c=D.clientes.filter(function(x){return x.id===id})[0];c.nome=d.nome;c.tel=d.tel;c.aniv=aniv}else D.clientes.push({id:uid(),nome:d.nome,tel:d.tel,aniv:aniv});
    ok('Cliente salva');
  }else if(t==='srv'){
    if(id){var s=srv(id);s.nome=d.nome;s.dur=+d.dur;s.valor=+d.valor}else D.servicos.push({id:uid(),nome:d.nome,dur:+d.dur,valor:+d.valor});
    ok('Serviço salvo');
  }else if(t==='cfg'){D.cfg.nome=d.nome;D.cfg.sigla=d.sigla;D.cfg.tel=d.tel;ok('Dados salvos')}
  else if(t==='horas'){for(var i=0;i<7;i++){if(d['ini'+i]>=d['fim'+i]&&d['on'+i]){toast(DSL[i]+': o fim precisa ser depois do início.');return}D.cfg.horas[i]={on:!!d['on'+i],ini:d['ini'+i],fim:d['fim'+i]}}D.cfg.passo=+d.passo;ok('Expediente salvo')}
  else if(t==='msg'){D.cfg.msg=d.msg;D.cfg.msgAniv=d.msgAniv;ok('Mensagens salvas')}
}
function backup(){return JSON.stringify(D)}
document.addEventListener('click',function(e){
  if(e.target===$('fundo')){fechar();return}
  var b=e.target.closest('[data-act]');if(!b)return;
  var act=b.dataset.act,id=b.dataset.id,a;
  if(act==='fechar')fechar();
  else if(act==='dia'){ui.dia=b.dataset.d;render()}
  else if(act==='dia-ver'){ui.dia=b.dataset.d;ui.modo='dia';render()}
  else if(act==='modo'){ui.modo=b.dataset.m;render()}
  else if(act==='novo')formAg(null,b.dataset.d,b.dataset.h);
  else if(act==='novo-para'){formAg(null);$('ag-cli').value=id}
  else if(act==='ver')ver(id);
  else if(act==='editar'){a=agd(id);if(a)formAg(a)}
  else if(act==='slot'){$('ag-hora').value=b.dataset.h;[].forEach.call($('ag-slots').children,function(x){x.setAttribute('aria-pressed',x===b)})}
  else if(act==='st'){a=agd(id);a.status=b.dataset.s;if(a.status!=='atendido')a.pago=false;ok(ST[a.status])}
  else if(act==='pago'){a=agd(id);a.pago=!a.pago;ok(a.pago?'Pagamento registrado':'Pagamento desfeito')}
  else if(act==='pede-del'){abrir('Excluir horário?','<p style="margin:0">O horário sai da agenda e do caixa. Não dá para desfazer.</p><div class="acoes"><button class="btn" data-act="fechar">Manter</button><button class="btn perigo" data-act="del" data-id="'+id+'">Excluir</button></div>')}
  else if(act==='del'){D.ag=D.ag.filter(function(x){return x.id!==id});ok('Horário excluído')}
  else if(act==='novo-cli')formCli();
  else if(act==='ver-cli')verCli(id);
  else if(act==='edita-cli')formCli(D.clientes.filter(function(x){return x.id===id})[0]);
  else if(act==='pede-del-cli'){abrir('Excluir cliente?','<p style="margin:0">O cadastro e todo o histórico dessa cliente saem do app. Não dá para desfazer.</p><div class="acoes"><button class="btn" data-act="fechar">Manter</button><button class="btn perigo" data-act="del-cli" data-id="'+id+'">Excluir</button></div>')}
  else if(act==='del-cli'){D.clientes=D.clientes.filter(function(x){return x.id!==id});D.ag=D.ag.filter(function(x){return x.cli!==id});ok('Cliente excluída')}
  else if(act==='novo-srv')formSrv();
  else if(act==='ver-srv')formSrv(srv(id));
  else if(act==='del-srv'){D.servicos=D.servicos.filter(function(x){return x.id!==id});ok('Serviço excluído')}
  else if(act==='mes'){ui.mes=b.dataset.m;render()}
  else if(act==='cor'){D.cfg.cor=b.dataset.c;salvar();render()}
  else if(act==='tira-logo'){D.cfg.logo='';salvar();render()}
  else if(act==='limpar-ex'){abrir('Começar do zero?','<p style="margin:0">As clientes, os horários e o caixa de exemplo serão apagados. Os serviços e o expediente ficam para você ajustar.</p><div class="acoes"><button class="btn" data-act="fechar">Voltar</button><button class="btn pri" data-act="limpar">Apagar exemplos</button></div>')}
  else if(act==='limpar'){D.clientes=[];D.ag=[];D.exemplo=false;D.cfg.nome='Meu negócio';D.cfg.sigla='';ok('Pronto. Agora é com você!');location.hash='ajustes'}
  else if(act==='baixar'){try{var bl=new Blob([backup()],{type:'application/json'}),u=URL.createObjectURL(bl),l=document.createElement('a');l.href=u;l.download='backup-agenda-'+hoje()+'.json';document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u)},1500);toast('Backup gerado. Se o download não começar, use Copiar backup.')}catch(x){toast('Use Copiar backup neste aparelho.')}}
  else if(act==='copiar'){var tx=backup();(navigator.clipboard?navigator.clipboard.writeText(tx):Promise.reject()).then(function(){toast('Backup copiado. Cole no seu e-mail ou nas notas.')},function(){abrir('Copie o backup','<textarea readonly style="width:100%;min-height:200px" id="bk">'+esc(tx)+'</textarea>');$('bk').select()})}
});
document.addEventListener('submit',function(e){e.preventDefault();if(e.target.dataset.form)enviar(e.target)});
document.addEventListener('input',function(e){if(e.target.id==='busca'){ui.busca=e.target.value;var p=e.target.selectionStart;render();var n=$('busca');n.focus();n.setSelectionRange(p,p)}});
document.addEventListener('change',function(e){
  var t=e.target;
  if(t.id==='ag-cli'){$('ag-nova').hidden=t.value!=='__nova'}
  else if(t.id==='ag-srv'){var s=srv(t.value);$('ag-dur').value=s.dur;$('ag-val').value=s.valor;slots(document.querySelector('[data-form=ag]').dataset.id)}
  else if(t.id==='ag-data'||t.id==='ag-dur'){slots(document.querySelector('[data-form=ag]').dataset.id)}
  else if(t.id==='cf-logo'&&t.files[0]){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),z=256;c.width=c.height=z;var g=c.getContext('2d'),s=Math.min(im.width,im.height);g.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,z,z);D.cfg.logo=c.toDataURL('image/png');salvar();render();toast('Logo atualizada')};im.src=r.result};r.readAsDataURL(t.files[0])}
  else if(t.id==='cf-rest'&&t.files[0]){var rd=new FileReader();rd.onload=function(){try{var o=JSON.parse(rd.result);if(!o.cfg||!Array.isArray(o.ag))throw 0;D=o;salvar();render();toast('Backup restaurado')}catch(x){$('rest-msg').innerHTML='<div class="alerta">Esse arquivo não é um backup da agenda.</div>'}};rd.readAsText(t.files[0])}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('fundo').hidden)fechar()});
window.addEventListener('hashchange',rota);
carregar();rota();
})();

if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(function(){})}
