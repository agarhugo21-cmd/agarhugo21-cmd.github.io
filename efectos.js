
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.pj,.ay-card,.cc,.pager a');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');},{passive:true});
  }
  if(reduce)return;
  var G='01<>/\\{}[]#=+*_-';
  function scramble(h){
    if(h.dataset.sc)return;h.dataset.sc='1';
    if(!h.hasAttribute('aria-label')){var c=h.cloneNode(true);[].forEach.call(c.querySelectorAll('br'),function(b){b.parentNode.replaceChild(document.createTextNode(' '),b);});[].forEach.call(c.querySelectorAll('.l2'),function(x){x.insertBefore(document.createTextNode(' '),x.firstChild);});h.setAttribute('aria-label',c.textContent.replace(/\s+/g,' ').trim());}
    var nodes=[];
    (function walk(n){[].forEach.call(n.childNodes,function(c){if(c.nodeType===3&&c.nodeValue.trim())nodes.push({n:c,t:c.nodeValue,d:[].map.call(c.nodeValue,function(){return 4+Math.random()*26|0;})});else if(c.nodeType===1)walk(c);});})(h);
    var f=0;(function step(){f++;var done=true;nodes.forEach(function(o){var s='';for(var i=0;i<o.t.length;i++){var ch=o.t[i];if(ch===' '||ch==='\n'||f>=o.d[i])s+=ch;else{s+=G[Math.random()*G.length|0];done=false;}}o.n.nodeValue=s;});if(!done)setTimeout(step,30);})();
    setTimeout(function(){nodes.forEach(function(o){o.n.nodeValue=o.t;});},2000);
  }
  var hs=[].slice.call(document.querySelectorAll('main h1, #consola h2, #contacto h2'));
  if(!('IntersectionObserver' in window)){hs.forEach(scramble);return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);scramble(e.target);}});},{threshold:.25});
  hs.forEach(function(h){io.observe(h);});
})();
