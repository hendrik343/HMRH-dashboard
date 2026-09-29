/* ============================================================================
   PLANEAMENTO HSE — HMRH Huambo (13DC)
   Rev01 · emitida 29/09/2026 · base: planeamento quinzenal BELO de 07/09/2026 (Dalux)

   Ficheiro autónomo. Não depende de nada da página.
   Monta-se em <div id="planeamento-hse"></div>.

   PRINCÍPIO: nenhum estado está fixado no código. "Em atraso" é calculado
   a partir da data corrente. O documento de origem é de 31/07 e os rótulos
   dele ficam errados em dias.
   ============================================================================ */
(function () {
  'use strict';

  /* ---------- DADOS ------------------------------------------------------ */

  var REVISAO = {
    revisao: 'Rev01',
    emitido: '2026-09-29',
    inicio: '2026-09-07',
    fim: '2026-09-19',
    obra: '13DC – DEI/SV/2021',
    fonte: 'HMRH_BELO_PLANEJAMENTO QUINZENAL_07.09.2026 (Dalux Box · 02.01 Cronogramas / 02 Revisões)',
    natureza: 'Instrumento de planeamento. Identifica que avaliações de risco e ' +
      'toolbox talks os trabalhos planeados exigem e em que data têm de estar ' +
      'emitidas. Não é uma avaliação de risco e não substitui nenhuma. ' +
      'Base: planeamento quinzenal da BELO de 07/09/2026 (período 07/09 a 19/09). ' +
      'À data de emissão não existe no Dalux planeamento quinzenal da BELO posterior a 19/09/2026.'
  };

  /* Rev00 (31/07/2026, Cronograma Mestre, 28/07 → 16/09) substituída por esta Rev01. */
  var MARCOS = [
    { id: 'M1', titulo: 'Fachadas ETICS — aplicação de primário', dias: 10, inicio: '2026-09-10', fim: '2026-09-19', critico: false, frente: 'H1' },
    { id: 'M2', titulo: 'Impermeabilização — cobertura Piso 02', dias: 12, inicio: '2026-09-07', fim: '2026-09-18', critico: false, frente: 'H2' },
    { id: 'M3', titulo: 'Junta estrutural vertical — Bloco A/C', dias: 5, inicio: '2026-09-07', fim: '2026-09-11', critico: false, frente: 'H3' },
    { id: 'M4', titulo: 'Estrutura Bloco X0B — viga Piso 01', dias: 6, inicio: '2026-09-07', fim: '2026-09-12', critico: false, frente: 'H4' },
    { id: 'M5', titulo: 'Betão C25/30 — Bloco F', dias: 2, inicio: '2026-09-11', fim: '2026-09-12', critico: false, frente: 'H5' },
    { id: 'M6', titulo: 'Emboço — platibanda T2', dias: 4, inicio: '2026-09-07', fim: '2026-09-10', critico: false, frente: 'H6' }
  ];

  var FRENTES = [
    {
      id: 'H0', marco: null, titulo: 'Transversal',
      abrangencia: 'Aplicável a toda a obra, todos os dias, todos os subempreiteiros',
      inicio: '2026-09-07', fim: '2026-09-19', limiteAR: '2026-09-06', repeticoes: 2,
      ar: ['Project Design and Construction', 'Construction', 'Temporary Services',
           'Installation Of Temporary Electrical Supplies', 'Fire',
           'Storage Of Materials On-Site', 'Driving Company Vehicles', 'Lone Working'],
      tbt: [['01', 'Incidentes ambientais'], ['02', 'Gestão de resíduos'],
            ['25', 'Arrumação e limpeza (housekeeping)'], ['26', 'Trabalho em período quente'],
            ['28', 'Álcool'], ['29', 'Vestuário de trabalho'],
            ['30', 'Equipamento de protecção individual'], ['31', 'Condução'],
            ['33', 'Atitude e comportamento'], ['34', 'Responsabilidades do trabalhador'],
            ['44', 'Instalações sociais'], ['49', 'Marcha-atrás de viaturas']]
    },
    {
      id: 'H1', marco: 'M1', titulo: 'Fachadas ETICS — aplicação de primário',
      abrangencia: 'Primário na fachada posterior e caixa de escada Piso 00 (Bloco D), fachada posterior (Bloco E) e zona exterior interna da fachada (Bloco G)',
      inicio: '2026-09-10', fim: '2026-09-19', limiteAR: '2026-09-09', repeticoes: 2,
      ar: ['Scaffolding Works', 'Working At Height - Low-Level Mobile Tower Scaffolds', 'Working At Height - Mewps',
           'Block Works and Plastering Works', 'Manual Handling', 'Slips, Trips / Hazardous Substances'],
      tbt: [['06', 'Plataformas elevatórias móveis (PEMP)'], ['13', 'Andaimes gerais'], ['14', 'Andaimes de torre'],
            ['22', 'Trabalhos em altura'], ['23', 'Utilização de arneses'], ['30', 'Equipamento de protecção individual'],
            ['46', 'Substâncias perigosas (COSHH)']]
    },
    {
      id: 'H2', marco: 'M2', titulo: 'Impermeabilização — cobertura Piso 02',
      abrangencia: 'Tela TPO na platibanda (zona da junta) e na cobertura das claraboias — Blocos A e B, C e D, F e G',
      inicio: '2026-09-07', fim: '2026-09-18', limiteAR: '2026-09-06', repeticoes: 2,
      ar: ['Working At Height - Roofs Fragile Surfaces', 'Working At Height', 'Fire',
           'Storage And Use Of Flammable Liquids', 'Lifting Activities', 'Manual Handling'],
      tbt: [['16', 'Combate a incêndios'], ['18', 'Prevenção de incêndios'], ['19', 'Aberturas em lajes e claraboias'],
            ['21', 'Utilização segura de escadas'], ['22', 'Trabalhos em altura'], ['23', 'Utilização de arneses'],
            ['24', 'Movimentação manual de cargas'], ['26', 'Trabalho em período quente']]
    },
    {
      id: 'H3', marco: 'M3', titulo: 'Junta estrutural vertical — Bloco A/C',
      abrangencia: 'Execução de juntas na fachada frontal, do Piso 00 ao Piso 01',
      inicio: '2026-09-07', fim: '2026-09-11', limiteAR: '2026-09-06', repeticoes: 1,
      ar: ['Working At Height', 'Scaffolding Works', 'Working At Height - Mewps',
           'Safe Use Of Grinders / Cutters', 'Slips, Trips / Hazardous Substances'],
      tbt: [['06', 'Plataformas elevatórias móveis (PEMP)'], ['09', 'Rebarbadoras e discos abrasivos'], ['13', 'Andaimes gerais'],
            ['22', 'Trabalhos em altura'], ['30', 'Equipamento de protecção individual'], ['46', 'Substâncias perigosas (COSHH)']]
    },
    {
      id: 'H4', marco: 'M4', titulo: 'Estrutura Bloco X0B — viga Piso 01',
      abrangencia: 'Preparação e armadura da viga estrutural do Piso 01 (07–11/09) e betonagem (11–12/09)',
      inicio: '2026-09-07', fim: '2026-09-12', limiteAR: '2026-09-06', repeticoes: 1,
      ar: ['Shuttering Works', 'Concrete Works', 'Working At Height', 'Lifting Activities',
           'Manual Handling', 'Safe Use Of Grinders / Cutters'],
      tbt: [['05', 'Lingas, correntes, ganchos e manilhas'], ['09', 'Rebarbadoras e discos abrasivos'], ['22', 'Trabalhos em altura'],
            ['24', 'Movimentação manual de cargas'], ['41', 'Queimaduras por betão'], ['42', 'Montagem de bombas móveis de betão'],
            ['47', 'Amarradores e sinaleiros']]
    },
    {
      id: 'H5', marco: 'M5', titulo: 'Betão C25/30 — Bloco F',
      abrangencia: 'Laje sobre Cupolex, tramo/zona 2 interior, Piso 00',
      inicio: '2026-09-11', fim: '2026-09-12', limiteAR: '2026-09-10', repeticoes: 1,
      ar: ['Concrete Works', 'Manual Handling', 'Noise / Operating Plant Equipment',
           'Storage And Manoeuvring Of Materials And Equipment'],
      tbt: [['24', 'Movimentação manual de cargas'], ['25', 'Arrumação e limpeza'], ['41', 'Queimaduras por betão'],
            ['42', 'Montagem de bombas móveis de betão'], ['43', 'Trabalhar junto a equipamento móvel e gruas']]
    },
    {
      id: 'H6', marco: 'M6', titulo: 'Emboço — platibanda T2',
      abrangencia: 'Aplicação de emboço na platibanda da fachada posterior do Bloco T2',
      inicio: '2026-09-07', fim: '2026-09-10', limiteAR: '2026-09-06', repeticoes: 1,
      ar: ['Block Works and Plastering Works', 'Working At Height', 'Scaffolding Works', 'Manual Handling'],
      tbt: [['13', 'Andaimes gerais'], ['22', 'Trabalhos em altura — platibandas e bordadura'], ['23', 'Utilização de arneses'],
            ['24', 'Movimentação manual de cargas'], ['30', 'Equipamento de protecção individual']]
    }
  ];

  /* Rev01: totais calculados a partir das frentes (o quinzenal da BELO não declara totais). */
  var DECLARADO = { ar: 39, titulos: 23, tbt: 50, temas: 29, sessoes: 77, frentes: 7 };

  /* ---------- LÓGICA DE ESTADO ------------------------------------------- */

  var DIA = 86400000;

  function d(iso) {
    var p = iso.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12));
  }
  function dias(de, ate) { return Math.round((d(ate) - d(de)) / DIA); }
  function hojeISO() {
    var n = new Date();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') +
           '-' + String(n.getDate()).padStart(2, '0');
  }
  function fmtData(iso) { var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

  var ESTADOS = {
    incumprida: { ordem: 0, rotulo: 'Em incumprimento', tom: 'breach' },
    emAtraso:   { ordem: 1, rotulo: 'Em atraso',        tom: 'breach' },
    iminente:   { ordem: 2, rotulo: 'Limite iminente',  tom: 'window' },
    aPreparar:  { ordem: 3, rotulo: 'A preparar',       tom: 'clear'  },
    encerrada:  { ordem: 4, rotulo: 'Frente encerrada', tom: 'muted'  }
  };

  function avaliar(f, hoje) {
    var paraLimite = dias(hoje, f.limiteAR);
    var aberta = dias(hoje, f.inicio) <= 0;
    var fechada = dias(hoje, f.fim) < 0;
    var e;
    if (fechada) e = 'encerrada';
    else if (paraLimite < 0 && aberta) e = 'incumprida';
    else if (paraLimite < 0) e = 'emAtraso';
    else if (paraLimite <= 5) e = 'iminente';
    else e = 'aPreparar';

    var o = {};
    for (var k in f) o[k] = f[k];
    o.estado = e;
    o.ordem = ESTADOS[e].ordem;
    o.rotulo = ESTADOS[e].rotulo;
    o.tom = ESTADOS[e].tom;
    o.paraLimite = paraLimite;
    o.emAtraso = paraLimite < 0 ? Math.abs(paraLimite) : 0;
    o.fechada = fechada;
    o.nAR = f.ar.length;
    o.nTBT = f.tbt.length;
    o.sessoes = f.tbt.length * f.repeticoes;
    return o;
  }

  function resumo(hoje) {
    var lista = FRENTES.map(function (f) { return avaliar(f, hoje); })
      .sort(function (a, b) { return a.ordem - b.ordem || a.paraLimite - b.paraLimite; });

    var vencidas = lista.filter(function (f) {
      return f.estado === 'incumprida' || f.estado === 'emAtraso';
    });
    var soma = function (l, c) { return l.reduce(function (s, f) { return s + f[c]; }, 0); };
    var uniq = function (l, g) {
      var s = {}, n = 0;
      l.forEach(function (f) { g(f).forEach(function (v) { if (!s[v]) { s[v] = 1; n++; } }); });
      return n;
    };
    var proximo = lista.filter(function (f) { return !f.fechada && f.paraLimite >= 0; })
      .sort(function (a, b) { return a.paraLimite - b.paraLimite; })[0] || null;

    var t = {
      frentes: lista.length,
      ar: soma(lista, 'nAR'),
      titulos: uniq(lista, function (f) { return f.ar; }),
      tbt: soma(lista, 'nTBT'),
      temas: uniq(lista, function (f) { return f.tbt.map(function (x) { return x[0]; }); }),
      sessoes: soma(lista, 'sessoes'),
      arVencidas: soma(vencidas, 'nAR'),
      nVencidas: vencidas.length,
      proximo: proximo
    };

    /* Validação contra os totais que o próprio documento declara. */
    [['avaliações de risco', t.ar, DECLARADO.ar], ['títulos distintos', t.titulos, DECLARADO.titulos],
     ['toolbox talks', t.tbt, DECLARADO.tbt], ['temas distintos', t.temas, DECLARADO.temas],
     ['sessões', t.sessoes, DECLARADO.sessoes], ['frentes', t.frentes, DECLARADO.frentes]
    ].forEach(function (v) {
      if (v[1] !== v[2] && window.console) {
        console.warn('[planeamento-hse] ' + v[0] + ': calculado ' + v[1] +
                     ', documento declara ' + v[2] + '. Verificar transcrição.');
      }
    });

    return { lista: lista, t: t };
  }

  /* ---------- RENDER ------------------------------------------------------ */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render(alvo) {
    var hoje = hojeISO();
    var r = resumo(hoje), t = r.t;
    var total = dias(REVISAO.inicio, REVISAO.fim);
    var pct = function (iso) {
      return Math.max(0, Math.min(100, (dias(REVISAO.inicio, iso) / total) * 100));
    };
    var hojePct = (dias(REVISAO.inicio, hoje) >= 0 && dias(hoje, REVISAO.fim) >= 0)
      ? pct(hoje) : null;

    var h = '';

    h += '<div class="ph">';
    h += '<header class="ph-cab"><div>' +
         '<p class="ph-sup">Obra ' + esc(REVISAO.obra) + '</p>' +
         '<h2 class="ph-tit">Planeamento HSE</h2></div>' +
         '<dl class="ph-prov">' +
         '<div><dt>Revisão</dt><dd>' + esc(REVISAO.revisao) + '</dd></div>' +
         '<div><dt>Emitido</dt><dd>' + fmtData(REVISAO.emitido) + '</dd></div>' +
         '<div><dt>Período</dt><dd>' + fmtData(REVISAO.inicio) + ' → ' + fmtData(REVISAO.fim) + '</dd></div>' +
         '</dl></header>';

    /* Saldo de conformidade — a figura grande é a dívida, calculada ao vivo. */
    var limpo = t.arVencidas === 0;
    h += '<div class="ph-saldo ' + (limpo ? 'is-limpo' : 'is-divida') + '" role="status">';
    h += '<div class="ph-fig"><span class="ph-num">' + t.arVencidas + '</span>' +
         '<span class="ph-num-rot">' + (limpo
           ? 'avaliações de risco em atraso'
           : 'avaliações de risco por emitir, em ' + t.nVencidas + ' frente' +
             (t.nVencidas === 1 ? '' : 's') + ' já vencida' + (t.nVencidas === 1 ? '' : 's')) +
         '</span></div>';
    h += '<dl class="ph-lado">' +
         '<div><dt>Total exigido</dt><dd>' + t.ar + ' AR<span class="ph-sub"> · ' + t.titulos + ' títulos</span></dd></div>' +
         '<div><dt>Toolbox talks</dt><dd>' + t.tbt + '<span class="ph-sub"> · ' + t.temas + ' temas</span></dd></div>' +
         '<div><dt>Sessões até ' + fmtData(REVISAO.fim).slice(0, 5) + '</dt><dd>' + t.sessoes + '</dd></div>';
    if (t.proximo) {
      h += '<div class="ph-dest"><dt>Próximo limite</dt><dd>' + esc(t.proximo.id) +
           '<span class="ph-sub"> · ' + (t.proximo.paraLimite === 0 ? 'hoje'
             : t.proximo.paraLimite + ' dia' + (t.proximo.paraLimite === 1 ? '' : 's')) +
           '</span></dd></div>';
    }
    h += '</dl></div>';

    h += '<p class="ph-nat">' + esc(REVISAO.natureza) + '</p>';

    /* Registo de frentes, por urgência. */
    h += '<h3 class="ph-sec">Frentes de trabalho<span class="ph-sec-n">por urgência</span></h3>';
    h += '<ol class="ph-reg">';
    r.lista.forEach(function (f) {
      h += '<li class="ph-f tom-' + f.tom + '"><details><summary class="ph-f-cab">' +
           '<span class="ph-f-id">' + esc(f.id) + '</span>' +
           '<span class="ph-f-nome"><span class="ph-f-tit">' + esc(f.titulo) + '</span>' +
           '<span class="ph-f-dt">' + fmtData(f.inicio) + ' → ' + fmtData(f.fim) +
           (f.marco ? ' · marco ' + esc(f.marco) : '') + '</span></span>' +
           '<span class="ph-f-c"><span><b>' + f.nAR + '</b> AR</span>' +
           '<span><b>' + f.nTBT + '</b> TBT</span>' +
           '<span><b>' + f.sessoes + '</b> sessões</span></span>' +
           '<span class="ph-f-e"><span class="ph-et">' + f.rotulo + '</span>' +
           '<span class="ph-pz">' + (f.emAtraso > 0 ? f.emAtraso + ' d após limite'
             : f.paraLimite === 0 ? 'limite hoje' : 'limite ' + fmtData(f.limiteAR)) +
           '</span></span></summary>';
      h += '<div class="ph-pan"><p class="ph-abr">' + esc(f.abrangencia) + '</p><div class="ph-cols">';
      h += '<div><h4>Avaliações de risco a emitir</h4><ul class="ph-l">';
      f.ar.forEach(function (a) { h += '<li>' + esc(a) + '</li>'; });
      h += '</ul></div><div><h4>Toolbox talks a ministrar<span class="ph-sub"> · ' +
           f.repeticoes + '× cada</span></h4><ul class="ph-l ph-l-t">';
      f.tbt.forEach(function (x) {
        h += '<li><span class="ph-tn">' + esc(x[0]) + '</span>' + esc(x[1]) + '</li>';
      });
      h += '</ul></div></div></div></details></li>';
    });
    h += '</ol>';

    /* Cronograma. */
    h += '<h3 class="ph-sec">Cronograma de obra<span class="ph-sec-n">M1–M8 · planeamento do empreiteiro</span></h3>';
    h += '<div class="ph-g"><div class="ph-g-esc">';
    for (var i = 0; i <= total; i += 7) {
      var iso = new Date(d(REVISAO.inicio).getTime() + i * DIA).toISOString().slice(0, 10);
      h += '<span class="ph-sem" style="left:' + pct(iso) + '%">' + fmtData(iso).slice(0, 5) + '</span>';
    }
    h += '</div><ul class="ph-g-l">';
    MARCOS.forEach(function (m) {
      var fr = FRENTES.filter(function (x) { return x.id === m.frente; })[0];
      h += '<li class="ph-ln' + (m.critico ? ' is-crit' : '') + '">' +
           '<span class="ph-ln-r"><b>' + m.id + '</b> ' + esc(m.titulo) +
           (m.critico ? '<em class="ph-crit">cadeia crítica</em>' : '') + '</span>' +
           '<span class="ph-pista">';
      if (fr) {
        h += '<span class="ph-lim" style="left:' + pct(fr.limiteAR) +
             '%" title="Limite da AR — frente ' + fr.id + '"></span>';
      }
      h += '<span class="ph-bar" style="left:' + pct(m.inicio) + '%;width:' +
           Math.max(1.5, pct(m.fim) - pct(m.inicio)) + '%">' +
           '<span class="ph-bd">' + m.dias + 'd</span></span></span></li>';
    });
    if (hojePct !== null) {
      h += '<span class="ph-hoje" style="left:calc(var(--ph-r) + (100% - var(--ph-r)) * ' +
           (hojePct / 100) + ')"><span class="ph-hoje-r">' + fmtData(hoje).slice(0, 5) + '</span></span>';
    }
    h += '</ul><p class="ph-leg">' +
         '<span class="ph-k ph-k-l"></span> limite da avaliação de risco' +
         '<span class="ph-k ph-k-b"></span> duração da frente' +
         '<span class="ph-k ph-k-h"></span> hoje</p></div>';

    h += '</div>';
    alvo.innerHTML = h;
  }

  /* Em produção o Vercel serve com cleanUrls:true ("./planeamento").
     Aberto como ficheiro local (file://) não há servidor a resolver o caminho
     sem extensão — nesse caso apontamos directamente para o .html. */
  var LINK_PLAN = (typeof location !== 'undefined' && location.protocol === 'file:')
    ? './planeamento.html' : './planeamento';

  function renderAtalho(alvo) {
    var r = resumo(hojeISO()), t = r.t;
    var limpo = t.arVencidas === 0;
    var h = '';
    h += '<a class="ph-atalho ' + (limpo ? 'is-limpo' : 'is-divida') + '" href="' + LINK_PLAN + '">';
    h += '<span class="ph-atalho-lbl">Planeamento HSE</span>';
    h += '<span class="ph-atalho-num">' + t.arVencidas + '</span>';
    h += '<span class="ph-atalho-sub">' + (limpo
      ? 'avaliações de risco em atraso'
      : 'AR por emitir · ' + t.nVencidas + ' frente' + (t.nVencidas === 1 ? '' : 's') + ' vencida' + (t.nVencidas === 1 ? '' : 's')) +
      '</span>';
    if (t.proximo) {
      h += '<span class="ph-atalho-prox">Próximo limite ' + esc(t.proximo.id) + ' · ' +
        (t.proximo.paraLimite === 0 ? 'hoje'
          : t.proximo.paraLimite + ' dia' + (t.proximo.paraLimite === 1 ? '' : 's')) +
        '</span>';
    }
    h += '</a>';
    alvo.innerHTML = h;
  }

  /* ---------- ESTILOS ----------------------------------------------------- */

  var CSS = `
.ph,.ph-atalho{--ph-t:#12222f;--ph-t2:#52646f;--ph-p:#fbfcfc;--ph-rg:#dbe3e8;--ph-v:#0090d4;
--ph-br:#b8321a;--ph-brf:#fdf1ee;--ph-w:#a86a00;--ph-wf:#fdf6e8;--ph-c:#16704a;--ph-cf:#eff7f2;
--ph-m:ui-monospace,"SF Mono","Roboto Mono",Menlo,monospace;--ph-r:15rem;
color:var(--ph-t);font-size:15px;line-height:1.5}
.theme-dark .ph,.theme-dark .ph-atalho{--ph-t:#e6edf5;--ph-t2:#9aa8b8;--ph-p:#161d27;--ph-rg:#2a3645;
--ph-v:#3aa8ff;--ph-br:#ff6b4f;--ph-brf:#2a1715;--ph-w:#f0b44c;--ph-wf:#2a2213;--ph-c:#3ccf8e;--ph-cf:#12241c}
.ph *,.ph *::before,.ph *::after{box-sizing:border-box}
.ph-cab{display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-end;justify-content:space-between;
padding-bottom:1rem;border-bottom:2px solid var(--ph-t)}
.ph-sup{margin:0;font-family:var(--ph-m);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ph-t2)}
.ph-tit{margin:.15rem 0 0;font-size:1.75rem;font-weight:640;letter-spacing:-.02em}
.ph-prov{display:flex;gap:1.75rem;margin:0}
.ph-prov div{display:flex;flex-direction:column;gap:.1rem}
.ph-prov dt{font-family:var(--ph-m);font-size:.625rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ph-t2)}
.ph-prov dd{margin:0;font-family:var(--ph-m);font-size:.8rem}
.ph-saldo{display:flex;flex-wrap:wrap;gap:2rem;align-items:center;justify-content:space-between;
margin-top:1.25rem;padding:1.5rem 1.75rem;border:1px solid var(--ph-rg);border-left:5px solid var(--ph-t2);background:var(--ph-p)}
.ph-saldo.is-divida{border-left-color:var(--ph-br);background:var(--ph-brf)}
.ph-saldo.is-limpo{border-left-color:var(--ph-c);background:var(--ph-cf)}
.ph-fig{display:flex;align-items:baseline;gap:.85rem;max-width:26rem}
.ph-num{font-family:var(--ph-m);font-size:clamp(3rem,8vw,4.5rem);font-weight:600;line-height:.85;
letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.is-divida .ph-num{color:var(--ph-br)}.is-limpo .ph-num{color:var(--ph-c)}
.ph-num-rot{font-size:.9rem;line-height:1.35;color:var(--ph-t2)}
.ph-lado{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:1rem 1.75rem;margin:0;flex:1 1 20rem}
.ph-lado dt{font-family:var(--ph-m);font-size:.625rem;letter-spacing:.09em;text-transform:uppercase;color:var(--ph-t2);margin-bottom:.15rem}
.ph-lado dd{margin:0;font-family:var(--ph-m);font-size:1.05rem;font-variant-numeric:tabular-nums}
.ph-lado .ph-dest dd{color:var(--ph-w)}
.ph-sub{font-size:.75rem;color:var(--ph-t2);font-weight:400}
.ph-nat{margin:.85rem 0 0;padding-left:.85rem;border-left:2px solid var(--ph-rg);
font-size:.78rem;line-height:1.5;color:var(--ph-t2);max-width:60ch}
.ph-sec{display:flex;align-items:baseline;gap:.65rem;margin:2.5rem 0 .65rem;padding-bottom:.4rem;
border-bottom:1px solid var(--ph-rg);font-size:.78rem;font-weight:640;letter-spacing:.1em;text-transform:uppercase}
.ph-sec-n{font-family:var(--ph-m);font-size:.68rem;font-weight:400;letter-spacing:.04em;text-transform:none;color:var(--ph-t2)}
.ph-reg{list-style:none;margin:0;padding:0}
.ph-f{border-bottom:1px solid var(--ph-rg)}
.ph-f details>summary{list-style:none}
.ph-f details>summary::-webkit-details-marker{display:none}
.ph-f-cab{display:grid;width:100%;gap:1rem;align-items:center;
grid-template-columns:2.5rem minmax(11rem,1fr) auto 9.5rem;padding:.85rem .5rem;
border-left:4px solid transparent;cursor:pointer;transition:background .12s ease}
.ph-f-cab:hover{background:var(--ph-p)}
.ph-f details>summary:focus-visible{outline:2px solid var(--ph-v);outline-offset:-2px}
.tom-breach .ph-f-cab{border-left-color:var(--ph-br)}
.tom-window .ph-f-cab{border-left-color:var(--ph-w)}
.tom-clear .ph-f-cab{border-left-color:var(--ph-c)}
.tom-muted .ph-f-cab{border-left-color:var(--ph-rg);opacity:.55}
.ph-f-id{font-family:var(--ph-m);font-size:1rem;font-weight:600;letter-spacing:-.02em}
.ph-f-nome{display:flex;flex-direction:column;gap:.1rem;min-width:0}
.ph-f-tit{font-weight:560}
.ph-f-dt{font-family:var(--ph-m);font-size:.7rem;color:var(--ph-t2)}
.ph-f-c{display:flex;gap:1rem;font-family:var(--ph-m);font-size:.7rem;color:var(--ph-t2)}
.ph-f-c b{font-size:.95rem;font-weight:600;color:var(--ph-t);font-variant-numeric:tabular-nums}
.ph-f-e{display:flex;flex-direction:column;gap:.15rem;align-items:flex-start}
.ph-et{font-family:var(--ph-m);font-size:.625rem;font-weight:600;letter-spacing:.08em;
text-transform:uppercase;padding:.15rem .45rem;border:1px solid currentColor}
.tom-breach .ph-et{color:var(--ph-br)}.tom-window .ph-et{color:var(--ph-w)}
.tom-clear .ph-et{color:var(--ph-c)}.tom-muted .ph-et{color:var(--ph-t2)}
.ph-pz{font-family:var(--ph-m);font-size:.68rem;color:var(--ph-t2);font-variant-numeric:tabular-nums}
.ph-pan{padding:.35rem .5rem 1.5rem 3.5rem}
.ph-abr{margin:0 0 1rem;font-size:.82rem;color:var(--ph-t2);max-width:62ch}
.ph-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(17rem,1fr));gap:1.5rem 2.5rem}
.ph-cols h4{margin:0 0 .5rem;font-family:var(--ph-m);font-size:.65rem;font-weight:600;
letter-spacing:.09em;text-transform:uppercase;color:var(--ph-t2)}
.ph-l{list-style:none;margin:0;padding:0;font-size:.82rem}
.ph-l li{padding:.3rem 0;border-top:1px solid var(--ph-rg)}
.ph-l-t li{display:flex;gap:.6rem}
.ph-tn{font-family:var(--ph-m);font-size:.72rem;color:var(--ph-t2);font-variant-numeric:tabular-nums;flex:none}
.ph-g{margin-top:.5rem}
.ph-g-esc{position:relative;height:1.2rem;margin-left:var(--ph-r);border-bottom:1px solid var(--ph-rg)}
.ph-sem{position:absolute;transform:translateX(-50%);font-family:var(--ph-m);font-size:.62rem;color:var(--ph-t2)}
.ph-g-l{position:relative;list-style:none;margin:0;padding:0}
.ph-ln{display:grid;grid-template-columns:var(--ph-r) 1fr;align-items:center;gap:.5rem;padding:.3rem 0}
.ph-ln-r{font-size:.78rem;display:flex;align-items:baseline;gap:.4rem}
.ph-ln-r b{font-family:var(--ph-m)}
.ph-crit{font-family:var(--ph-m);font-size:.58rem;font-style:normal;letter-spacing:.07em;
text-transform:uppercase;color:var(--ph-br)}
.ph-pista{position:relative;height:1.4rem;background:var(--ph-p)}
.ph-bar{position:absolute;top:.25rem;height:.9rem;background:var(--ph-v);display:flex;align-items:center;padding-left:.35rem}
.is-crit .ph-bar{background:var(--ph-t)}
.ph-bd{font-family:var(--ph-m);font-size:.58rem;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap}
.ph-lim{position:absolute;top:0;bottom:0;width:2px;background:var(--ph-br)}
.ph-hoje{position:absolute;top:-1.2rem;bottom:0;width:1px;background:var(--ph-w);pointer-events:none}
.ph-hoje-r{position:absolute;top:-.15rem;left:.25rem;font-family:var(--ph-m);font-size:.6rem;color:var(--ph-w);white-space:nowrap}
.ph-leg{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem 1.1rem;margin:.9rem 0 0;
font-family:var(--ph-m);font-size:.65rem;color:var(--ph-t2)}
.ph-k{display:inline-block;margin-right:.3rem;vertical-align:middle}
.ph-k-l{width:2px;height:.8rem;background:var(--ph-br)}
.ph-k-b{width:1.4rem;height:.55rem;background:var(--ph-v)}
.ph-k-h{width:1px;height:.8rem;background:var(--ph-w)}
@media(max-width:760px){
.ph{--ph-r:7rem}
.ph-f-cab{grid-template-columns:2.2rem 1fr;row-gap:.5rem}
.ph-f-c,.ph-f-e{grid-column:2/-1}
.ph-f-e{flex-direction:row;align-items:center;gap:.6rem}
.ph-pan{padding-left:.5rem}
.ph-prov{gap:1rem}
.ph-ln-r{font-size:.68rem}}
@media(prefers-reduced-motion:reduce){.ph-f-cab{transition:none}}
.ph-atalho{display:flex;flex-direction:column;gap:.4rem;height:100%;padding:1.1rem 1.25rem;
border:1px solid var(--ph-rg);border-left:5px solid var(--ph-t2);background:var(--ph-p);
text-decoration:none;color:var(--ph-t);font-family:inherit;transition:transform .15s ease,box-shadow .15s ease}
.ph-atalho:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,0,0,.18)}
.ph-atalho.is-divida{border-left-color:var(--ph-br);background:var(--ph-brf)}
.ph-atalho.is-limpo{border-left-color:var(--ph-c);background:var(--ph-cf)}
.ph-atalho-lbl{font-family:var(--ph-m);font-size:.65rem;font-weight:600;letter-spacing:.12em;
text-transform:uppercase;color:var(--ph-t2)}
.ph-atalho-num{font-family:var(--ph-m);font-size:2.1rem;font-weight:600;line-height:.9;
letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.ph-atalho.is-divida .ph-atalho-num{color:var(--ph-br)}
.ph-atalho.is-limpo .ph-atalho-num{color:var(--ph-c)}
.ph-atalho-sub{font-size:.78rem;color:var(--ph-t2)}
.ph-atalho-prox{margin-top:auto;padding-top:.4rem;font-family:var(--ph-m);font-size:.68rem;
color:var(--ph-w);border-top:1px dashed var(--ph-rg)}
`;

  /* ---------- ARRANQUE ---------------------------------------------------- */

  function iniciar() {
    var alvo   = document.getElementById('planeamento-hse');
    var atalho = document.getElementById('planeamento-hse-atalho');
    if (!alvo && !atalho) return;
    if (!document.getElementById('ph-css')) {
      var s = document.createElement('style');
      s.id = 'ph-css';
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    if (alvo)   render(alvo);
    if (atalho) renderAtalho(atalho);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
