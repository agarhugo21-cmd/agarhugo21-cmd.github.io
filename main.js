
(function(){
"use strict";
var REST_URL="/proyectos/restaurante/";
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s){return document.querySelector(s)||document.createElement('div');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- uptime desde el inicio de ASIR ---------- */
var START=new Date(2025,8,15);
function uptime(){var ms=Date.now()-START,d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60;
  return d+' días, '+h+' h, '+m+' min';}
function tick(){var u=uptime();$('#uptime').textContent='uptime ASIR: '+u;$('#uptime2').textContent=u;}
tick();setInterval(tick,30000);

/* ---------- habilidades (niveles tomados de su CV en Notion) ---------- */
var IFS=[
  ['Gi0/1','Redes',['Packet Tracer','Cisco IOS','RIP','OSPF','EIGRP','VLAN e inter-VLAN','TCP/IP','Subnetting'],5],
  ['Gi0/2','Hardware',['Montaje de equipos','Mantenimiento'],5],
  ['Gi0/3','Sistemas',['Windows Server','Active Directory','Linux','Usuarios y permisos'],4],
  ['Gi0/4','Servicios',['DHCP','DNS','Servidor web'],4],
  ['Gi0/5','Virtualización',['VirtualBox','VMware'],4],
  ['Gi0/6','Bases de datos',['MySQL','Oracle','MySQL Workbench','Triggers'],4],
  ['Gi0/7','Desarrollo',['HTML','CSS','JavaScript','Python','Arduino'],4],
  ['Gi0/8','Idiomas',['Inglés B2'],3]
];
var tb=$('#if-body');
IFS.forEach(function(r){var tr=document.createElement('tr');var bars='';for(var i=1;i<=5;i++)bars+='<i class="'+(i<=r[3]?'on':'')+'"></i>';
  tr.innerHTML='<td class="port">'+r[0]+'</td><td class="area">'+r[1]+'</td><td><div class="chips">'+r[2].map(function(c){return '<span>'+esc(c)+'</span>';}).join('')+'</div></td><td><span class="sig" role="img" aria-label="Nivel '+r[3]+' de 5">'+bars+'</span></td><td><span class="st"><span class="led"></span>connected</span></td>';
  tb.appendChild(tr);});

/* ---------- topología de la portada ---------- */
var NS='http://www.w3.org/2000/svg';
var core={id:'core',x:260,y:240,w:150,h:64,t:'HUGO-R1',s:'core · 10.0.0.1'};
var N=[
  {id:'sobre-mi',x:92,y:78,t:'Sobre mí',s:'VLAN 10'},
  {id:'habilidades',x:428,y:78,t:'Habilidades',s:'VLAN 20'},
  {id:'proyectos',x:458,y:262,t:'Proyectos',s:'VLAN 30'},
  {id:'trayectoria',x:392,y:420,t:'Trayectoria',s:'VLAN 40'},
  {id:'consola',x:128,y:420,t:'Consola',s:'VLAN 50'},
  {id:'contacto',x:62,y:262,t:'Contacto',s:'VLAN 99'},
  {id:'ayuda',x:260,y:62,t:'Ayuda',s:'VLAN 60'}
];
var gL=$('#links'),gP=$('#pkts'),gN=$('#nodes');
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
var lines={};
N.forEach(function(n){var l=el('line',{x1:core.x,y1:core.y,x2:n.x,y2:n.y,'class':'link'});gL.appendChild(l);lines[n.id]=l;});
function drawNode(n,isCore){
  var w=n.w||124,h=n.h||52,g=el('g',{'class':'node'+(isCore?' core':''),transform:'translate('+(n.x-w/2)+','+(n.y-h/2)+')'});
  g.appendChild(el('rect',{width:w,height:h,rx:8}));
  var led=el('circle',{cx:w-12,cy:12,r:3.5,fill:'#3ddc84'});g.appendChild(led);
  var t=el('text',{x:14,y:isCore?34:24,'class':'ttl'});t.textContent=n.t;g.appendChild(t);
  var s=el('text',{x:14,y:isCore?52:40,'class':'sub'});s.textContent=n.s;g.appendChild(s);
  if(!isCore){g.setAttribute('tabindex','0');g.setAttribute('role','link');g.setAttribute('aria-label','Ir a '+n.t);
    var go=function(){burst(n);setTimeout(function(){var d=document.getElementById(n.id);if(d&&(n.id==='contacto'||n.id==='consola'))d.scrollIntoView({behavior:reduce?'auto':'smooth'});else location.href='/'+n.id+'/';},reduce?0:380);};
    g.addEventListener('click',go);g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});
    g.addEventListener('mouseenter',function(){lines[n.id].classList.add('hot');});
    g.addEventListener('mouseleave',function(){lines[n.id].classList.remove('hot');});}
  gN.appendChild(g);
}
N.forEach(function(n){drawNode(n,false);});drawNode(core,true);

