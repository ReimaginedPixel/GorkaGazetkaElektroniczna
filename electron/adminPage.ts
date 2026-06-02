// Statyczna strona panelu administratora (SPA, vanilla JS) serwowana przez Express.
// Trzymana jako string, aby uniknąć problemów ze ścieżkami w spakowanej aplikacji.
// Cały ruch idzie do /api/* (patrz server.ts). Strona działa z telefonu/laptopa po LAN.

export function adminHtml(): string {
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Gazetka Górka — panel admina</title>
<style>
  :root { --bg:#0A0A0A; --card:#1C1C1E; --soft:#141414; --line:#2A2A2C; --fg:#F5F5F7; --mut:#9A9AA0; --acc:#22C55E; --acc2:#A855F7; --red:#EF4444; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:Inter,-apple-system,system-ui,'Segoe UI',Roboto,sans-serif; background:var(--bg); color:var(--fg); -webkit-text-size-adjust:100%; }
  header { position:sticky; top:0; z-index:10; background:rgba(10,10,10,.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); padding:12px 16px; display:flex; align-items:center; gap:12px; }
  header h1 { font-size:16px; margin:0; font-weight:700; flex:1; }
  .wrap { max-width:860px; margin:0 auto; padding:16px; }
  .tabs { display:flex; gap:6px; flex-wrap:wrap; padding:10px 16px 0; max-width:860px; margin:0 auto; }
  .tab { padding:8px 12px; border-radius:10px; background:var(--soft); color:var(--mut); border:1px solid var(--line); cursor:pointer; font-size:14px; }
  .tab.active { background:var(--card); color:var(--fg); border-color:var(--acc); }
  .panel { display:none; }
  .panel.active { display:block; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px; margin-bottom:14px; }
  .card h2 { margin:0 0 12px; font-size:15px; font-weight:700; }
  label { display:block; font-size:13px; color:var(--mut); margin:10px 0 4px; }
  input[type=text], input[type=number], input[type=password], input[type=date], input[type=time], select, textarea {
    width:100%; padding:10px 12px; border-radius:10px; border:1px solid var(--line); background:var(--soft); color:var(--fg); font-size:15px; font-family:inherit;
  }
  textarea { min-height:140px; resize:vertical; font-family:ui-monospace,Menlo,Consolas,monospace; font-size:13px; }
  .row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
  .row > * { flex:1; }
  .row .x { flex:0 0 auto; }
  .btn { padding:10px 14px; border-radius:10px; border:1px solid var(--line); background:var(--soft); color:var(--fg); cursor:pointer; font-size:14px; font-weight:600; }
  .btn.primary { background:var(--acc); color:#03210f; border-color:transparent; }
  .btn.danger { background:transparent; color:var(--red); border-color:var(--red); }
  .btn.small { padding:6px 10px; font-size:13px; }
  .switch { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line); }
  .switch:last-child { border-bottom:0; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .muted { color:var(--mut); font-size:13px; }
  .toast { position:fixed; left:50%; bottom:18px; transform:translateX(-50%); background:var(--acc); color:#03210f; padding:10px 16px; border-radius:12px; font-weight:700; opacity:0; transition:opacity .25s; pointer-events:none; }
  .toast.show { opacity:1; }
  .toast.err { background:var(--red); color:#fff; }
  .login { max-width:380px; margin:12vh auto; }
  .pill { font-size:12px; color:var(--mut); background:var(--soft); border:1px solid var(--line); padding:4px 8px; border-radius:999px; }
  code { background:var(--soft); padding:2px 6px; border-radius:6px; }
</style>
</head>
<body>
<div id="app"></div>
<div id="toast" class="toast"></div>
<script>
(function(){
  "use strict";
  var cfg = null;
  var meta = {};
  var app = document.getElementById('app');

  function toast(msg, isErr){
    var t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast show' + (isErr?' err':'');
    setTimeout(function(){ t.className = 'toast'; }, 2200);
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function api(path, opts){
    opts = opts || {};
    opts.headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
    opts.credentials = 'same-origin';
    return fetch(path, opts).then(function(r){
      if(r.status===401){ renderLogin(); throw new Error('unauth'); }
      return r.json().then(function(j){ if(!r.ok) throw new Error(j && j.error || ('HTTP '+r.status)); return j; });
    });
  }
  function getPath(o, p){ return p.split('.').reduce(function(a,k){ return a==null?undefined:a[k]; }, o); }
  function setPath(o, p, v){ var ks=p.split('.'); var last=ks.pop(); var t=ks.reduce(function(a,k){ if(a[k]==null)a[k]={}; return a[k]; }, o); t[last]=v; }

  // ── Logowanie ──────────────────────────────────────────────────────────
  function renderLogin(){
    app.innerHTML =
      '<div class="login card">'
      + '<h2>Logowanie — panel admina</h2>'
      + '<label>Hasło administratora</label>'
      + '<input id="pw" type="password" autocomplete="current-password" />'
      + '<div style="height:12px"></div>'
      + '<button class="btn primary" id="loginBtn" style="width:100%">Zaloguj</button>'
      + '<p class="muted" style="margin-top:14px">Dostęp tylko w sieci szkolnej (LAN). Ruch po HTTP jest nieszyfrowany — używaj silnego hasła.</p>'
      + '</div>';
    document.getElementById('loginBtn').onclick = doLogin;
    document.getElementById('pw').addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); });
  }
  function doLogin(){
    var pw = document.getElementById('pw').value;
    api('/api/login', { method:'POST', body: JSON.stringify({ password: pw }) })
      .then(function(){ boot(); })
      .catch(function(e){ if(e.message!=='unauth') toast('Błędne hasło', true); });
  }

  // ── Generyczny edytor listy ──────────────────────────────────────────────
  function listEditor(listKey, columns, makeEmpty){
    var items = getPath(cfg, listKey) || [];
    var html = '<div data-list="'+listKey+'">';
    items.forEach(function(it, i){
      html += '<div class="row">';
      columns.forEach(function(col){
        var val = col.string ? it : it[col.prop];
        if(col.type==='checkbox'){
          html += '<label class="x" style="display:flex;align-items:center;gap:6px;flex:0 0 auto;color:var(--fg)"><input type="checkbox" data-li="'+i+'" data-prop="'+col.prop+'" '+(val?'checked':'')+'/> '+col.label+'</label>';
        } else {
          html += '<input type="'+(col.type||'text')+'" placeholder="'+esc(col.label)+'" data-li="'+i+'" '+(col.string?'data-str="1"':'data-prop="'+col.prop+'"')+' value="'+esc(val)+'"/>';
        }
      });
      html += '<button class="btn danger small x" data-del="'+i+'">✕</button>';
      html += '</div>';
    });
    html += '<button class="btn small" data-add="1">+ Dodaj</button></div>';
    var el = document.createElement('div');
    el.innerHTML = html;
    var container = el.firstChild;
    container.addEventListener('input', function(e){
      var t=e.target; var i=t.getAttribute('data-li'); if(i==null) return; i=+i;
      var list=getPath(cfg,listKey);
      if(t.getAttribute('data-str')){ list[i]=t.value; return; }
      var prop=t.getAttribute('data-prop');
      var v = t.type==='checkbox'? t.checked : (t.type==='number'? (t.value===''?'':+t.value) : t.value);
      list[i][prop]=v;
    });
    container.addEventListener('click', function(e){
      var t=e.target;
      if(t.getAttribute('data-add')){ var l=getPath(cfg,listKey); l.push(makeEmpty()); renderActive(); }
      else if(t.getAttribute('data-del')!=null){ var l2=getPath(cfg,listKey); l2.splice(+t.getAttribute('data-del'),1); renderActive(); }
    });
    return container;
  }

  function field(label, path, type){
    var v = getPath(cfg, path); if(v==null) v='';
    var div=document.createElement('div');
    div.innerHTML='<label>'+esc(label)+'</label><input type="'+(type||'text')+'" data-bind="'+path+'" '+(type==='number'?'data-num="1"':'')+' value="'+esc(v)+'"/>';
    return div;
  }
  function toggle(label, path){
    var v=!!getPath(cfg,path);
    var div=document.createElement('div'); div.className='switch';
    div.innerHTML='<span>'+esc(label)+'</span><input type="checkbox" data-bind="'+path+'" data-bool="1" '+(v?'checked':'')+'/>';
    return div;
  }

  // ── Budowa zakładek ──────────────────────────────────────────────────────
  var TABS = ['Ogólne','Dzwonki','Treści','Kafle','Bezpieczeństwo','JSON'];
  var activeTab = 'Ogólne';

  function card(title){ var c=document.createElement('div'); c.className='card'; if(title){ var h=document.createElement('h2'); h.textContent=title; c.appendChild(h);} return c; }

  function buildOgolne(){
    var p=document.createElement('div');
    var c1=card('Szczęśliwy numerek');
    c1.appendChild(field('Numer (wpisywany ręcznie; puste = ukryty)','luckyNumber','number'));
    c1.querySelector('input').removeAttribute('data-num'); // numerek może być pusty -> string/null
    p.appendChild(c1);

    var c2=card('Lokalizacja pogody (Open-Meteo)');
    var g=document.createElement('div'); g.className='grid2';
    g.appendChild(field('Etykieta','location.label'));
    g.appendChild(field('Strefa czasowa','location.timezone'));
    g.appendChild(field('Szerokość (lat)','location.latitude','number'));
    g.appendChild(field('Długość (lon)','location.longitude','number'));
    c2.appendChild(g); p.appendChild(c2);

    var c3=card('Ważne daty (liczniki)');
    c3.appendChild(field('Koniec roku szkolnego','importantDates.schoolYearEnd','date'));
    c3.appendChild(field('Początek wakacji','importantDates.summerBreakStart','date'));
    c3.appendChild(field('Początek ferii zimowych','importantDates.winterBreakStart','date'));
    c3.appendChild(field('Początek matur','importantDates.maturaStart','date'));
    p.appendChild(c3);

    var c4=card('Motyw (dark/light)');
    c4.appendChild(toggle('Automatyczny wg pory dnia','theme.auto'));
    var g2=document.createElement('div'); g2.className='grid2';
    g2.appendChild(field('Ciemny od godziny','theme.darkAfterHour','number'));
    g2.appendChild(field('Jasny od godziny','theme.lightAfterHour','number'));
    c4.appendChild(g2);
    var lab=document.createElement('label'); lab.textContent='Tryb ręczny (gdy auto wyłączony)'; c4.appendChild(lab);
    var sel=document.createElement('select'); sel.setAttribute('data-bind','theme.mode'); sel.innerHTML='<option value="dark">Ciemny</option><option value="light">Jasny</option>'; sel.value=getPath(cfg,'theme.mode'); c4.appendChild(sel);
    p.appendChild(c4);
    return p;
  }

  function buildDzwonki(){
    var p=document.createElement('div');
    var c0=card('Ustawienia przerw');
    c0.appendChild(field('Próg długiej przerwy (min)','longBreakMinutes','number'));
    c0.appendChild(field('Story — czas kafla (s)','story.intervalSeconds','number'));
    p.appendChild(c0);

    var c=card('Plan dzwonków (per dzień)');
    var days=[['1','Poniedziałek'],['2','Wtorek'],['3','Środa'],['4','Czwartek'],['5','Piątek'],['6','Sobota'],['7','Niedziela']];
    var lab=document.createElement('label'); lab.textContent='Dzień tygodnia'; c.appendChild(lab);
    var sel=document.createElement('select');
    days.forEach(function(d){ var o=document.createElement('option'); o.value=d[0]; o.textContent=d[1]; sel.appendChild(o); });
    sel.value = c._day || '1'; c.appendChild(sel);
    var holder=document.createElement('div'); holder.style.marginTop='10px'; c.appendChild(holder);
    function renderDay(){
      if(!cfg.schedule[sel.value]) cfg.schedule[sel.value]=[];
      holder.innerHTML='';
      holder.appendChild(listEditor('schedule.'+sel.value,
        [{prop:'nr',label:'Nr',type:'number'},{prop:'start',label:'Start HH:MM'},{prop:'koniec',label:'Koniec HH:MM'}],
        function(){ return { nr:0, start:'08:00', koniec:'08:45' }; }));
    }
    sel.addEventListener('change', renderDay); renderDay();
    var hint=document.createElement('p'); hint.className='muted'; hint.innerHTML='Przerwy są liczone automatycznie z luk między lekcjami. Luka ≥ progu = długa przerwa. Nazwy przedmiotów ustawisz w zakładce <b>JSON</b> (pole <code>lessonNames</code>).';
    c.appendChild(hint);
    p.appendChild(c);
    return p;
  }

  function buildTresci(){
    var p=document.createElement('div');
    var ca=card('Ogłoszenia (zaznacz „pilne” = czerwony alarm na cały ekran)');
    ca.appendChild(listEditor('announcements',
      [{prop:'text',label:'Treść ogłoszenia'},{prop:'urgent',label:'Pilne',type:'checkbox'}],
      function(){ return { id:'a'+Date.now(), text:'', urgent:false }; }));
    p.appendChild(ca);

    var cp=card('Zdjęcia z życia szkoły');
    var up=document.createElement('div'); up.className='row';
    up.innerHTML='<input type="file" id="photoFile" accept="image/*" />'+'<button class="btn small x" id="photoUp">Wyślij</button>';
    cp.appendChild(up);
    cp.appendChild(listEditor('photos',[{string:true,label:'URL lub ścieżka/uploads/...'}], function(){ return ''; }));
    p.appendChild(cp);

    var cb=card('Urodziny z klasy');
    cb.appendChild(listEditor('birthdays',[{prop:'name',label:'Imię'},{prop:'date',label:'MM-DD'}], function(){ return { name:'', date:'01-01' }; }));
    p.appendChild(cb);

    var ce=card('Wydarzenia szkolne');
    ce.appendChild(listEditor('events',[{prop:'name',label:'Nazwa'},{prop:'date',label:'Data',type:'date'},{prop:'time',label:'Godz HH:MM'}], function(){ return { name:'', date:'', time:'' }; }));
    p.appendChild(ce);

    var cq=card('Kody QR (strona szkoły / GorkaGuesser / GorkaRadio)');
    cq.appendChild(listEditor('qrCodes',[{prop:'label',label:'Etykieta'},{prop:'url',label:'URL'},{prop:'enabled',label:'Wł.',type:'checkbox'}], function(){ return { label:'', url:'https://', enabled:true }; }));
    p.appendChild(cq);

    var ch=card('Święta / dni wolne (konkretne daty)');
    ch.appendChild(listEditor('holidays',[{prop:'date',label:'Data',type:'date'},{prop:'name',label:'Nazwa'}], function(){ return { date:'', name:'' }; }));
    p.appendChild(ch);
    return p;
  }

  function buildKafle(){
    var p=document.createElement('div');
    var c=card('Widoczność kafli feedu');
    [['photos','Zdjęcia'],['wordOfDay','Słowo dnia'],['fact','Ciekawostka'],['qr','Kody QR'],['birthdays','Urodziny'],['events','Wydarzenia'],['counters','Liczniki (ferie/wakacje/matura)'],['anagram','Anagram / słowo dnia (gra)']].forEach(function(t){ c.appendChild(toggle(t[1],'tiles.'+t[0])); });
    p.appendChild(c);
    var c2=card('Stały pasek');
    [['showWeather','Pogoda'],['showLuckyNumber','Szczęśliwy numerek'],['showDaysToYearEnd','Dni do końca roku'],['showMarquee','Pasek ogłoszeń (marquee)']].forEach(function(t){ c2.appendChild(toggle(t[1],'statusBar.'+t[0])); });
    p.appendChild(c2);
    return p;
  }

  function buildBezpieczenstwo(){
    var p=document.createElement('div');
    var c=card('Zmiana hasła administratora');
    c.innerHTML += '<p class="muted">Nowy hash bcrypt zostanie zapisany do pliku <code>.env</code> (ADMIN_PASSWORD_HASH). Hasło nigdy nie jest przechowywane jawnie.</p>';
    var l=document.createElement('label'); l.textContent='Nowe hasło (min. 8 znaków)'; c.appendChild(l);
    var inp=document.createElement('input'); inp.type='password'; inp.id='newpw'; c.appendChild(inp);
    var b=document.createElement('button'); b.className='btn primary small'; b.style.marginTop='10px'; b.textContent='Zmień hasło';
    b.onclick=function(){ var v=document.getElementById('newpw').value; if(v.length<8){ toast('Hasło min. 8 znaków', true); return; } api('/api/password',{method:'POST',body:JSON.stringify({newPassword:v})}).then(function(){ inp.value=''; toast('Hasło zmienione'); }).catch(function(e){ toast(e.message,true); }); };
    c.appendChild(b);
    p.appendChild(c);

    var c2=card('Dostęp do panelu');
    var urls=(meta.adminUrls||[]).map(function(u){ return '<div class="pill" style="display:inline-block;margin:4px 4px 0 0">'+esc(u)+'</div>'; }).join('');
    c2.innerHTML += '<p class="muted">Adresy panelu w sieci LAN:</p>'+urls+'<p class="muted" style="margin-top:12px">⚠️ HTTP w LAN jest nieszyfrowany. Nie wystawiaj panelu na publiczny internet.</p>';
    var lo=document.createElement('button'); lo.className='btn danger small'; lo.style.marginTop='10px'; lo.textContent='Wyloguj';
    lo.onclick=function(){ api('/api/logout',{method:'POST'}).then(renderLogin); };
    c2.appendChild(lo);
    p.appendChild(c2);
    return p;
  }

  function buildJson(){
    var p=document.createElement('div');
    var c=card('Zaawansowane — cały config (JSON)');
    c.innerHTML += '<p class="muted">Pełny dostęp do wszystkich pól (m.in. <code>lessonNames</code>, <code>wordOfDay</code>, <code>facts</code>, <code>anagrams</code>, <code>freePeriods</code>). „Zastosuj” wczytuje JSON do formularzy; „Zapisz wszystko” trwale zapisuje.</p>';
    var ta=document.createElement('textarea'); ta.id='jsonEditor'; ta.value=JSON.stringify(cfg,null,2); c.appendChild(ta);
    var b=document.createElement('button'); b.className='btn small'; b.style.marginTop='10px'; b.textContent='Zastosuj JSON';
    b.onclick=function(){ try{ var parsed=JSON.parse(document.getElementById('jsonEditor').value); cfg=parsed; renderActive(); toast('Wczytano JSON'); }catch(e){ toast('Błąd JSON: '+e.message, true); } };
    c.appendChild(b);
    p.appendChild(c);
    return p;
  }

  function renderActive(){
    var host=document.getElementById('tabHost'); if(!host) return;
    host.innerHTML='';
    var builder={ 'Ogólne':buildOgolne,'Dzwonki':buildDzwonki,'Treści':buildTresci,'Kafle':buildKafle,'Bezpieczeństwo':buildBezpieczenstwo,'JSON':buildJson }[activeTab];
    host.appendChild(builder());
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(t){ t.classList.toggle('active', t.dataset.tab===activeTab); });
    if(activeTab==='Treści'){ var pf=document.getElementById('photoUp'); if(pf) pf.onclick=uploadPhoto; }
  }

  function uploadPhoto(){
    var f=document.getElementById('photoFile'); if(!f.files || !f.files[0]){ toast('Wybierz plik', true); return; }
    var fd=new FormData(); fd.append('photo', f.files[0]);
    fetch('/api/upload',{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){ return r.json(); }).then(function(j){
      if(j.url){ cfg.photos.push(j.url); renderActive(); toast('Dodano zdjęcie'); } else { toast(j.error||'Błąd uploadu', true); }
    }).catch(function(){ toast('Błąd uploadu', true); });
  }

  // Globalne bindowanie pól prostych (data-bind) przez delegację.
  function wireGlobalBind(){
    document.addEventListener('input', function(e){
      var t=e.target; var path=t.getAttribute && t.getAttribute('data-bind'); if(!path) return;
      var v;
      if(t.getAttribute('data-bool')) v=t.checked;
      else if(t.getAttribute('data-num')) v = t.value===''? 0 : +t.value;
      else if(path==='luckyNumber') v = t.value===''? null : (isNaN(+t.value)? t.value : +t.value);
      else v=t.value;
      setPath(cfg, path, v);
    });
    document.addEventListener('change', function(e){ var t=e.target; if(t.tagName==='SELECT' && t.getAttribute('data-bind')) setPath(cfg, t.getAttribute('data-bind'), t.value); });
  }

  function save(){
    api('/api/config',{method:'POST',body:JSON.stringify(cfg)}).then(function(j){ cfg=j.config; toast('Zapisano — ekran zaktualizowany'); }).catch(function(e){ if(e.message!=='unauth') toast('Błąd zapisu: '+e.message, true); });
  }

  function renderShell(){
    app.innerHTML =
      '<header><h1>Gazetka Górka — panel</h1><button class="btn primary" id="saveBtn">Zapisz wszystko</button></header>'
      + '<div class="tabs" id="tabs"></div>'
      + '<div class="wrap"><div id="tabHost"></div></div>';
    var tabsEl=document.getElementById('tabs');
    TABS.forEach(function(name){ var b=document.createElement('button'); b.className='tab'; b.dataset.tab=name; b.textContent=name; b.onclick=function(){ activeTab=name; renderActive(); }; tabsEl.appendChild(b); });
    document.getElementById('saveBtn').onclick=save;
    renderActive();
  }

  function boot(){
    Promise.all([ api('/api/me'), api('/api/config') ]).then(function(res){
      meta=res[0]; cfg=res[1].config; renderShell();
    }).catch(function(e){ if(e.message!=='unauth') renderLogin(); });
  }

  wireGlobalBind();
  // Sprawdź sesję na starcie.
  api('/api/me').then(function(m){ if(m && m.authenticated){ boot(); } else { renderLogin(); } }).catch(function(){ renderLogin(); });
})();
</script>
</body>
</html>`;
}
