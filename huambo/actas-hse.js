/* ============================================================================
   ACTAS HSE — Reuniões Semanais de Segurança e Ambiente · HMRH Huambo
   Obra n.º 13DC-DEI/SV/2021 · VAMED Healthcare Projects

   Módulo partilhado. Injecta o seu próprio CSS e expõe window.ACTAS_HSE:
     .dados                        → actas indexadas por mês ('jul', ...)
     .renderLista(el, mes, rotulo) → grelha de cartões de acta
     .renderAtalho(el, mes)        → cartão de atalho (estilo Planeamento HSE)
     .resumo(mes)                  → { nActas, emAberto, atrasadas, proxima }

   Arranque automático: preenche #actas-hse (lista completa, todos os meses)
   e #actas-atalho (cartão de atalho) se existirem na página.

   cat: T = Task · I = Inform · D = Decision
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- DADOS -------------------------------------------------------
     Fonte: PDFs "HMRH — Reunião Semanal de Segurança e Ambiente" (AF 001).
     Nota: na acta 119 o original grafa "HSE (MAMED)" — gralha de "VAMED".
     Nota: na acta 120 o tema 4 tem ocorrência 09-07 mas prazo 05/07 (original).
  ------------------------------------------------------------------------- */
  var DADOS = {
    jul: {
      rotulo: 'Julho 2026',
      actas: [
        {
          numero: 119, doc: '119/2026', data: '2026-07-08', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da obra',
          redator: 'Faustino dos Santos', gestor: 'Eduardo Silva',
          proxima: { numero: 120, data: '2026-07-22', hora: '10:00' },
          participantes: [
            'Leônidas Calheiros — Site Manager Adjunto (VAMED)',
            'Irineu Silva — Respons. de Especialidade (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino Santos — HSE (VAMED)',
            'João Ladeiro — HSE (Belo Empreendimentos)',
            'Nelson Segunda — Diretor (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'T', texto: 'Tema da última reunião (06-02-2026) — Máquina multifunção: pirilampo, luzes de retaguarda e piscas resolvidos e em funcionamento; falta resolver os piscas de mudança de direção.', estado: 'Em fase avançada de resolução', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-06-24' },
            { n: 2, cat: 'I', texto: 'Temas provenientes da reunião passada: todos resolvidos.', estado: 'Resolvido' },
            { n: 3, cat: 'I', texto: 'Visita de campo à obra: não surgiram temas novos para discussão.' },
            { n: 4, cat: 'T', texto: 'Substituição dos filtros do bebedouro do pessoal.', responsavel: 'Belo Empreendimentos', prazo: '2026-07-09' },
            { n: 5, cat: 'T', texto: 'Reeleição em assembleia do representante legal dos trabalhadores da Belo Empreendimentos (CPAT).', responsavel: 'Belo Empreendimentos' },
            { n: 6, cat: 'T', texto: 'Afixar na vitrine da obra a documentação exigida, de acesso ao pessoal: licenças, salário mínimo, planta de estaleiro, apólice de seguro, etc.', responsavel: 'Belo Empreendimentos' },
            { n: 7, cat: 'T', texto: 'Melhorar o procedimento de rega para conter a poeira na obra.', responsavel: 'Belo Empreendimentos' }
          ],
          boas: [
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.',
            'Corte de capim na parte interior e exterior da obra.'
          ],
          mas: [
            'Piscas de mudança de direção da máquina multifunção ainda por resolver (prazo 24/06/2026).'
          ]
        },
        {
          numero: 120, doc: '120/2026', data: '2026-07-22', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da obra',
          redator: 'Faustino dos Santos', gestor: 'Eduardo Silva',
          proxima: { numero: 121, data: '2026-08-05', hora: '10:00' },
          participantes: [
            'Eduardo Silva — Site Manager (VAMED)',
            'Leônidas Calheiros — Site Manager Adjunto (VAMED)',
            'Irineu Silva — Respons. de Especialidade (VAMED)',
            'Rita Casqueiro — Site Manager HSE (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino Santos — HSE (VAMED)',
            'Leonel Luamba — Diretor Adjunto (Belo Empreendimentos)',
            'Nelson Segunda — THSE (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'T', texto: 'Tema da última reunião (06-02-2026) — Máquina multifunção: pirilampo, luzes de retaguarda e piscas resolvidos e em funcionamento; falta resolver os piscas de mudança de direção.', estado: 'Em fase avançada de resolução', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-06-24' },
            { n: 2, cat: 'I', texto: 'Temas provenientes da reunião passada: restantes temas resolvidos.', estado: 'Resolvido' },
            { n: 3, cat: 'I', texto: 'Visita de campo à obra: identificados novos temas para acompanhamento (pontos 4 e 5).' },
            { n: 4, cat: 'T', texto: 'Substituição dos filtros do bebedouro do pessoal (ocorrência 09-07-2026). A Belo Empreendimentos comprometeu-se a substituí-los na semana seguinte, uma vez que a aquisição provém de Luanda.', estado: 'Não resolvido', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-07-05' },
            { n: 5, cat: 'T', texto: 'Substituição dos elementos que constituem a CPAT (ocorrência 22-07-2026). A Belo Empreendimentos comprometeu-se a realizar eleições na sexta-feira, 24 de Julho, para reeleição do representante legal dos trabalhadores.', estado: 'Não resolvido', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-07-24' },
            { n: 6, cat: 'T', texto: 'Melhorar o procedimento de rega para conter a poeira na obra, evitando riscos desnecessários aos trabalhadores.', responsavel: 'Belo Empreendimentos' }
          ],
          boas: [
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.'
          ],
          mas: [
            'Piscas de mudança de direção da máquina multifunção ainda por resolver (prazo 24/06/2026 ultrapassado).',
            'Filtros do bebedouro do pessoal ainda por substituir (prazo 05/07/2026 ultrapassado).',
            'Reeleição do representante legal dos trabalhadores (CPAT) ainda por concretizar (prazo 24/07/2026).'
          ]
        }
      ]
    },
    ago: {
      rotulo: 'Agosto 2026',
      actas: [
        {
          numero: 121, doc: '121/2026', data: '2026-08-06', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da obra',
          redator: 'Faustino dos Santos', gestor: 'Eduardo Silva',
          proxima: { numero: 122, data: '2026-08-20', hora: '10:00' },
          participantes: [
            'Eduardo Silva — Site Manager (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino Santos — HSE (VAMED)',
            'Leonel Luamba — Diretor Adjunto (Belo Empreendimentos)',
            'Nelson Segunda — THSE (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'I', texto: 'Temas provenientes da reunião passada: todos resolvidos.', estado: 'Resolvido' },
            { n: 2, cat: 'I', texto: 'Visita de segurança à obra: sem temas novos relevantes; identificadas as situações dos pontos 3 e 4.' },
            { n: 3, cat: 'T', texto: 'Baias de estoque de resíduos (ocorrência 06-08-2026): recomendada à Belo Empreendimentos a recolha dos resíduos acumulados na baia de estoque.', estado: 'Não resolvido', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-08-20' },
            { n: 4, cat: 'T', texto: 'Vazamento das fossas do WC do pessoal (ocorrência 06-02-2026): segundo a Direcção da Belo Empreendimentos, o pagamento da recolha de excrementos já foi efectuado; aguarda-se a recolha.', estado: 'Não resolvido', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-08-20' },
            { n: 5, cat: 'T', texto: 'Melhorar o procedimento de rega para conter a poeira na obra, evitando riscos desnecessários aos trabalhadores.', responsavel: 'Belo Empreendimentos' }
          ],
          boas: [
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.'
          ],
          mas: [
            'Baia de estoque de resíduos por esvaziar (prazo 20/08/2026).',
            'Recolha dos excrementos das fossas do WC do pessoal ainda por efectuar (prazo 20/08/2026).',
            'Procedimento de rega insuficiente para a contenção de poeiras.'
          ]
        },
        {
          numero: 122, doc: '122/2026', data: '2026-08-19', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da obra',
          redator: 'Faustino dos Santos', gestor: 'Eduardo Silva',
          proxima: { numero: 123, data: '2026-09-02', hora: '10:00' },
          participantes: [
            'Eduardo Silva — Site Manager (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino Santos — HSE (VAMED)',
            'Leonel Luamba — Diretor Adjunto (Belo Empreendimentos)',
            'Nelson Segunda — THSE (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'I', texto: 'Seguimento da reunião anterior: todos os temas provenientes da reunião anterior foram resolvidos.', estado: 'Resolvido' },
            { n: 2, cat: 'T', texto: 'Baias de estoque de resíduos (ocorrência 06-08-2026): a 24 de Agosto a Belo Empreendimentos efectuou dois carregamentos, ficando a baia esvaziada.', estado: 'Resolvido', responsavel: 'Nelson Segunda / Leonel Luamba', prazo: '2026-09-02' },
            { n: 3, cat: 'T', texto: 'Contenção de poeiras: melhorar o procedimento de rega das vias e frentes de trabalho, de forma a evitar riscos desnecessários aos trabalhadores.', responsavel: 'Belo Empreendimentos' },
            { n: 4, cat: 'T', texto: 'Potabilidade da água: realizar a próxima colheita de água para análise de potabilidade.', responsavel: 'Belo Empreendimentos' },
            { n: 5, cat: 'I', texto: 'Próxima reunião: Reunião de Segurança e Ambiente n.º 123/2026 — 02-09-2026, às 10:00, na obra e sala de reuniões da obra.' }
          ],
          boas: [
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.',
            'Colheita de água para análise realizada em 21-08-2026.',
            'Baia de estoque de resíduos esvaziada na sequência de dois carregamentos efectuados pela Belo Empreendimentos.',
            'Todos os temas provenientes da reunião anterior foram resolvidos.'
          ],
          mas: [
            'Procedimento de rega insuficiente para a contenção de poeiras nas frentes de trabalho (resp.: Belo Empreendimentos).',
            'Próxima colheita de água para análise de potabilidade ainda por realizar (resp.: Belo Empreendimentos).'
          ]
        }
      ]
    },
    set26: {
      rotulo: 'Setembro 2026',
      actas: [
        {
          numero: 123, doc: '123/2026', pdf: './actas-pdf/HMRH_Ata_Reuniao_Seguranca_Ambiente_123_2026.pdf', data: '2026-09-02', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da VAMED WWH',
          redator: 'VAMED WWH', gestor: 'Eduardo Silva',
          proxima: { numero: 124, data: '2026-09-23', hora: '10:00' },
          participantes: [
            'Leônidas Calheiros — Site Manager Adjunto (VAMED)',
            'Juarês Manico — Coordenador Ambientalista (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino dos Santos — HSE (VAMED)',
            'Leonel Luamba — Diretor Adjunto (Belo Empreendimentos)',
            'Nelson Segunda — THSE (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'I', texto: 'Seguimento da reunião anterior: os temas provenientes da reunião n.º 122 foram todos resolvidos.', estado: 'Resolvido' },
            { n: 2, cat: 'I', texto: 'Visita de campo à obra: não resultaram temas novos.' },
            { n: 3, cat: 'T', texto: 'Contenção de poeiras: melhorar o procedimento de rega, evitando riscos desnecessários aos trabalhadores na obra.', estado: 'Resolvido', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 4, cat: 'T', texto: 'Segurança do armamento: comprar cadeado para a caixa de armazenamento do armamento da GUEMAKAL.', estado: 'Resolvido', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 5, cat: 'T', texto: 'Gestão de resíduos: partilhar a guia de recolha dos resíduos recolhidos na obra.', estado: 'Resolvido', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 6, cat: 'T', texto: 'Potabilidade da água: partilhar o resultado da análise da água colhida a 21-08-2026.', estado: 'Resolvido', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 7, cat: 'I', texto: 'Próxima reunião: n.º 124/2026, na obra e sala de reuniões da obra.' }
          ],
          boas: [
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.',
            'Corte de capim no interior e no exterior da obra.',
            'Todos os temas provenientes da reunião anterior foram resolvidos.'
          ],
          mas: [
            'Procedimento de rega insuficiente para a contenção de poeiras.',
            'Caixa de armazenamento do armamento da GUEMAKAL sem cadeado.',
            'Guia de recolha de resíduos e resultado da análise de potabilidade ainda por partilhar.'
          ]
        },
        {
          numero: 124, doc: '124/2026', pdf: './actas-pdf/HMRH_Ata_Reuniao_Seguranca_Ambiente_124_2026.pdf', data: '2026-09-23', hora: '10:00 – 11:00',
          local: 'Obra e sala de reuniões da obra',
          redator: 'VAMED WWH', gestor: 'Eduardo Silva',
          proxima: null,
          participantes: [
            'Leônidas Calheiros — Site Manager Adjunto (VAMED)',
            'Juarês Manico — Coordenador Ambientalista (VAMED)',
            'Hendrik Silva — HSE Manager (VAMED)',
            'Faustino dos Santos — HSE (VAMED)',
            'Leonel Luamba — Diretor Adjunto (Belo Empreendimentos)',
            'Nelson Segunda — THSE (Belo Empreendimentos)'
          ],
          temas: [
            { n: 1, cat: 'I', texto: 'Seguimento da reunião n.º 123: todos os temas resolvidos (rega, cadeado da caixa do armamento, guia de resíduos e resultado da potabilidade).', estado: 'Resolvido' },
            { n: 2, cat: 'T', texto: 'Equipamento de protecção dos seguranças: organizar capas de chuva para os seguranças patrimoniais (GUEMAKAL).', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 3, cat: 'T', texto: 'Iluminação para as rondas nocturnas: melhorar a luminosidade disponível aos seguranças patrimoniais durante as rondas nocturnas.', responsavel: 'Nelson Segunda / Leonel Luamba' },
            { n: 4, cat: 'I', texto: 'Próxima reunião: n.º 125/2026, na obra e sala de reuniões da obra.' }
          ],
          boas: [
            'Todos os temas provenientes da reunião n.º 123 foram resolvidos.',
            'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.'
          ],
          mas: [
            'Seguranças patrimoniais sem capas de chuva.',
            'Luminosidade insuficiente para as rondas nocturnas dos seguranças.'
          ]
        }
      ]
    }
  };

  /* ---------- AUXILIARES -------------------------------------------------- */

  /* O Vercel serve com cleanUrls:true, logo em produção o link é "./actas".
     Aberto como ficheiro local (file://) não há servidor a resolver o caminho
     sem extensão — nesse caso apontamos directamente para o .html. */
  var LINK = (typeof location !== 'undefined' && location.protocol === 'file:')
    ? './actas.html' : './actas';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function dmy(iso) {
    if (!iso) return '';
    var p = String(iso).split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }

  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function resolvido(t) { return /resolvido/i.test(t.estado || '') && !/não resolvido/i.test(t.estado || ''); }
  function emAberto(t) { return t.cat === 'T' && !resolvido(t); }
  function atrasada(t, hoje) { return emAberto(t) && !!t.prazo && t.prazo < (hoje || hojeISO()); }

  function classeEstado(e) {
    if (!e) return '';
    if (/não resolvido|por resolver/i.test(e)) return 'st-bad';
    if (/resolvido|conclu/i.test(e)) return 'st-ok';
    return 'st-run';
  }

  /* Resumo do mês, calculado sobre a acta mais recente (estado corrente). */
  function resumo(mes) {
    var bloco = DADOS[mes];
    if (!bloco || !bloco.actas.length) return null;
    var lista = bloco.actas.slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; });
    var ultima = lista[lista.length - 1];
    var hoje = hojeISO();
    return {
      rotulo: bloco.rotulo,
      nActas: lista.length,
      ultima: ultima,
      emAberto: ultima.temas.filter(emAberto).length,
      atrasadas: ultima.temas.filter(function (t) { return atrasada(t, hoje); }).length,
      proxima: ultima.proxima || null
    };
  }

  /* ---------- RENDER · LISTA DE ACTAS ------------------------------------- */

  function cartaoActa(a) {
    var hoje = hojeISO();

    var temas = a.temas.map(function (t) {
      var nome = t.cat === 'T' ? 'Tarefa' : t.cat === 'I' ? 'Informação' : 'Decisão';
      var tags = ['<span class="acta-tag cat-' + t.cat + '">' + nome + '</span>'];
      if (t.estado) tags.push('<span class="acta-tag ' + classeEstado(t.estado) + '">' + esc(t.estado) + '</span>');
      if (t.responsavel) tags.push('<span class="acta-tag">' + esc(t.responsavel) + '</span>');
      if (t.prazo) tags.push('<span class="acta-tag' + (atrasada(t, hoje) ? ' late' : '') + '">Prazo ' + dmy(t.prazo) + '</span>');
      return '<div class="acta-tema"><b>' + t.n + '.</b><div>' + esc(t.texto) +
             '<div class="acta-meta">' + tags.join('') + '</div></div></div>';
    }).join('');

    var li = function (x) { return '<li>' + esc(x) + '</li>'; };

    var prox = a.proxima
      ? 'Nº ' + a.proxima.numero + ' — ' + dmy(a.proxima.data) + (a.proxima.hora ? ', ' + esc(a.proxima.hora) : '')
      : '—';

    return '<article class="panel acta">' +
      '<div class="acta-head">' +
        '<div>' +
          '<h3>Reunião Semanal de Segurança e Ambiente</h3>' +
          '<p>' + dmy(a.data) + ' · ' + esc(a.hora) + ' · ' + esc(a.local) + '<br>' +
          'Doc. n.º ' + esc(a.doc) + ' · Obra 13DC-DEI/SV/2021 · ' + a.participantes.length + ' participantes</p>' +
        '</div>' +
        '<span class="acta-num">Nº ' + a.numero + '</span>' +
      '</div>' +
      '<div class="acta-body">' +
        '<div><div class="acta-sub">Temas · ' + a.temas.length + '</div>' +
        '<div class="acta-temas">' + temas + '</div></div>' +
        '<details class="acta-parts"><summary>Participantes · ' + a.participantes.length + '</summary>' +
        '<ul>' + a.participantes.map(li).join('') + '</ul></details>' +
        '<div class="acta-news">' +
          '<div class="good"><div class="acta-sub">Good News</div><ul>' + a.boas.map(li).join('') + '</ul></div>' +
          '<div class="bad"><div class="acta-sub">Bad News</div><ul>' + a.mas.map(li).join('') + '</ul></div>' +
        '</div>' +
      '</div>' +
      '<div class="acta-foot">' +
        '<span>Redator: <strong>' + esc(a.redator) + '</strong></span>' +
        '<span>Gestor: <strong>' + esc(a.gestor) + '</strong></span>' +
        '<span>Próxima: <strong>' + prox + '</strong></span>' +
        (a.pdf ? '<span><a href="' + esc(a.pdf) + '" target="_blank" rel="noopener"><strong>Abrir acta em PDF ↗</strong></a></span>' : '') +
      '</div>' +
    '</article>';
  }

  /* Renderiza a grelha de actas de um mês. mes = 'jul' | 'todos' */
  function renderLista(alvo, mes, rotulo) {
    if (!alvo) return;
    injectarCSS();

    if (mes === 'todos') {
      var chaves = Object.keys(DADOS).filter(function (k) { return DADOS[k].actas.length; });
      if (!chaves.length) { alvo.innerHTML = vazio('Sem actas registadas.'); return; }
      alvo.innerHTML = chaves.reverse().map(function (k) {
        return '<h2 class="acta-mes">' + esc(DADOS[k].rotulo) + ' · ' + DADOS[k].actas.length + ' actas</h2>' +
               '<section class="actas-grid">' + DADOS[k].actas.map(cartaoActa).join('') + '</section>';
      }).join('');
      return;
    }

    var bloco = DADOS[mes];
    if (!bloco || !bloco.actas.length) {
      alvo.innerHTML = vazio('Sem actas registadas para ' + esc(rotulo || mes) + '.');
      return;
    }
    alvo.innerHTML = bloco.actas.map(cartaoActa).join('');
  }

  function vazio(msg) { return '<article class="panel acta-empty">' + msg + '</article>'; }

  /* ---------- RENDER · ATALHO --------------------------------------------- */

  function renderAtalho(alvo, mes) {
    if (!alvo) return;
    injectarCSS();

    var r = resumo(mes);
    if (!r) {
      alvo.innerHTML = '<a class="at-atalho" href="' + LINK + '">' +
        '<span class="at-atalho-lbl">Actas de Reunião</span>' +
        '<span class="at-atalho-num">—</span>' +
        '<span class="at-atalho-sub">sem actas registadas neste mês</span></a>';
      return;
    }

    var limpo = r.atrasadas === 0;
    var h = '<a class="at-atalho ' + (limpo ? 'is-limpo' : 'is-divida') + '" href="' + LINK + '">';
    h += '<span class="at-atalho-lbl">Actas de Reunião</span>';
    h += '<span class="at-atalho-num">' + r.atrasadas + '</span>';
    h += '<span class="at-atalho-sub">' + (limpo
      ? 'acções em atraso · ' + r.emAberto + ' tarefa' + (r.emAberto === 1 ? '' : 's') + ' em aberto'
      : 'acções com prazo ultrapassado · ' + r.emAberto + ' tarefa' + (r.emAberto === 1 ? '' : 's') + ' em aberto') +
      '</span>';
    h += '<span class="at-atalho-meta">' + r.nActas + ' acta' + (r.nActas === 1 ? '' : 's') +
         ' · última Nº ' + r.ultima.numero + ' (' + dmy(r.ultima.data) + ')</span>';
    if (r.proxima) {
      h += '<span class="at-atalho-prox">Próxima reunião Nº ' + r.proxima.numero + ' · ' + dmy(r.proxima.data) + '</span>';
    }
    h += '</a>';
    alvo.innerHTML = h;
  }

  /* ---------- ESTILOS ----------------------------------------------------- */

  var CSS = `
/* --- Actas · grelha e cartões --- */
.actas-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:14px;margin-bottom:16px}
@media (max-width:900px){.actas-grid{grid-template-columns:1fr}}
.acta{padding:0;display:flex;flex-direction:column}
.acta-mes{font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;
color:var(--amber,#ffd000);margin:26px 0 12px}
.acta-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
padding:14px 16px;border-bottom:1px solid var(--line,rgba(255,255,255,.1));background:rgba(255,255,255,.02)}
.acta-head h3{margin:0 0 4px;font-size:14px;font-weight:800;letter-spacing:.04em;color:var(--text,#f7fbff)}
.acta-head p{margin:0;font-size:11px;color:var(--muted,#7b86a3);line-height:1.5}
.acta-num{flex-shrink:0;font-size:11px;font-weight:900;letter-spacing:.08em;padding:5px 10px;
border-radius:999px;background:rgba(255,208,0,.12);color:var(--amber,#ffd000);border:1px solid rgba(255,208,0,.28)}
.acta-body{padding:12px 16px 14px;display:flex;flex-direction:column;gap:12px}
.acta-sub{font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;
color:var(--muted,#7b86a3);margin-bottom:6px}
.acta-temas{display:flex;flex-direction:column;gap:8px}
.acta-tema{display:grid;grid-template-columns:22px 1fr;gap:10px;font-size:12px;line-height:1.5;color:var(--text,#f7fbff)}
.acta-tema > b{color:var(--muted,#7b86a3);font-weight:700;font-size:11px;padding-top:1px}
.acta-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}
.acta-tag{font-size:10px;font-weight:700;letter-spacing:.04em;padding:2px 8px;border-radius:6px;
background:rgba(255,255,255,.05);color:var(--muted,#7b86a3);border:1px solid var(--line,rgba(255,255,255,.1))}
.acta-tag.cat-T{color:var(--cyan,#00e5ff);border-color:rgba(0,229,255,.3)}
.acta-tag.cat-I{color:var(--blue,#1e90ff);border-color:rgba(30,144,255,.3)}
.acta-tag.cat-D{color:var(--violet,#b565ff);border-color:rgba(181,101,255,.3)}
.acta-tag.st-ok{color:var(--green,#00d98f);border-color:rgba(0,214,143,.32);background:rgba(0,214,143,.08)}
.acta-tag.st-bad{color:var(--red,#ff4267);border-color:rgba(255,77,109,.32);background:rgba(255,77,109,.08)}
.acta-tag.st-run{color:var(--amber,#ffd000);border-color:rgba(255,208,0,.3);background:rgba(255,208,0,.07)}
.acta-tag.late{color:var(--red,#ff4267);border-color:rgba(255,77,109,.35);background:rgba(255,77,109,.1)}
.acta-parts{border-top:1px dashed var(--line,rgba(255,255,255,.1));padding-top:10px}
.acta-parts summary{cursor:pointer;font-size:10px;font-weight:900;letter-spacing:.16em;
text-transform:uppercase;color:var(--muted,#7b86a3);list-style:none}
.acta-parts summary::-webkit-details-marker{display:none}
.acta-parts summary::before{content:"▸ ";color:var(--amber,#ffd000)}
.acta-parts[open] summary::before{content:"▾ "}
.acta-parts ul{margin:8px 0 0;padding-left:16px;display:flex;flex-direction:column;gap:4px}
.acta-parts li{font-size:11.5px;line-height:1.5;color:var(--text,#f7fbff)}
.acta-news{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:10px;
border-top:1px dashed var(--line,rgba(255,255,255,.1))}
@media (max-width:620px){.acta-news{grid-template-columns:1fr}}
.acta-news ul{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:5px}
.acta-news li{font-size:11.5px;line-height:1.5;color:var(--text,#f7fbff)}
.acta-news .good .acta-sub{color:var(--green,#00d98f)}
.acta-news .bad .acta-sub{color:var(--red,#ff4267)}
.acta-foot{padding:10px 16px;border-top:1px solid var(--line,rgba(255,255,255,.1));font-size:11px;
color:var(--muted,#7b86a3);display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:auto}
.acta-empty{padding:18px;font-size:12px;color:var(--muted,#7b86a3)}

/* --- Atalho (paridade visual com o cartão do Planeamento HSE) --- */
.at-atalho{--at-t:#12222f;--at-t2:#52646f;--at-p:#fbfcfc;--at-rg:#dbe3e8;
--at-br:#b8321a;--at-brf:#fdf1ee;--at-w:#a86a00;--at-c:#16704a;--at-cf:#eff7f2;
--at-m:ui-monospace,"SF Mono","Roboto Mono",Menlo,monospace;
display:flex;flex-direction:column;gap:.4rem;height:100%;padding:1.1rem 1.25rem;
border:1px solid var(--at-rg);border-left:5px solid var(--at-t2);background:var(--at-p);
color:var(--at-t);text-decoration:none;font-family:inherit;font-size:15px;line-height:1.5;
transition:transform .15s ease,box-shadow .15s ease}
.at-atalho:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,0,0,.18)}
.at-atalho.is-divida{border-left-color:var(--at-br);background:var(--at-brf)}
.at-atalho.is-limpo{border-left-color:var(--at-c);background:var(--at-cf)}
.at-atalho-lbl{font-family:var(--at-m);font-size:.65rem;font-weight:600;letter-spacing:.12em;
text-transform:uppercase;color:var(--at-t2)}
.at-atalho-num{font-family:var(--at-m);font-size:2.1rem;font-weight:600;line-height:.9;
letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.at-atalho.is-divida .at-atalho-num{color:var(--at-br)}
.at-atalho.is-limpo .at-atalho-num{color:var(--at-c)}
.at-atalho-sub{font-size:.78rem;color:var(--at-t2)}
.at-atalho-meta{font-family:var(--at-m);font-size:.68rem;color:var(--at-t2)}
.at-atalho-prox{margin-top:auto;padding-top:.4rem;font-family:var(--at-m);font-size:.68rem;
color:var(--at-w);border-top:1px dashed var(--at-rg)}

/* --- Linha de atalhos --- */
.atalhos-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:12px;margin-bottom:16px;align-items:stretch}
.atalhos-row > div{display:flex}
.atalhos-row > div > a{flex:1}
`;

  function injectarCSS() {
    if (document.getElementById('actas-css')) return;
    var s = document.createElement('style');
    s.id = 'actas-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- API + ARRANQUE ---------------------------------------------- */

  if (document.head) injectarCSS();

  window.ACTAS_HSE = {
    dados: DADOS,
    renderLista: renderLista,
    renderAtalho: renderAtalho,
    resumo: resumo,
    mesMaisRecente: function () {
      var k = Object.keys(DADOS).filter(function (x) { return DADOS[x].actas.length; });
      return k.length ? k[k.length - 1] : null;
    }
  };

  function iniciar() {
    var lista  = document.getElementById('actas-hse');
    var atalho = document.getElementById('actas-atalho');
    if (!lista && !atalho) return;
    injectarCSS();
    if (lista)  renderLista(lista, 'todos');
    if (atalho) renderAtalho(atalho, window.ACTAS_HSE.mesMaisRecente());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