var P=[];
function spawn(n,out,fast){var c=el('circle',{r:fast?4.5:3,fill:out?'#47c6ff':'#ffb547'});gP.appendChild(c);
  P.push({c:c,n:n,out:out,t:0,sp:fast?0.045:0.008+Math.random()*0.006});}
function burst(n){for(var i=0;i<3;i++)setTimeout(function(){spawn(n,true,true);},i*90);}
var last=0;
function loop(ts){
  if(ts-last>420&&P.length<16){last=ts;spawn(N[Math.floor(Math.random()*N.length)],Math.random()<.55,false);}
  P=P.filter(function(p){p.t+=p.sp;var t=Math.min(1,p.t),a=p.out?{x:core.x,y:core.y}:p.n,b=p.out?p.n:{x:core.x,y:core.y};
    p.c.setAttribute('cx',a.x+(b.x-a.x)*t);p.c.setAttribute('cy',a.y+(b.y-a.y)*t);
    p.c.setAttribute('opacity',Math.sin(Math.PI*t).toFixed(2));
    if(t>=1){p.c.remove();return false;}return true;});
  requestAnimationFrame(loop);
}
if(!reduce)requestAnimationFrame(loop);

/* ---------- navegación activa ---------- */
var navLinks=[].slice.call(document.querySelectorAll('#nav a'));
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){navLinks.forEach(function(a){var h=a.getAttribute('href');a.classList.toggle('on',a.dataset.cur==='1'||h.slice(-(e.target.id.length+1))==='#'+e.target.id);});}});},{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(function(s){io.observe(s);});
}

/* ---------- visor de diapositivas ---------- */
var S=20,k=0,img=$('#slide'),cnt=$('#count'),th=$('#thumbs');
function pad(n){return String(n).padStart(2,'0');}
for(var i=1;i<=S;i++){(function(i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Diapositiva '+i);
  b.innerHTML='<img src="/asti-'+pad(i)+'.jpg" alt="" loading="lazy">';b.onclick=function(){k=i-1;show();};th.appendChild(b);})(i);}
function show(){img.src='/asti-'+pad(k+1)+'.jpg';cnt.textContent=(k+1)+' / '+S;
  [].forEach.call(th.children,function(b,j){b.classList.toggle('on',j===k);if(j===k&&b.scrollIntoView)b.scrollIntoView({block:'nearest',inline:'center'});});}
$('#prev').onclick=function(){k=(k+S-1)%S;show();};
$('#next').onclick=function(){k=(k+1)%S;show();};
$('#dlg-asti').addEventListener('keydown',function(e){if(e.key==='ArrowRight'){k=(k+1)%S;show();}if(e.key==='ArrowLeft'){k=(k+S-1)%S;show();}});
function openDlg(name){var d=document.getElementById('dlg-'+name);if(!d){location.href='/proyectos/?abrir='+name;return;}if(name==='asti'){k=0;show();}if(d.showModal)d.showModal();else d.setAttribute('open','');}
document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){openDlg(b.dataset.open);});});
document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){b.closest('dialog').close();});});
document.querySelectorAll('dialog').forEach(function(d){d.addEventListener('click',function(e){if(e.target===d)d.close();});});

