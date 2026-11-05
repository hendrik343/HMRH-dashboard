/* HSE Dashboard Cabinda — selector de idioma PT / EN.
   Traduz o texto visível no navegador, sem alterar os dados de origem.
   PT é o original; EN é aplicado por cima e removido ao voltar a PT.
   Ordem: frase exacta (X) → padrões (P) → substituição de termos (G). */
(function () {
  'use strict';

  var MES_ABR = { Jan: 'Jan', Fev: 'Feb', Mar: 'Mar', Abr: 'Apr', Mai: 'May', Jun: 'Jun', Jul: 'Jul', Ago: 'Aug', Set: 'Sep', Out: 'Oct', Nov: 'Nov', Dez: 'Dec' };
  var MES = { Janeiro: 'January', Fevereiro: 'February', 'Março': 'March', Abril: 'April', Maio: 'May', Junho: 'June', Julho: 'July', Agosto: 'August', Setembro: 'September', Outubro: 'October', Novembro: 'November', Dezembro: 'December' };

  function tm(s) {
    if (!s) return s;
    s = s.replace(/(^|[^A-Za-zÀ-ÿ])(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)(?![A-Za-zÀ-ÿ])/g, function (_, a, m) { return a + MES[m]; });
    s = s.replace(/\b(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\b/g, function (m) { return MES_ABR[m]; });
    s = s.replace(/\b(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\b/g, function (m) { return MES_ABR[m.charAt(0) + m.slice(1).toLowerCase()].toUpperCase(); });
    return s;
  }

  /* ---------- frases exactas ---------- */
  var X = {
    'HSE DASHBOARD · Hospital Militar Regional de Cabinda': 'HSE DASHBOARD · Cabinda Regional Military Hospital',
    'HSE Dashboard — HMRC · Hospital Militar Regional de Cabinda': 'HSE Dashboard — HMRC · Cabinda Regional Military Hospital',
    'Hospital Militar Regional de Cabinda': 'Cabinda Regional Military Hospital',
    'Mapa de Angola — Hospital Militar Regional de Cabinda': 'Map of Angola — Cabinda Regional Military Hospital',
    'Clique no marcador para detalhes': 'Click the marker for details',
    'Dark': 'Dark', 'Normal': 'Normal', 'Modo de visualização': 'Display mode', 'Legenda de estado': 'Status legend',
    'Trabalhadores': 'Workers', 'Testes Alcoolemia': 'Alcohol Tests', 'Checklist HSE': 'HSE Checklist', 'Check-list HSE': 'HSE Checklist',
    'Formação Participantes': 'Training Participants', 'Formação Part.': 'Training Part.', 'Formação': 'Training',
    'Formação — Participantes (Mês)': 'Training — Participants (Month)', 'Formação · acções': 'Training · sessions',
    'Incid. Ambientais': 'Environmental Incid.', 'Inc. Ambientais': 'Env. Incidents',
    'Positivos Alcoolemia': 'Positive Alcohol Tests', 'Positivos Alc.': 'Positive Alc.',
    'Alcoolemia Testes': 'Alcohol Tests', 'Alcoolemia Testes (acum.)': 'Alcohol Tests (cum.)',
    'Alcoolemia Positivos': 'Alcohol Positives', 'Alcoolemia Positivos (acum.)': 'Alcohol Positives (cum.)',
    'Alcoolemia — Testes vs Positivos': 'Alcohol Testing — Tests vs Positives',
    'Acidentes': 'Accidents', 'Acidentes (acum.)': 'Accidents (cum.)', 'Dias perdidos': 'Lost days',
    'Í. Frequência (acum.)': 'Frequency Rate (cum.)', 'Í. Gravidade (acum.)': 'Severity Rate (cum.)',
    'Água (m³)': 'Water (m³)', 'Gasóleo (L)': 'Diesel (L)', 'Electricidade (kWh)': 'Electricity (kWh)',
    'Água': 'Water', 'Gasóleo': 'Diesel', 'Electricidade': 'Electricity',
    'RSU': 'MSW', 'RSU (kg)': 'MSW (kg)', 'Entulho': 'Rubble', 'Entulho (m³)': 'Rubble (m³)',
    'Biodegradáveis': 'Biodegradable', 'Biodegradáveis (kg)': 'Biodegradable (kg)',
    'Advertências': 'Warnings', 'Indicador': 'Indicator', 'Var.': 'Change', 'Recurso': 'Resource', 'Acumulado': 'Cumulative',
    'Estado': 'Status', 'Empresa': 'Company', 'Tipo': 'Type', 'N.º': 'No.', 'TOTAL': 'TOTAL', 'Acum.': 'Cum.',
    'Início': 'Start', '— igual': '— same', 'Mês Ant.': 'Prev. Month', 'Mês Atual': 'Current Month',
    'Trabalhadores — Ago 2025 → Out 2026': 'Workers — Aug 2025 → Oct 2026',
    'Checklist HSE — Classificação': 'HSE Checklist — Rating',
    'Presença & Verificações HSE': 'Attendance & HSE Inspections',
    'Efetivos por Empresa ·': 'Workforce by Company ·', 'Detalhe por Empresa ·': 'Breakdown by Company ·',
    'SEG': 'MON', 'TER': 'TUE', 'QUA': 'WED', 'QUI': 'THU', 'SEX': 'FRI', 'SÁB': 'SAT', 'DOM': 'SUN',
    'Dia útil': 'Working day', 'Sábado': 'Saturday', 'Feriado': 'Public holiday', 'Domingo': 'Sunday',
    'Verif. semanal': 'Weekly check', 'Verif. mensal': 'Monthly check', 'Formação / Comunidade': 'Training / Community',
    '+ Nova Situação HSE': '+ New HSE Issue', 'Reportar Situação HSE': 'Report HSE Issue',
    'EXCELENTE': 'EXCELLENT', 'Excelente': 'Excellent', 'Classificação EXCELENTE': 'Rated EXCELLENT',
    // plano, licenças, documentos
    'Plano de Verificações HSE': 'HSE Inspection Plan', 'Calendário · Junho 2026 → Dezembro 2026': 'Calendar · June 2026 → December 2026',
    'Datas principais integradas no Mapa de Presença acima · documentos e licenças mantidos nesta área.': 'Key dates are shown in the attendance calendar above · documents and licences are kept in this section.',
    'HSE Plano de Verificações 2025': 'HSE Inspection Plan 2025', 'HSE Plano de Verificações 2023': 'HSE Inspection Plan 2023',
    'VAMED Engineering GmbH · referência base': 'VAMED Engineering GmbH · base reference',
    '0 acidentes': '0 accidents', '1 acidente': '1 accident',
    '⬡ ESTALEIRO': '⬡ SITE', 'FORÇA DE TRABALHO': 'WORKFORCE',
    'efectivo e acidentes do Quadro RM037': 'workforce and accidents from Table MR037', 'restantes valores estimados': 'other values estimated',
    'Ver': 'View', 'Baixar DOCX': 'Download DOCX', 'Plano de Inspecções Programadas': 'Scheduled Inspection Plan',
    'Andaimes': 'Scaffolding', 'Instalações Sociais': 'Welfare Facilities', 'Equip. Ligeiros e Pesados': 'Light & Heavy Equip.',
    'Extintores': 'Fire Extinguishers', 'Caixa Primeiros Socorros': 'First Aid Box', 'Quadros Eléctricos': 'Electrical Panels',
    'Semanal': 'Weekly', 'Mensal': 'Monthly', 'Trimestral': 'Quarterly',
    '2.ª-feira': 'Monday', '4.ª-feira': 'Wednesday', '1.ª 3.ª-feira': '1st Tuesday', '2.ª 3.ª-feira': '2nd Tuesday',
    '3.ª 3.ª-feira': '3rd Tuesday', 'Última 3.ª-feira': 'Last Tuesday', 'Último dia': 'Last day',
    'Data Devida': 'Due Date', 'Licenças': 'Licences', 'Inserir': 'Add', 'Inserir licenças físicas em Cabinda': 'Add physical licences for Cabinda',
    '9 licenças físicas · Repositório de Licenças · HMRC': '9 physical licences · Licence Repository · HMRC',
    'Licença de Obra': 'Construction Licence', 'Licença Ambiental': 'Environmental Licence', 'Licença de Tapume': 'Hoarding Licence',
    'Licença de Publicidade': 'Advertising Licence', 'Licença do Gerador': 'Generator Licence', 'Certificado Bombeiros': 'Fire Brigade Certificate',
    'Licença de furo de água': 'Water Borehole Licence', 'Licença de Areia': 'Sand Licence', 'Licença de Brita': 'Gravel Licence',
    'Em': 'Iss.', 'Ex': 'Exp.', 'Vigente (>60d)': 'Valid (>60d)', 'A expirar (30–60d)': 'Expiring (30–60d)', 'Crítica / expirada (<30d)': 'Critical / expired (<30d)',
    'Documentação HSE — Cabinda': 'HSE Documentation — Cabinda', 'Repositório de Documentos · HMRC': 'Document Repository · HMRC',
    'Fluxo de documentos': 'Document flow', 'Trânsito': 'Transit', 'Extrair': 'Extract',
    'Matriz de Perigos': 'Hazard Matrix', 'HSE Lista AR PES': 'HSE RA & SWP List', 'HSE Reconhecimento Mensal': 'HSE Monthly Recognition',
    'HSE Registo de Formação': 'HSE Training Record', 'VAMED Mapa de Limpeza': 'VAMED Cleaning Schedule',
    'Check-list de Implementação HSE': 'HSE Implementation Checklist',
    'Checklist de Ferramentas Eléctricas Portáteis Manuais': 'Portable Hand-held Power Tools Checklist',
    'HSE Checklist de Inspecção de Andaime': 'HSE Scaffold Inspection Checklist', 'HSE Checklist de Instalações Sociais': 'HSE Welfare Facilities Checklist',
    'HSE Checklist de Verificação de Extintores': 'HSE Fire Extinguisher Inspection Checklist', 'HSE Checklist Entrada Equipamentos': 'HSE Equipment Entry Checklist',
    'HSE Checklist Primeiros Socorros': 'HSE First Aid Checklist', 'Verificação Mensal dos Extintores': 'Monthly Fire Extinguisher Inspection',
    'Verificação Mensal dos Quadros Eléctricos': 'Monthly Electrical Panel Inspection',
    'HSE Alcoolemia — Controlo de Casos Positivos v02': 'HSE Alcohol Testing — Positive Case Control v02',
    'SEP HSE Registo — Actividades de Engajamento': 'SEP HSE Record — Engagement Activities',
    'Reunião Semanal HSE N.XX (Template)': 'Weekly HSE Meeting No. XX (Template)', 'XXX Reunião Semanal HSE N.XX': 'XXX Weekly HSE Meeting No. XX',
    'Relatório de Simulacro · Junho 2026': 'Drill Report · June 2026', 'Formação Interna · Junho 2026': 'Internal Training · June 2026',
    // formulário de submissão / modal
    'Submeter': 'Submit', 'Submeter Preenchido': 'Submit Completed', 'Submeter formulário preenchido': 'Submit completed form',
    'Cancelar': 'Cancel', 'Fechar': 'Close', 'Título *': 'Title *', 'Autor *': 'Author *', 'Responsável': 'Owner',
    'Mês de referência *': 'Reference month *', 'Ficheiro preenchido *': 'Completed file *', 'Notas (opcional)': 'Notes (optional)',
    'Observações (opcional)': 'Remarks (optional)', 'Prazo (opcional)': 'Deadline (optional)', 'Fotos (até 5)': 'Photos (up to 5)',
    'DOCX, PDF, XLSX até 20 MB': 'DOCX, PDF, XLSX up to 20 MB', '📎 Arrasta o ficheiro aqui ou clica para escolher': '📎 Drag the file here or click to choose',
    'ex.: Bloco C inspeccionado': 'e.g. Block C inspected', 'ex.: Extintor danificado no armazém': 'e.g. Damaged extinguisher in the warehouse', 'ex.: Nelson Segunda': 'e.g. Nelson Segunda',
    'Foto anterior': 'Previous photo', 'Foto seguinte': 'Next photo',
    // situações fixas
    '🎖️ Visita do Ministro do MINDENACVP — entrega de EPI à delegação': '🎖️ Visit by the MINDENACVP Minister — PPE issued to the delegation',
    'Visita institucional à obra': 'Institutional site visit', 'Data por confirmar': 'Date to be confirmed',
    'Delegação equipada com capacete e colete': 'Delegation fitted with helmet and vest',
    '🚩 Mastros e bandeiras — bandeiras não instaladas': '🚩 Flagpoles and flags — flags not installed',
    'Requer alteração da posição dos mastros': 'Flagpoles need to be relocated', 'Plano de imagem': 'Site branding plan',
    '📑 Seguro de Acidentes de Trabalho — recibo da renovação': '📑 Workplace Accident Insurance — renewal receipt',
    'Apólice com renovação automática': 'Policy renews automatically', 'Recibo mais recente por receber': 'Latest receipt not yet received',
    '🔊 Estudos Técnicos — gases, partículas e ruído': '🔊 Technical Studies — gases, particulates and noise',
    '🔊 Estudos Técnicos — periodicidade trimestral': '🔊 Technical Studies — quarterly',
    'Periodicidade trimestral': 'Quarterly frequency', 'Sem medição no mês': 'No measurement this month',
    'Próximo estudo no 1.º trimestre de 2026': 'Next study in Q1 2026', '1.º trimestre 2026': 'Q1 2026',
    'Sem medição registada no RM030': 'No measurement recorded in MR030',
    '🤝 Comunidade — sensibilização HSE na Escola PUNIV do Buco Ngoio': '🤝 Community — HSE awareness session at PUNIV School, Buco Ngoio',
    'Interacção com a comunidade (SEP)': 'Community engagement (SEP)', '🤝 Interacção com a comunidade': '🤝 Community engagement',
    '🛡️ Formação da Segurança Patrimonial — Código de Conduta, SEA e GBV': '🛡️ Security Guard Training — Code of Conduct, SEA and GBV',
    '🧯 Extintores e ⚡ quadros eléctricos — verificação mensal': '🧯 Fire extinguishers and ⚡ electrical panels — monthly inspection',
    '⚡ Quadros eléctricos — verificação mensal': '⚡ Electrical panels — monthly inspection',
    '4 extintores e 4 quadros': '4 extinguishers and 4 panels', 'Todos em bom estado': 'All in good condition', 'Sem anomalias': 'No anomalies',
    '✅ Advertências — 0 no mês / 13 acumuladas': '✅ Warnings — 0 this month / 13 cumulative',
    '1 retirada definitiva acumulada': '1 permanent removal (cumulative)', '0 retiradas no mês': '0 removals this month', '0 retiradas': '0 removals',
    '🧯 Simulacro — último realizado a 10 Jun 2026': '🧯 Emergency drill — last held on 10 Jun 2026',
    '🧯 Simulacro — último realizado a 11 Set 2025 (evacuação)': '🧯 Emergency drill — last held on 11 Sep 2025 (evacuation)',
    '🧯 Simulacro — queda de nível diferente': '🧯 Emergency drill — fall from height', '🧯 Simulacro — desmaio': '🧯 Emergency drill — fainting',
    'Segurança · queda de nível diferente': 'Safety · fall from height', 'Planear o próximo simulacro': 'Plan the next drill',
    'Sem simulacro em Outubro': 'No drill in October', 'Sem simulacro em Janeiro': 'No drill in January',
    'Sem simulacro no mês de Julho': 'No drill in July', 'Não realizado em Julho': 'Not held in July',
    'Realizado a 10 Jun 2026': 'Held on 10 Jun 2026', 'Fonte: Relatório de Simulacro Rev.3, 10-06-2026': 'Source: Drill Report Rev.3, 10-06-2026',
    'Sem entidades externas': 'No external bodies involved',
    '🦺 Segurança e Saúde do Trabalho — nada a registar': '🦺 Occupational Health & Safety — nothing to report',
    '🦺 Segurança e Saúde do Trabalho — 0 acidentes': '🦺 Occupational Health & Safety — 0 accidents',
    '🦺 Segurança e Saúde do Trabalho — 0 acidentes no mês': '🦺 Occupational Health & Safety — 0 accidents this month',
    '⚠️ Acidente de trabalho não mortal — 1 no mês': '⚠️ Non-fatal workplace accident — 1 this month',
    '🌍 Incidente ambiental — descarte inadequado de betão (7 m³)': '🌍 Environmental incident — improper concrete disposal (7 m³)',
    '1 acidente acumulado (Fev 2026)': '1 cumulative accident (Feb 2026)',
    '👷 Estaleiro em fase final — 11 efectivos (VAMED, Joferamo e Filhos, Afrilim)': '👷 Site in final phase — 11 workers (VAMED, Joferamo e Filhos, Afrilim)',
    'Segurança patrimonial passa para a Joferamo e Filhos': 'Site security now provided by Joferamo e Filhos',
    'Segurança patrimonial: Joferamo e Filhos': 'Site security: Joferamo e Filhos',
    'Confrasilvas e Protector já não constam': 'Confrasilvas and Protector no longer on site',
    'Organizações AP → Lixeira da Planície': 'Organizações AP → Planície landfill',
    'Mastros/bandeiras (2.4) e sinalização da água potável (3.13) por melhorar': 'Flagpoles/flags (2.4) and drinking-water signage (3.13) to be improved',
    'Retomado em Outubro (5 testes)': 'Resumed in October (5 tests)', '🍺 Controlo de alcoolemia — 0 testes no mês': '🍺 Alcohol testing — 0 tests this month',
    'Situações, empresas e resíduos não carregados para este mês': 'Issues, companies and waste not loaded for this month',
    'Distribuição por empresa no relatório (por integrar)': 'Company breakdown in the report (not yet loaded)',
    'Efectivo médio · distribuição por empresa por integrar': 'Average workforce · company breakdown not yet loaded',
    'Resíduos do mês por integrar': 'Monthly waste not yet loaded',
    // tags
    'Sem ocorrências': 'No occurrences', 'Não conforme': 'Non-compliant', 'A aguardar': 'Pending', 'Realizada': 'Completed', 'Realizado': 'Completed',
    'Conforme': 'Compliant', 'Monitorizado': 'Monitored', 'Desmobilização': 'Demobilisation', 'Fase final': 'Final phase', 'Registado': 'Recorded',
    'Sem testes': 'No tests', 'Sem acidentes': 'No accidents', 'Sem acções no mês': 'No activities this month', 'Pendente': 'Pending',
    'Só indicadores': 'Indicators only', '1 incidente': '1 incident', '2 acções': '2 sessions', 'Sem retiradas': 'No removals',
    'Normal ': 'Normal', 'Recolhido': 'Collected', 'Triado': 'Sorted', 'Aterro': 'Landfill', 'Lixeira': 'Landfill',
    // empresas
    'Gestor do Projecto': 'Project Manager', 'Gestão do Projecto': 'Project Management', 'Subcontratado de estrutura': 'Structural subcontractor',
    'Estrutura': 'Structure', 'Cofragem (M-E)': 'Formwork (M-E)', 'Alvenaria': 'Masonry', 'Segurança Patrimonial': 'Site Security', 'Limpeza': 'Cleaning',
    'Segurança': 'Safety', 'Ambiente': 'Environment'
  };

  /* ---------- padrões com números ou meses ---------- */
  var P = [
    [/^(\d+) total$/, function (m) { return m[1] + ' total'; }],
    [/^(\d+) empresas \/ subcontratadas$/, function (m) { return m[1] + ' companies / subcontractors'; }],
    [/^(\d+) negativos · (\d+) positivos$/, function (m) { return m[1] + ' negative · ' + m[2] + ' positive'; }],
    [/^vs (\S+)$/, function (m) { return 'vs ' + tm(m[1]); }],
    [/^Mês \((\S+)\)$/, function (m) { return 'Month (' + tm(m[1]) + ')'; }],
    [/^Checklist \((\S+)\)$/, function (m) { return 'Checklist (' + tm(m[1]) + ')'; }],
    [/^(\d+) acum\.$/, function (m) { return m[1] + ' cum.'; }],
    [/^Expirada há (\d+) dia\(s\)$/, function (m) { return 'Expired ' + m[1] + ' day(s) ago'; }],
    [/^Vigente · (\d+) dia\(s\) restantes$/, function (m) { return 'Valid · ' + m[1] + ' day(s) left'; }],
    [/^▲ (\d+) positivo\(s\)$/, function (m) { return '▲ ' + m[1] + ' positive'; }],
    [/^(\d\d\/\d\d) (And\.|Equip\.|Sociais|Ext\.|Socorros|Quadros|Check|Sim\.|Form\.|Comun\.)$/, function (m) {
      return m[1] + ' ' + ({ 'And.': 'Scaf.', 'Equip.': 'Equip.', 'Sociais': 'Welfare', 'Ext.': 'Ext.', 'Socorros': 'First aid', 'Quadros': 'Panels', 'Check': 'Check', 'Sim.': 'Drill', 'Form.': 'Train.', 'Comun.': 'Comm.' })[m[2]];
    }],
    [/^(\d+) e (\d+) (\S+) (\d{4})$/, function (m) { return m[1] + ' and ' + m[2] + ' ' + tm(m[3]) + ' ' + m[4]; }],
    [/^Extintores (\d+) (\S+) · Quadros (\d+) (\S+)$/, function (m) { return 'Extinguishers ' + m[1] + ' ' + tm(m[2]) + ' · Panels ' + m[3] + ' ' + tm(m[4]); }],
    [/^(\d+) participantes · (\d+) min$/, function (m) { return m[1] + ' participants · ' + m[2] + ' min'; }],
    [/^Submeter (.+) preenchido$/, function (m) { return 'Submit completed ' + (tr(m[1]) || m[1]); }]
  ];

  /* ---------- termos (substituição dentro do texto) — mais longos primeiro ---------- */
  var G = [
    ['Produção de Resíduos —', 'Waste Production —'], ['Quadros Eléctricos', 'Electrical Panels'], ['Instalações Sociais', 'Welfare Facilities'],
    ['Check-list HSE', 'HSE Checklist'], ['Equip. Ligeiros e Pesados', 'Light & Heavy Equip.'], ['Caixa Primeiros Socorros', 'First Aid Box'],
    ['Andaimes', 'Scaffolding'], ['RSU', 'MSW'],
    ['EXCELENTE', 'EXCELLENT'], ['Reunião Semanal HSE N.', 'Weekly HSE Meeting No. '],
    ['Situações HSE Identificadas', 'HSE Issues Identified'], ['Indicadores SST', 'OHS Indicators'],
    ['Consumos Ambientais', 'Environmental Consumption'], ['(Verificado)', '(Verified)'], ['(por integrar)', '(not yet loaded)'],
    ['Resíduos Produzidos', 'Waste Produced'], ['Total Efetivos', 'Total Workforce'], ['Detalhes', 'Details'],
    ['ESTALEIRO · FORÇA DE TRABALHO', 'SITE · WORKFORCE'],
    ['efectivo e acidentes confirmados pelo Quadro de Sinistralidade RM037; checklist, alcoolemia, formação e consumos são estimativas (relatório mensal não integrado).',
      'workforce and accidents confirmed by Accident Statistics Table MR037; checklist, alcohol testing, training and consumption are estimates (monthly report not loaded).'],
    ['efectivo e acidentes do Quadro RM037 · restantes valores estimados', 'workforce and accidents from Table MR037 · other values estimated'],
    ['Detalhe mensal de', 'Monthly detail for'], ['não integrado no dashboard', 'not loaded in the dashboard'],
    ['Relatório Mensal HSE RM Nº', 'Monthly HSE Report MR No.'], ['Quadro de Sinistralidade RM Nº', 'Accident Statistics Table MR No.'],
    ['Checklist RM Nº', 'Checklist MR No.'], ['Verificação de Quadros Eléctricos', 'Electrical Panel Inspection'],
    ['Verificação de Extintores', 'Fire Extinguisher Inspection'], ['Formação Segurança Patrimonial', 'Security Guard Training'],
    ['Inspecções de Quadro', 'Panel Inspections'], ['Inspecção de Equipamento', 'Equipment Inspection'], ['Toolbox Talks', 'Toolbox Talks'],
    ['Formações', 'Training Sessions'], ['Indução 4', 'Induction 4'], ['Extintor', 'Extinguisher'], ['Andaime', 'Scaffold'],
    ['Verificações HSE', 'HSE Inspections'], ['verificação mensal', 'monthly inspection'], ['Sensibilização HSE', 'HSE awareness'],
    ['Escola PUNIV do Buco Ngoio', 'PUNIV School, Buco Ngoio'], ['Código de Conduta', 'Code of Conduct'],
    ['verificados, todos OK', 'inspected, all OK'], ['verificados, bom estado', 'inspected, good condition'],
    ['Simulacro - queda de nível diferente', 'Drill - fall from height'],
    ['documentos · Mar, Ago, Set e Out 2026 integrados · pasta Google Drive ligada.', 'documents · Mar, Aug, Sep and Oct 2026 loaded · Google Drive folder linked.'],
    ['Realizada a', 'Done on'], ['(registo RM037)', '(record MR037)'], ['Check-list de', 'Checklist for'],
    ['Sistema activo', 'System active'], ['Amb:', 'Env:'], ['Assist.:', 'Asst.:'], ['N.º Obra:', 'Project No.:'],
    ['Verificado', 'Verified'], ['parcial', 'partial'], ['acidentes no mês', 'accidents this month'], ['acidente no mês', 'accident this month'],
    ['Checklist HSE', 'HSE Checklist'], ['Controlo de alcoolemia', 'Alcohol testing'], ['Alcoolemia', 'Alcohol Testing'],
    ['Acumulado:', 'Cumulative:'], ['testes', 'tests'], ['positivos', 'positive'], ['100% negativos no mês', '100% negative this month'],
    ['100% negativos', '100% negative'], ['100% Negativos', '100% Negative'], ['Zero incidentes', 'Zero incidents'],
    ['Formação —', 'Training —'], ['acções', 'sessions'], ['participantes', 'participants'], ['part.', 'part.'],
    ['Seg. Patrimonial:', 'Site security:'], ['Segurança:', 'Safety:'], ['Ambiente:', 'Environment:'], ['Indução:', 'Induction:'],
    ['Resíduos —', 'Waste —'], ['entulho e biodegradáveis 0', 'rubble and biodegradable 0'],
    ['entulho', 'rubble'], ['Entulho', 'Rubble'], ['madeira', 'timber'], ['biodegradáveis', 'biodegradable'], ['Biodegradáveis', 'Biodegradable'],
    ['baldes de tinta', 'paint buckets'], ['Desmobilização —', 'Demobilisation —'], ['efectivos', 'workers'], ['Efectivo:', 'Workforce:'],
    ['Í. Frequência acum.', 'Cum. Frequency Rate'], ['Í. Gravidade', 'Severity Rate'], ['0 acidentes · 0 dias perdidos', '0 accidents · 0 lost days'],
    ['0 dias perdidos', '0 lost days'], ['0 incidentes ambientais', '0 environmental incidents'], ['0 reclamações no mês', '0 complaints this month'],
    ['0 reclamações', '0 complaints'], ['1 não conformidade', '1 non-conformity'], ['Resp:', 'Owner:'], ['Prazo:', 'Deadline:'],
    ['Registado no', 'Recorded in'], ['Extintores', 'Extinguishers'], ['Quadros', 'Panels'], ['Checklist item', 'Checklist item'],
    ['Sem simulacro em', 'No drill in'], ['Alcoolemia —', 'Alcohol Testing —'],
    ['RM0', 'MR0'], ['Rev.01', 'Rev.01']
  ];

  function tg(s) {
    var o = s;
    for (var i = 0; i < G.length; i++) if (s.indexOf(G[i][0]) >= 0) s = s.split(G[i][0]).join(G[i][1]);
    s = tm(s);
    return s !== o ? s : null;
  }

  function tr(s) {
    if (!s) return s;
    var k = s.replace(/\s+/g, ' ').trim();
    if (!k || !/[A-Za-zÀ-ÿ]/.test(k)) return null;
    if (Object.prototype.hasOwnProperty.call(X, k)) return X[k];
    for (var i = 0; i < P.length; i++) {
      var m = k.match(P[i][0]);
      if (m) { var r = P[i][1](m); if (r != null) return r; }
    }
    if (k.indexOf(' · ') > 0 && k.indexOf(': ') < 0) {
      var parts = k.split(' · '), changed = false;
      var out = parts.map(function (p) { var t = tr(p); if (t != null && t !== p) { changed = true; return t; } return p; });
      if (changed) return out.join(' · ');
    }
    return tg(k);
  }

  /* ---------- aplicação ao DOM ---------- */
  var LANG = 'pt';
  try { LANG = localStorage.getItem('hse-lang') === 'en' ? 'en' : 'pt'; } catch (e) {}
  var ORIG = new WeakMap(), DONE = new WeakMap();
  var ATTRS = ['title', 'placeholder', 'aria-label'];
  var busy = false;

  function skip(el) {
    if (!el) return true;
    var t = el.tagName;
    return t === 'SCRIPT' || t === 'STYLE' || t === 'NOSCRIPT' || (el.closest && el.closest('[data-i18n-skip]'));
  }

  function doText(n) {
    var cur = n.nodeValue;
    if (DONE.get(n) !== cur) ORIG.set(n, cur);
    var o = ORIG.get(n);
    if (LANG === 'en') {
      var t = tr(o);
      if (t != null) {
        var lead = o.match(/^\s*/)[0], trail = o.match(/\s*$/)[0];
        var v = lead + t + trail;
        if (cur !== v) n.nodeValue = v;
        DONE.set(n, v);
        return;
      }
    }
    if (cur !== o) n.nodeValue = o;
    DONE.set(n, o);
  }

  function doAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i], key = 'data-i18n-pt-' + a;
      if (!el.hasAttribute(a) && !el.hasAttribute(key)) continue;
      var cur = el.getAttribute(a), saved = el.getAttribute(key), last = el.getAttribute('data-i18n-en-' + a);
      if (saved == null || (cur !== last && cur !== saved)) { saved = cur; el.setAttribute(key, cur); }
      if (LANG === 'en') {
        var t = tr(saved);
        if (t != null) {
          if (cur !== t) el.setAttribute(a, t);
          if (last !== t) el.setAttribute('data-i18n-en-' + a, t);
          continue;
        }
      }
      if (saved != null && cur !== saved) el.setAttribute(a, saved);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!skip(root.parentElement)) doText(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) { return n.nodeType === 1 ? (skip(n) ? 2 : 1) : 1; }
    });
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) doText(n); else doAttrs(n);
    }
  }

  function charts() {
    if (!window.Chart || !Chart.instances) return;
    Object.values(Chart.instances).forEach(function (c) {
      if (!c || !c.data) return;
      if (c.data.labels) {
        if (!c.$ptLabels || (c.$enLabels && c.data.labels !== c.$enLabels && c.data.labels !== c.$ptLabels)) c.$ptLabels = c.data.labels.slice();
        var next = LANG === 'en' ? c.$ptLabels.map(function (l) { return typeof l === 'string' ? (tr(l) || l) : l; }) : c.$ptLabels.slice();
        if (JSON.stringify(next) !== JSON.stringify(c.data.labels)) { c.$enLabels = next; c.data.labels = next; c.update('none'); }
      }
      (c.data.datasets || []).forEach(function (d) {
        if (typeof d.label !== 'string') return;
        if (d.$ptLabel == null) d.$ptLabel = d.label;
        var l = LANG === 'en' ? ({ Testes: 'Tests', Positivos: 'Positives' })[d.$ptLabel] || d.$ptLabel : d.$ptLabel;
        if (d.label !== l) { d.label = l; c.update('none'); }
      });
    });
  }

  function apply() {
    busy = true;
    try {
      document.documentElement.lang = LANG === 'en' ? 'en' : 'pt';
      walk(document.body);
      if (!document.$ptTitle) document.$ptTitle = document.title;
      document.title = LANG === 'en' ? (tr(document.$ptTitle) || document.$ptTitle) : document.$ptTitle;
      charts();
      var lb = document.getElementById('lightModeBtn'); if (lb) lb.textContent = LANG === 'en' ? 'Light' : 'Normal';
      document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === LANG); });
    } finally { busy = false; }
  }

  function setLang(l) {
    LANG = l === 'en' ? 'en' : 'pt';
    try { localStorage.setItem('hse-lang', LANG); } catch (e) {}
    apply();
  }
  window.setHseLang = setLang;

  function toggle() {
    if (document.querySelector('.lang-toggle')) return;
    var theme = document.querySelector('.theme-toggle');
    var host = theme ? theme.parentElement : document.querySelector('.h-right');
    if (!host) return;
    var box = document.createElement('div');
    box.className = 'theme-toggle lang-toggle';
    box.setAttribute('data-i18n-skip', '');
    box.setAttribute('aria-label', 'Language / Idioma');
    box.innerHTML = '<button class="theme-btn lang-btn" type="button" data-lang="pt">PT</button>' +
                    '<button class="theme-btn lang-btn" type="button" data-lang="en">EN</button>';
    box.addEventListener('click', function (e) { var b = e.target.closest('.lang-btn'); if (b) setLang(b.dataset.lang); });
    host.insertBefore(box, theme || host.firstChild);
  }

  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; apply(); });
  }

  function start() {
    toggle();
    apply();
    new MutationObserver(function () { if (!busy && LANG === 'en') schedule(); })
      .observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    setTimeout(apply, 400); setTimeout(apply, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