/* ---------- copiar ---------- */
document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
  var e=document.getElementById(b.dataset.copy),t=e.textContent.trim();
  function sel(){var r=document.createRange();r.selectNodeContents(e);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Seleccionado';}
  try{navigator.clipboard.writeText(t).then(function(){b.textContent='Copiado ✓';setTimeout(function(){b.textContent='Copiar';},1800);},sel);}catch(x){sel();}
});});

/* ---------- ping en contacto ---------- */
var pingBox=$('#ping'),pinged=false;
function runPing(){if(pinged)return;pinged=true;
  var lines=['HUGO-R1# ping agarhugo21@gmail.com','Type escape sequence to abort.','Sending 5, 100-byte ICMP Echos, timeout is 2 seconds:'],i=0;
  function add(h){var d=document.createElement('div');d.innerHTML=h;pingBox.appendChild(d);}
  lines.forEach(function(l){add(esc(l));});
  var row=document.createElement('div');row.className='g';pingBox.appendChild(row);
  var n=0,iv=setInterval(function(){row.textContent+='!';n++;if(n===5){clearInterval(iv);add('Success rate is <span class="g">100 percent (5/5)</span>, round-trip min/avg/max = 1/2/4 ms');}},reduce?0:260);
}
if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){runPing();o.disconnect();}},{threshold:.4}).observe(pingBox);}else runPing();

/* ---------- consola interactiva ---------- */
var scr=$('#screen'),inp=$('#cmd'),form=$('#prompt'),hist=[],hi=0;
function out(h,cls){var d=document.createElement('div');d.className='ln'+(cls?' '+cls:'');d.innerHTML=h;scr.appendChild(d);scr.scrollTop=scr.scrollHeight;}
function echo(c){out('<span class="c">invitado@HUGO-R1:~$</span> <span class="w">'+esc(c)+'</span>');}
function go(id,label){out('<span class="d">→ abriendo '+label+'…</span>');setTimeout(function(){var d=document.getElementById(id);if(d)d.scrollIntoView({behavior:reduce?'auto':'smooth'});else location.href=(id==='consola'?'/#consola':'/'+id+'/');},350);}
var C={
  help:function(){out([
    '<span class="w">Comandos disponibles</span>',
    '  <span class="c">whoami</span>                   quién soy',
    '  <span class="c">show version</span>             ficha rápida',
    '  <span class="c">show ip interface brief</span>  mis habilidades',
    '  <span class="c">proyectos</span>                lista de proyectos',
    '  <span class="c">proyecto &lt;n&gt;</span>             abre un proyecto (1-5)',
    '  <span class="c">traceroute</span>               mi trayectoria',
    '  <span class="c">certificaciones</span>          cursos y logros',
    '  <span class="c">contacto</span>                 cómo escribirme',
    '  <span class="c">ping hugo</span>                ¿estoy disponible?',
    '  <span class="c">sudo contratar</span>           …',
    '  <span class="c">clear</span>                    limpiar pantalla'].join('\n'));},
  whoami:function(){out('<span class="w">Hugo González García</span>\nEstudiante de 2.º de ASIR en Digitech FP Madrid.\nRedes, sistemas y bases de datos. Finalista del ASTI Robotics Challenge 2026.');},
  'show version':function(){out('Hugo González García, versión <span class="w">ASIR 2.º curso</span>\nuptime is <span class="a">'+uptime()+'</span>\nIdiomas: inglés B2 · Madrid · Carnet B\nEstado: <span class="g">disponible para prácticas</span>');},
  'show ip interface brief':function(){var s='<span class="d">Interface   Área              Status    Protocol</span>\n';
    IFS.forEach(function(r){s+=(r[0]+'      ').slice(0,12)+(r[1]+'                  ').slice(0,18)+'<span class="g">up        up</span>\n';});out(s.replace(/\n$/,''));},
  proyectos:function(){out(['<span class="d">#  Proyecto                        Área</span>','1  Robotics Masters (finalista)    robótica','2  La Casa Antigua 1899            web','3  Triggers para una tienda        bases de datos','4  Proyecto final de redes         redes','5  Laboratorio de sistemas         sistemas','','Escribe <span class="c">proyecto 1</span> para abrir uno.'].join('\n'));},
  traceroute:function(){var h=[['1','Bachillerato de Ciencias','2019-21'],['2','ASIR · Digitech FP','2025-27'],['3','Finalista ASTI Challenge','2026'],['4','Cisco Ciberseguridad','2026']],i=0;
    out('traceroute to futuro.empresa.es, 30 hops max');
    (function nx(){if(i<h.length){out(' '+h[i][0]+'  '+(h[i][1]+'                          ').slice(0,28)+'<span class="a">'+h[i][2]+'</span>');i++;setTimeout(nx,reduce?0:220);}
      else out(' 5  <span class="a">* * *</span>  Request timed out. ¿Tu empresa? → <span class="c">contacto</span>');})();},
  certificaciones:function(){out('<span class="g">✓</span> Finalista ASTI Robotics Challenge (10.ª edición, 2026)\n<span class="g">✓</span> Introducción a la Ciberseguridad · Cisco Networking Academy  <a href="https://www.credly.com/badges/9e4b54c9-1e8d-414b-a5e9-50c37e8c5df9" target="_blank" rel="noopener">[verificar]</a>\n<span class="a">…</span> Fundamentos de Ciberseguridad · Cisco Networking Academy · en curso\n<span class="a">…</span> Grado Superior en ASIR · en curso (2027)');},
  contacto:function(){out('Email     <span class="w">agarhugo21@gmail.com</span>\nTeléfono  <span class="w">+34 620 591 880</span>\nLinkedIn  <a href="https://www.linkedin.com/in/hugo-gonz%C3%A1lez-garc%C3%ADa-54010b175/" target="_blank" rel="noopener">Hugo González García</a>\nGitHub    <a href="https://github.com/agarhugo21-cmd" target="_blank" rel="noopener">agarhugo21-cmd</a>');},
  'ping hugo':function(){out('Sending 5, 100-byte ICMP Echos to hugo, timeout is 2 seconds:');var r=document.createElement('div');r.className='ln g';scr.appendChild(r);var n=0;
    var iv=setInterval(function(){r.textContent+='!';n++;scr.scrollTop=scr.scrollHeight;if(n===5){clearInterval(iv);out('Success rate is <span class="g">100 percent (5/5)</span>. Hugo está disponible.');}},reduce?0:200);},
  'sudo contratar':function(){out('[sudo] contraseña para reclutador: ********');setTimeout(function(){out('<span class="g">Acceso concedido.</span> Buena decisión.');go('contacto','contacto');},reduce?0:600);},
  sudo:function(){out('<span class="r">Uso:</span> sudo contratar');},
  clear:function(){scr.innerHTML='';},
  ls:function(){out('<span class="c">sobre-mi/</span>  <span class="c">habilidades/</span>  <span class="c">proyectos/</span>  <span class="c">trayectoria/</span>  <span class="c">ayuda/</span>  <span class="c">contacto/</span>  cv.txt');},
  'cat cv.txt':function(){C.whoami();C.certificaciones();},
  date:function(){out(new Date().toLocaleString('es-ES'));},
  exit:function(){out('<span class="d">Connection to hugo-r1 closed… es broma, sigue mirando.</span>');},
  enable:function(){out('<span class="d">Ya estás en modo privilegiado. Prueba</span> <span class="c">show running-config</span>');},
  'show running-config':function(){out('<span class="d">!</span>\nhostname HUGO-R1\n<span class="d">!</span>\ninterface Redes\n description Cisco IOS · OSPF · EIGRP · VLAN\n no shutdown\n<span class="d">!</span>\ninterface Sistemas\n description Windows Server · AD · Linux\n no shutdown\n<span class="d">!</span>\ninterface BasesDeDatos\n description MySQL · Oracle\n no shutdown\n<span class="d">!</span>\nend');}
};
C['sobre-mi']=function(){go('sobre-mi','sobre mí');};C.about=C['sobre-mi'];C.skills=C['show ip interface brief'];C.habilidades=C.skills;
C.trayectoria=C.traceroute;C.cv=C['cat cv.txt'];C['show run']=C['show running-config'];C['sh ip int br']=C['show ip interface brief'];C.ping=C['ping hugo'];
var PJ=[function(){openDlg('asti');},function(){window.open(REST_URL,'_blank','noopener');out('<span class="d">Si no se abre:</span> <a href="'+REST_URL+'" target="_blank" rel="noopener">abrir la web del restaurante</a>');},function(){openDlg('sql');},function(){out('<span class="d">→ abriendo proyectos…</span>');location.href='/proyectos/#p4';},function(){location.href='/proyectos/#p5';}];
function run(raw){var c=raw.trim().replace(/\s+/g,' ');echo(c);if(!c)return;var l=c.toLowerCase();
  if(c){hist.push(c);hi=hist.length;}
  var m=l.match(/^proyecto\s+(\d)$/);
  if(m){var n=+m[1];if(n>=1&&n<=5){out('<span class="d">→ abriendo proyecto '+n+'…</span>');PJ[n-1]();}else out('<span class="r">% Proyecto no encontrado.</span> Usa un número del 1 al 5.');return;}
  if(/^echo /.test(l)){out(esc(c.slice(5)));return;}
  if(C[l]){C[l]();return;}
  out('<span class="r">% Invalid input detected at \'^\' marker.</span>\n<span class="d">Comando desconocido: "'+esc(c)+'". Escribe</span> <span class="c">help</span>');
}
form.addEventListener('submit',function(e){e.preventDefault();run(inp.value);inp.value='';});
var ALL=Object.keys(C).concat(['proyecto 1','proyecto 2','proyecto 3','proyecto 4','proyecto 5']);
inp.addEventListener('keydown',function(e){
  if(e.key==='ArrowUp'){if(hi>0){hi--;inp.value=hist[hi];}e.preventDefault();}
  else if(e.key==='ArrowDown'){if(hi<hist.length-1){hi++;inp.value=hist[hi];}else{hi=hist.length;inp.value='';}e.preventDefault();}
  else if(e.key==='Tab'){var v=inp.value.toLowerCase();if(!v)return;var m=ALL.filter(function(x){return x.indexOf(v)===0;});
    if(m.length===1){inp.value=m[0];e.preventDefault();}else if(m.length>1){e.preventDefault();echo(inp.value);out('<span class="d">'+m.join('   ')+'</span>');}}
  else if(e.key==='l'&&e.ctrlKey){e.preventDefault();C.clear();}
});
scr.addEventListener('click',function(){if(!getSelection().toString())inp.focus({preventScroll:true});});
document.querySelectorAll('#quick button').forEach(function(b){b.addEventListener('click',function(){run(b.textContent);});});
out('<span class="d">HUGO-R1 · Cisco-style IOS · conectado desde '+(location.hostname||'local')+'</span>');
out('Bienvenido. Escribe <span class="c">help</span> para ver los comandos.');
try{var ab=new URLSearchParams(location.search).get('abrir');if(ab&&document.getElementById('dlg-'+ab))setTimeout(function(){openDlg(ab);},400);}catch(e){}
})();
