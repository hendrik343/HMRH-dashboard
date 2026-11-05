/* HSE Dashboard Huambo — selector de idioma PT / EN.
   Traduz o texto visível no navegador, sem alterar os dados de origem.
   PT é o original; EN é aplicado por cima e removido ao voltar a PT. */
(function () {
  'use strict';

  var MES_ABR = { Jan: 'Jan', Fev: 'Feb', Mar: 'Mar', Abr: 'Apr', Mai: 'May', Jun: 'Jun', Jul: 'Jul', Ago: 'Aug', Set: 'Sep', Out: 'Oct', Nov: 'Nov', Dez: 'Dec' };
  var MES = { Janeiro: 'January', Fevereiro: 'February', 'Março': 'March', Abril: 'April', Maio: 'May', Junho: 'June', Julho: 'July', Agosto: 'August', Setembro: 'September', Outubro: 'October', Novembro: 'November', Dezembro: 'December' };
  var DIAS = { SEG: 'MON', TER: 'TUE', QUA: 'WED', QUI: 'THU', SEX: 'FRI', 'SÁB': 'SAT', DOM: 'SUN', dom: 'Sun' };

  function tm(s) {
    if (!s) return s;
    s = s.replace(/\b(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\b/g, function (m) { return MES[m]; });
    s = s.replace(/\b(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\b/g, function (m) { return MES_ABR[m]; });
    s = s.replace(/\b(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\b/g, function (m) { return MES_ABR[m.charAt(0) + m.slice(1).toLowerCase()].toUpperCase(); });
    return s;
  }

  /* ---------- frases fixas ---------- */
  var X = {
    // cabeçalho e navegação
    'HSE Dashboard · Hospital Militar Regional do Huambo': 'HSE Dashboard · Huambo Regional Military Hospital',
    'HMRH · N.º Obra: 13DC - DEI/SV/2021 · VAMED Healthcare Projects · Coordenador HSE: Hendrik Silva': 'HMRH · Project No.: 13DC - DEI/SV/2021 · VAMED Healthcare Projects · HSE Coordinator: Hendrik Silva',
    'VAMED Healthcare Projects · Angola · Coordenador HSE: Hendrik Silva': 'VAMED Healthcare Projects · Angola · HSE Coordinator: Hendrik Silva',
    'Hospital Militar Regional do Huambo': 'Huambo Regional Military Hospital',
    'Centro operacional HSE · Província do Huambo': 'HSE operations centre · Huambo Province',
    'Mapa de Angola · HMRH': 'Map of Angola · HMRH',
    'Dark': 'Dark', 'Normal': 'Light',
    '← HSE Dashboard': '← HSE Dashboard',
    'Obra 13DC – DEI/SV/2021': 'Project 13DC – DEI/SV/2021',
    'Sistema activo': 'System active',
    'hoje': 'today',
    'Mês anterior': 'Previous month', 'Mês seguinte': 'Next month',
    'Theme mode': 'Theme mode', 'Fechar': 'Close', 'Close popup': 'Close popup',
    'Foto anterior': 'Previous photo', 'Foto seguinte': 'Next photo',
    'Legenda de estado': 'Status legend',
    // KPIs
    'Trabalhadores': 'Workers', 'Testes Alcoolemia': 'Alcohol Tests', 'Checklist HSE': 'HSE Checklist', 'Check-list HSE': 'HSE Checklist',
    'Formação Participantes': 'Training Participants', 'Formação Part.': 'Training Part.', 'Formação · Participantes': 'Training · Participants',
    'Incid. Ambientais': 'Environmental Incid.', 'Incidentes ambientais': 'Environmental incidents',
    'Positivos Alcoolemia': 'Positive Alcohol Tests', 'Positivos Alc.': 'Positive Alc.',
    'Alcoolemia Testes': 'Alcohol Tests', 'Alcoolemia Positivos': 'Alcohol Positives', 'Alcoolemia': 'Alcohol testing', 'Álcool': 'Alcohol',
    'Acidentes (mês)': 'Accidents (month)', 'Acidentes (acum.)': 'Accidents (cum.)', 'Acidentes acumulados (proj.)': 'Cumulative accidents (proj.)',
    'Água (m³)': 'Water (m³)', 'Gasóleo (L)': 'Diesel (L)', 'Electricidade (kWh)': 'Electricity (kWh)',
    'Advertências': 'Warnings', 'Advertências acumuladas (proj.)': 'Cumulative warnings (proj.)',
    'RCD mensal': 'Monthly C&D waste', 'RSU mensal': 'Monthly MSW', 'Resíduos indiferenciados': 'Mixed waste', 'Águas negras': 'Black water',
    'Í. Incidência': 'Incidence Rate', 'Í. Frequência': 'Frequency Rate', 'Í. Gravidade': 'Severity Rate', 'Í. Duração': 'Duration Rate',
    '100% negativos': '100% negative', 'Zero incidentes': 'Zero incidents', 'Zero': 'Zero', 'Sem registo': 'No record',
    'Primeiro mês': 'First month', 'Estável': 'Stable', 'desde 2023': 'since 2023',
    'Indicador': 'Indicator', 'Var.': 'Change', 'Total': 'Total', 'Total Efetivos': 'Total Workforce',
    'Efetivos por Empresa': 'Workforce by Company', 'Consumo de Água · m³': 'Water Consumption · m³',
    'Formações no Mês': 'Training Sessions this Month', 'Resíduos do Mês': 'Waste this Month', 'Resumo Julho': 'July Summary',
    'Estaleiro · Dados Operacionais · Jul 2026': 'Site Camp · Operational Data · Jul 2026',
    'Quadro de Sinistralidade': 'Accident Statistics Table',
    'Trabalhadores · Set 2025 -> Out 2026': 'Workers · Sep 2025 -> Oct 2026',
    'Estagiários': 'Interns', 'Cozinha': 'Kitchen',
    // situações
    '+ Nova Situação HSE': '+ New HSE Issue', 'Reportar Situação HSE': 'Report HSE Issue',
    'As situações HSE só são publicadas a partir do relatório mensal do mês.': 'HSE issues are only published from the monthly report.',
    'Diálogos Diários de Segurança (DDS)': 'Daily Safety Talks (DDS)', 'Realizados': 'Completed', 'Realizada': 'Completed', 'Realizado': 'Completed',
    'Controlo de alcoolemia': 'Alcohol testing', 'Retomado': 'Resumed', 'Abaixo do habitual': 'Below usual level',
    'Resíduos e águas negras': 'Waste and black water', 'Com manifesto': 'With manifest', 'Remoção de águas negras': 'Black water removal',
    'Monitorizado': 'Monitored', 'Em aberto': 'Open', 'Parcial': 'Partial', 'Dados do mês': 'Monthly data',
    'Reuniões Semanais de Segurança e Ambiente Nº 124 e Nº 125': 'Weekly Safety and Environment Meetings No. 124 and No. 125',
    'Aguarda boletim': 'Awaiting lab report', 'Em fase avançada de resolução': 'Close to resolution', 'Não resolvido': 'Unresolved', 'Resolvido': 'Resolved',
    'Sem detalhe': 'No details', 'brevemente disponível': 'coming soon', 'por urgência': 'by urgency',
    'Colheita de água para análise de potabilidade': 'Water sampling for potability analysis',
    'Colheita de água para análise': 'Water sampling for analysis',
    'Colheita de água para análise realizada em 21-08-2026.': 'Water sampling for analysis carried out on 21-08-2026.',
    'Substituição dos filtros do sistema de tratamento de água': 'Replacement of the water treatment system filters',
    'Substituição dos filtros do bebedouro do pessoal.': 'Replacement of the staff drinking fountain filters.',
    'Simulacro Nº 05': 'Drill No. 05', 'Simulacro de derrame (Nº 05)': 'Spill drill (No. 05)',
    'Simulacro de derrame — casa de armazenamento de produtos químicos': 'Spill drill — chemical storage room',
    'Derrame — casa de armazenamento de produtos químicos': 'Spill — chemical storage room',
    'Simulacro agendado no relatório mensal': 'Drill scheduled in the monthly report', 'Simulacro realizado na obra': 'Drill carried out on site',
    'Simulacro agendado': 'Drill scheduled',
    'Acção com Comunidade': 'Community Engagement', 'Acção comunidade · Colégio S. Francisco': 'Community engagement · São Francisco School',
    'Acção de interacção com a comunidade': 'Community engagement activity', 'Ação de interação com a comunidade': 'Community engagement activity',
    'Inquérito à direcção do Colégio São Francisco': 'Survey of the São Francisco School management',
    'Inquérito Colégio São Francisco': 'São Francisco School survey', 'Inquérito às vendedeiras': 'Survey of local street vendors',
    'Controlo de pragas': 'Pest control', 'Controlo de pragas realizado': 'Pest control carried out',
    'Lavagem do sistema de filtragem de água': 'Cleaning of the water filtration system',
    'Manutenção dos aparelhos de ar condicionado': 'Air-conditioning maintenance',
    'Visita do Ministro do MINDENACVP': 'Visit by the MINDENACVP Minister', 'Visita do Ministro do MINDENACVP à obra': 'Site visit by the MINDENACVP Minister',
    'Visita Ministro MINDENACVP': 'MINDENACVP Minister visit', 'Visita da equipa do Tribunal de Contas': 'Visit by the Court of Auditors team',
    'Chegada prevista dos mecânicos para a Máquina Multifunção': 'Mechanics expected for the telehandler',
    'Prazo crítico fossa WC': 'Critical deadline — WC septic tank', 'Entulho': 'Rubble',
    'Só 1 a 15/10 · checklist HSE, consumo de água, incidentes e sinistralidade sem fonte — por preencher com o RM 041': '1–15 Oct only · HSE checklist, water consumption, incidents and accident statistics have no source yet — to be completed with Monthly Report 041',
    '08/10 e 21/10 · a cargo da Belo: manutenção do ar-condicionado dos escritórios, retroescavadora (retrovisor e luzes de retaguarda e presença), multifunção avariada (piscas), iluminação das frentes de trabalho': '08/10 and 21/10 · owned by Belo: office air-conditioning maintenance, backhoe loader (mirror, rear and position lights), telehandler out of service (turn indicators), lighting at work fronts',
    '1 a 15/10/2026 · 240 testes em 10 dias, todos negativos (0,00) · Setembro teve 20 testes': '1–15/10/2026 · 240 tests over 10 days, all negative (0.00) · September had 20 tests',
    '1 a 15/10/2026 · 3 sessões, 236 participantes (Belo) · 02/10 Comportamento saudável no canteiro de obra (80) · 05/10 Cuidados no trânsito após o expediente (80) · 09/10 Outubro Rosa – cancro da mama (76)': '1–15/10/2026 · 3 sessions, 236 participants (Belo) · 02/10 Healthy behaviour on site (80) · 05/10 Road safety after working hours (80) · 09/10 Pink October – breast cancer (76)',
    '02/10 · entulho de alvenaria e estrutura, 1.275 kg em caçamba (Belo) · 13/10 · águas negras, 3 camiões, 36.000 L, aterro sanitário · RSU: 13 quibutos / 138 kg': '02/10 · masonry and structural rubble, 1,275 kg in skip (Belo) · 13/10 · black water, 3 trucks, 36,000 L, sanitary landfill · MSW: 13 baskets / 138 kg',
    'Setembro 2026 · 4 sessões, 300 participantes (Belo) · 04/09 Higiene pessoal (91) · 07/09 Setembro Amarelo – prevenção do suicídio (79) · 11/09 Surto de febre tifóide (56) · 14/09 Impactos dos acidentes de trabalho (74)': 'September 2026 · 4 sessions, 300 participants (Belo) · 04/09 Personal hygiene (91) · 07/09 Yellow September – suicide prevention (79) · 11/09 Typhoid fever outbreak (56) · 14/09 Impact of workplace accidents (74)',
    '12/09/2026 · 20 testes, 20 negativos (0,00) · só trabalhadores da Belo · Agosto teve 440 testes': '12/09/2026 · 20 tests, 20 negative (0.00) · Belo workers only · August had 440 tests',
    '02/09/2026 · 3 camiões, 39.660 L · RSU do período: 36 sacos / 178 kg': '02/09/2026 · 3 trucks, 39,660 L · MSW for the period: 36 bags / 178 kg',
    'Agosto 2026 · RSU 840 kg (Belo Empreendimentos) · Águas negras 26.440 (Chetete) · ambos para o Depósito do Sacaála': 'August 2026 · MSW 840 kg (Belo Empreendimentos) · Black water 26,440 (Chetete) · both to the Sacaála disposal site',
    'Agosto 2026 · Amostras colhidas no ponto de abastecimento e à saída dos depósitos de armazenamento · aguarda boletim laboratorial de potabilidade': 'August 2026 · Samples taken at the supply point and at the storage tank outlet · awaiting the potability lab report',
    'Julho 2026 · 0 acidentes mortais · 0 acidentes não mortais · IF 1,39 · II 0,30': 'July 2026 · 0 fatal accidents · 0 non-fatal accidents · FR 1.39 · IR 0.30',
    'Julho 2026 · Desmontagem dos copos de filtragem, remoção e lavagem dos cartuchos e recolocação do conjunto': 'July 2026 · Filter housings dismantled, cartridges removed and washed, assembly refitted',
    'Julho 2026 · Verificação com check-list — gerador, manipulador telescópico, camião ligeiro, extintores e instalações sociais · inclui controlo de alcoolemia': 'July 2026 · Checklist inspection — generator, telehandler, light truck, extinguishers and welfare facilities · includes alcohol testing',
    'RCD 570 m³ (reaproveitamento) · RSU 660 kg · incidentes ambientais 0': 'C&D waste 570 m³ (reused) · MSW 660 kg · environmental incidents 0',
    'Resultado mensal · 98,1% · Excelente · Fonte: RM 038': 'Monthly result · 98.1% · Excellent · Source: MR 038',
    '9 entidades listadas no relatório': '9 entities listed in the report',
    'Elaborado: Nelson Segunda': 'Prepared by: Nelson Segunda', 'Aprovado: João Ladeiro': 'Approved by: João Ladeiro',
    'Relatório de Simulacro Nº 05': 'Drill Report No. 05', '6 intervenientes': '6 participants',
    // calendário, verificações
    'Calendário · Junho 2026 → Dezembro 2026': 'Calendar · June 2026 → December 2026',
    'Calendário HSE · Julho 2026 / Verificações Julho 2026': 'HSE Calendar · July 2026 / Inspections July 2026',
    'Plano de Inspecções Programadas': 'Scheduled Inspection Plan', 'Plano de Verificações HSE': 'HSE Inspection Plan',
    'Datas principais integradas no calendário HSE acima · documentos e licenças mantidos nesta área.': 'Key dates are shown in the HSE calendar above · documents and licences are kept in this section.',
    'Andaimes': 'Scaffolding', 'Equip. Ligeiros e Pesados': 'Light & Heavy Equip.', 'Equipamentos Ligeiros e Pesados': 'Light and Heavy Equipment',
    'Instalações Sociais': 'Welfare Facilities', 'Instalações sociais': 'Welfare facilities', 'Extintores': 'Fire Extinguishers',
    'Caixa Primeiros Socorros': 'First Aid Box', 'Caixa de Primeiros Socorros': 'First Aid Box', 'Quadros Eléctricos': 'Electrical Panels',
    'Verif. mensal': 'Monthly check', 'Verif. semanal': 'Weekly check', 'Mensal': 'Monthly', 'Semanal': 'Weekly',
    '2.ª-feira': 'Monday', '4.ª-feira': 'Wednesday', 'Sábado': 'Saturday', '1.ª 3.ª-feira': '1st Tuesday', '2.ª 3.ª-feira': '2nd Tuesday',
    '3.ª 3.ª-feira': '3rd Tuesday', 'Última 3.ª-feira': 'Last Tuesday', 'Último dia': 'Last day', 'Eventos': 'Events',
    // documentos e licenças
    'Documentos & Ficheiros': 'Documents & Files', 'Documentação HSE — Huambo': 'HSE Documentation — Huambo',
    'Repositório de Documentos · HMRH': 'Document Repository · HMRH', 'Fluxo de documentos': 'Document flow',
    '22 documentos editáveis · modelos DOCX activos · raiz Google Drive ligada.': '22 editable documents · active DOCX templates · Google Drive root connected.',
    'Licenças': 'Licences', '9 licenças físicas · Repositório de Licenças · HMRH': '9 physical licences · Licence Repository · HMRH',
    'Inserir licenças físicas em Huambo': 'Add physical licences for Huambo',
    'Licença Ambiental': 'Environmental Licence', 'Licença de Areia': 'Sand Licence', 'Licença de Brita': 'Gravel Licence',
    'Licença de Obra': 'Construction Permit', 'Licença de Publicidade': 'Advertising Licence', 'Licença de Tapume': 'Hoarding Licence',
    'Licença de furo de água': 'Borehole Licence', 'Licença do Gerador': 'Generator Licence', 'Certificado Bombeiros': 'Fire Brigade Certificate',
    'Vigente (>60d)': 'Valid (>60d)', 'A expirar (30–60d)': 'Expiring (30–60d)', 'Crítica / expirada (<30d)': 'Critical / expired (<30d)',
    'Data Devida': 'Due Date', 'Inserir': 'Add', 'Ver': 'View', 'Ver aqui': 'View here', 'Baixar DOCX': 'Download DOCX', 'Extrair Drive': 'Export Drive',
    'Submeter': 'Submit', 'Submeter Preenchido': 'Submit Completed', 'Submeter formulário preenchido': 'Submit completed form', 'Cancelar': 'Cancel',
    'Título *': 'Title *', 'Autor *': 'Author *', 'Mês de referência *': 'Reference month *', 'Ficheiro preenchido *': 'Completed file *',
    'Notas (opcional)': 'Notes (optional)', 'Observações (opcional)': 'Comments (optional)', 'Prazo (opcional)': 'Deadline (optional)', 'Fotos (até 5)': 'Photos (up to 5)',
    'DOCX, PDF, XLSX até 20 MB': 'DOCX, PDF, XLSX up to 20 MB', '📎 Arrasta o ficheiro aqui ou clica para escolher': '📎 Drag the file here or click to choose',
    'ex.: Bloco C inspeccionado': 'e.g. Block C inspected', 'ex.: Extintor danificado no armazém': 'e.g. Damaged extinguisher in the warehouse', 'ex.: Nelson Segunda': 'e.g. Nelson Segunda',
    'Novo': 'New', 'Recurso': 'Resource', 'Período': 'Period', 'Emitido': 'Issued', 'Revisão': 'Revision', 'Responsável': 'Owner',
    'Cronograma de obra': 'Works schedule', 'VAMED Engineering GmbH · referência base': 'VAMED Engineering GmbH · baseline reference',
    'Trânsito Drive': 'Drive transfer', 'Google Drive ↗': 'Google Drive ↗',
    // actas
    'Actas de Reunião': 'Meeting Minutes', 'Actas · Reuniões Semanais de Segurança e Ambiente': 'Minutes · Weekly Safety and Environment Meetings',
    'Reunião Semanal de Segurança e Ambiente': 'Weekly Safety and Environment Meeting',
    'Actas no mês': 'Minutes this month', 'Última acta': 'Latest minutes', 'Tarefas em aberto': 'Open tasks', 'Prazos ultrapassados': 'Overdue',
    'Próxima reunião': 'Next meeting', 'sem atrasos': 'no delays', 'por agendar': 'to be scheduled', 'requerem acompanhamento': 'require follow-up',
    'sem actas registadas neste mês': 'no minutes recorded this month', 'Abrir acta em PDF ↗': 'Open minutes in PDF ↗',
    'Redator:': 'Author:', 'Próxima:': 'Next:', 'Tarefa': 'Task', 'Informação': 'Information', 'Decisão': 'Decision',
    'Registo das reuniões quinzenais de obra: temas em acompanhamento, responsáveis, prazos e balanço Good News / Bad News. Cada tema é classificado como Tarefa, Informação ou Decisão.': 'Record of the site meetings: items under follow-up, owners, deadlines and Good News / Bad News summary. Each item is classified as Task, Information or Decision.',
    'HMRH · Obra n.º 13DC-DEI/SV/2021 · VAMED Healthcare Projects · Formulário AF 001.': 'HMRH · Project No. 13DC-DEI/SV/2021 · VAMED Healthcare Projects · Form AF 001.',
    'Fonte: actas originais em PDF, formulário AF 001 (VAMED+WWH). Duas notas de transcrição — na acta n.º 119 o original grafa «HSE (MAMED)», corrigido para VAMED; na acta n.º 120 o tema 4 regista ocorrência a 09-07-2026 mas prazo a 05/07/2026, inconsistência mantida como no original.': 'Source: original minutes in PDF, form AF 001 (VAMED+WWH). Two transcription notes — in minutes No. 119 the original reads «HSE (MAMED)», corrected to VAMED; in minutes No. 120 item 4 records an occurrence on 09-07-2026 but a deadline of 05/07/2026, kept as in the original.',
    'Obra e sala de reuniões da VAMED WWH': 'Site, VAMED WWH meeting room', 'Obra e sala de reuniões da obra': 'Site, site meeting room',
    'Todos os temas provenientes da reunião anterior foram resolvidos.': 'All items from the previous meeting have been resolved.',
    'Elevado nível de organização e limpeza, evidenciado nas diversas frentes de trabalho.': 'High standard of housekeeping across all work fronts.',
    'Corte de capim no interior da obra.': 'Grass cutting inside the site.', 'Corte de capim no interior e no exterior da obra.': 'Grass cutting inside and outside the site.',
    'Corte de capim na parte interior e exterior da obra.': 'Grass cutting inside and outside the site.',
    'Seguimento da reunião anterior: os temas foram todos resolvidos.': 'Follow-up on the previous meeting: all items resolved.',
    'Seguimento da reunião anterior: os temas provenientes da reunião n.º 122 foram todos resolvidos.': 'Follow-up on the previous meeting: all items from meeting No. 122 resolved.',
    'Seguimento da reunião anterior: todos os temas provenientes da reunião anterior foram resolvidos.': 'Follow-up on the previous meeting: all items resolved.',
    'Seguimento da reunião n.º 124: os temas foram dados como resolvidos.': 'Follow-up on meeting No. 124: items reported as resolved.',
    'Seguimento da reunião n.º 125: manutenção do ar-condicionado dos escritórios concluída a 31/10/2026.': 'Follow-up on meeting No. 125: office air-conditioning maintenance completed on 31/10/2026.',
    'Temas provenientes da reunião passada: restantes temas resolvidos.': 'Items from the previous meeting: remaining items resolved.',
    'Temas provenientes da reunião passada: todos resolvidos.': 'Items from the previous meeting: all resolved.',
    'Visita de campo à obra: identificados novos temas para acompanhamento (pontos 4 e 5).': 'Site inspection: new items identified for follow-up (points 4 and 5).',
    'Visita de campo à obra: não resultaram temas novos.': 'Site inspection: no new issues.',
    'Visita de campo à obra: não surgiram temas novos para discussão.': 'Site inspection: no new issues for discussion.',
    'Visita de segurança à obra: sem temas novos relevantes; identificadas as situações dos pontos 3 e 4.': 'Site safety walk: no significant new issues; the items in points 3 and 4 were identified.',
    'Ar-condicionado: a Belo garantiu a manutenção dos aparelhos dos escritórios na semana seguinte.': 'Air-conditioning: Belo committed to servicing the office units the following week.',
    'Ar-condicionado: realizar a manutenção dos aparelhos dos escritórios da VAMED WWH e da Belo Empreendimentos.': 'Air-conditioning: service the units in the VAMED WWH and Belo Empreendimentos offices.',
    'Aparelhos de ar-condicionado dos escritórios sem manutenção.': 'Office air-conditioning units not serviced.',
    'Manutenção do ar-condicionado dos escritórios ainda por realizar.': 'Office air-conditioning maintenance still pending.',
    'Manutenção do ar-condicionado dos escritórios da VAMED WWH e da Belo realizada a 31/10/2026.': 'Air-conditioning maintenance in the VAMED WWH and Belo offices carried out on 31/10/2026.',
    'Iluminação insuficiente no interior das frentes de trabalho e dos blocos.': 'Insufficient lighting inside the work fronts and buildings.',
    'Iluminação: continuar a melhorar a iluminação nas frentes de trabalho e blocos à medida que os trabalhos se intensificarem.': 'Lighting: keep improving lighting at work fronts and buildings as works intensify.',
    'Iluminação: melhorar a iluminação no interior das frentes de trabalho e dos blocos.': 'Lighting: improve lighting inside the work fronts and buildings.',
    'Resíduos perigosos por recolher na baia de resíduos.': 'Hazardous waste awaiting collection in the waste bay.',
    'Resíduos perigosos: quantidade ainda aceitável; acordado acompanhar o armazenamento e proceder à recolha.': 'Hazardous waste: quantity still acceptable; agreed to monitor storage and arrange collection.',
    'Resíduos perigosos: quantidade ainda aceitável; acordado acompanhar o armazenamento na baia de resíduos.': 'Hazardous waste: quantity still acceptable; agreed to monitor storage in the waste bay.',
    'Resíduos perigosos: recolher os resíduos perigosos armazenados na baia de resíduos da obra.': 'Hazardous waste: collect the hazardous waste stored in the site waste bay.',
    'Retroescavadora e multifunção: retrovisor, luzes de retaguarda e de presença, e piscas por reparar; a Belo apresenta a data de resolução na reunião n.º 127.': 'Backhoe loader and telehandler: mirror, rear and position lights and turn indicators to be repaired; Belo will present a completion date at meeting No. 127.',
    'Retroescavadora sem retrovisor e com luzes de retaguarda e de presença deficientes.': 'Backhoe loader missing a mirror, with faulty rear and position lights.',
    'Retroescavadora: reparar o retrovisor e as luzes de retaguarda e de presença.': 'Backhoe loader: repair the mirror and the rear and position lights.',
    'Multifunção (avariada): reparar os piscas de mudança de direcção.': 'Telehandler (out of service): repair the turn indicators.',
    'Multifunção avariada, com piscas de mudança de direcção por reparar.': 'Telehandler out of service, turn indicators still to be repaired.',
    'Documentação da segunda fase: rever toda a documentação da Belo, das subcontratadas e do pessoal que vai entrar em obra.': 'Second-phase documentation: review all documentation from Belo, its subcontractors and incoming personnel.',
    'Documentação das empresas e do pessoal da segunda fase por rever.': 'Documentation of second-phase companies and personnel still to be reviewed.',
    'Contenção de poeiras: melhorar o procedimento de rega das vias e frentes de trabalho, de forma a evitar riscos desnecessários aos trabalhadores.': 'Dust control: improve watering of roads and work fronts to avoid unnecessary risks to workers.',
    'Contenção de poeiras: melhorar o procedimento de rega, evitando riscos desnecessários aos trabalhadores na obra.': 'Dust control: improve the watering procedure to avoid unnecessary risks to workers on site.',
    'Melhorar o procedimento de rega para conter a poeira na obra, evitando riscos desnecessários aos trabalhadores.': 'Improve the watering procedure to control dust on site and avoid unnecessary risks to workers.',
    'Melhorar o procedimento de rega para conter a poeira na obra.': 'Improve the watering procedure to control dust on site.',
    'Procedimento de rega insuficiente para a contenção de poeiras nas frentes de trabalho (resp.: Belo Empreendimentos).': 'Insufficient watering for dust control at work fronts (owner: Belo Empreendimentos).',
    'Procedimento de rega insuficiente para a contenção de poeiras.': 'Insufficient watering for dust control.',
    'Segurança do armamento: comprar cadeado para a caixa de armazenamento do armamento da GUEMAKAL.': 'Weapons security: buy a padlock for the GUEMAKAL weapons storage box.',
    'Caixa de armazenamento do armamento da GUEMAKAL sem cadeado.': 'GUEMAKAL weapons storage box without a padlock.',
    'Gestão de resíduos: partilhar a guia de recolha dos resíduos recolhidos na obra.': 'Waste management: share the collection note for waste removed from site.',
    'Guia de recolha de resíduos e resultado da análise de potabilidade ainda por partilhar.': 'Waste collection note and potability result still to be shared.',
    'Potabilidade da água: partilhar o resultado da análise da água colhida a 21-08-2026.': 'Water potability: share the result of the water sampled on 21-08-2026.',
    'Potabilidade da água: realizar a próxima colheita de água para análise de potabilidade.': 'Water potability: carry out the next water sampling for potability analysis.',
    'Próxima colheita de água para análise de potabilidade ainda por realizar (resp.: Belo Empreendimentos).': 'Next water sampling for potability still pending (owner: Belo Empreendimentos).',
    'Afixar na vitrine da obra a documentação exigida, de acesso ao pessoal: licenças, salário mínimo, planta de estaleiro, apólice de seguro, etc.': 'Display the required documents on the site notice board for staff: licences, minimum wage, site layout, insurance policy, etc.',
    'Baia de estoque de resíduos esvaziada na sequência de dois carregamentos efectuados pela Belo Empreendimentos.': 'Waste storage bay emptied after two loads removed by Belo Empreendimentos.',
    'Baia de estoque de resíduos por esvaziar (prazo 20/08/2026).': 'Waste storage bay still to be emptied (deadline 20/08/2026).',
    'Baias de estoque de resíduos (ocorrência 06-08-2026): a 24 de Agosto a Belo Empreendimentos efectuou dois carregamentos, ficando a baia esvaziada.': 'Waste storage bays (occurrence 06-08-2026): on 24 August Belo Empreendimentos removed two loads and the bay was emptied.',
    'Baias de estoque de resíduos (ocorrência 06-08-2026): recomendada à Belo Empreendimentos a recolha dos resíduos acumulados na baia de estoque.': 'Waste storage bays (occurrence 06-08-2026): Belo Empreendimentos advised to collect the waste accumulated in the bay.',
    'Filtros do bebedouro do pessoal ainda por substituir (prazo 05/07/2026 ultrapassado).': 'Staff drinking fountain filters still to be replaced (deadline 05/07/2026 passed).',
    'Piscas de mudança de direção da máquina multifunção ainda por resolver (prazo 24/06/2026 ultrapassado).': 'Telehandler turn indicators still unresolved (deadline 24/06/2026 passed).',
    'Piscas de mudança de direção da máquina multifunção ainda por resolver (prazo 24/06/2026).': 'Telehandler turn indicators still unresolved (deadline 24/06/2026).',
    'Recolha dos excrementos das fossas do WC do pessoal ainda por efectuar (prazo 20/08/2026).': 'Emptying of the staff WC septic tanks still pending (deadline 20/08/2026).',
    'Reeleição do representante legal dos trabalhadores (CPAT) ainda por concretizar (prazo 24/07/2026).': 'Re-election of the workers’ legal representative (CPAT) still pending (deadline 24/07/2026).',
    'Reeleição em assembleia do representante legal dos trabalhadores da Belo Empreendimentos (CPAT).': 'Re-election at a general meeting of the Belo Empreendimentos workers’ legal representative (CPAT).',
    'Substituição dos elementos que constituem a CPAT (ocorrência 22-07-2026). A Belo Empreendimentos comprometeu-se a realizar eleições na sexta-feira, 24 de Julho, para reeleição do representante legal dos trabalhadores.': 'Replacement of the CPAT members (occurrence 22-07-2026). Belo Empreendimentos committed to holding elections on Friday 24 July to re-elect the workers’ legal representative.',
    'Substituição dos filtros do bebedouro do pessoal (ocorrência 09-07-2026). A Belo Empreendimentos comprometeu-se a substituí-los na semana seguinte, uma vez que a aquisição provém de Luanda.': 'Replacement of the staff drinking fountain filters (occurrence 09-07-2026). Belo Empreendimentos committed to replacing them the following week, as they are being sourced from Luanda.',
    'Tema da última reunião (06-02-2026) — Máquina multifunção: pirilampo, luzes de retaguarda e piscas resolvidos e em funcionamento; falta resolver os piscas de mudança de direção.': 'Item from the last meeting (06-02-2026) — Telehandler: beacon, rear lights and hazard lights fixed and working; turn indicators still to be fixed.',
    'Vazamento das fossas do WC do pessoal (ocorrência 06-02-2026): segundo a Direcção da Belo Empreendimentos, o pagamento da recolha de excrementos já foi efectuado; aguarda-se a recolha.': 'Leak from the staff WC septic tanks (occurrence 06-02-2026): according to Belo Empreendimentos management, the emptying service has been paid; collection is pending.',
    'Próxima reunião: Reunião de Segurança e Ambiente n.º 123/2026 — 02-09-2026, às 10:00, na obra e sala de reuniões da obra.': 'Next meeting: Safety and Environment Meeting No. 123/2026 — 02-09-2026 at 10:00, site meeting room.',
    'Próxima reunião: n.º 124/2026, na obra e sala de reuniões da obra.': 'Next meeting: No. 124/2026, site meeting room.',
    'Próxima reunião: n.º 125/2026, a 21/10/2026, na sala de reuniões da VAMED WWH.': 'Next meeting: No. 125/2026, on 21/10/2026, VAMED WWH meeting room.',
    'Próxima reunião: n.º 126/2026, a 04/11/2026, na sala de reuniões da VAMED WWH.': 'Next meeting: No. 126/2026, on 04/11/2026, VAMED WWH meeting room.',
    'Próxima reunião: n.º 127/2026, a 18/11/2026, na sala de reuniões da VAMED WWH.': 'Next meeting: No. 127/2026, on 18/11/2026, VAMED WWH meeting room.',
    // planeamento
    'Planeamento HSE': 'HSE Planning', 'Planeamento HSE →': 'HSE Planning →', 'avaliações de risco em atraso': 'risk assessments overdue',
    'Período encerrado · falta o quinzenal actual da BELO no Dalux': 'Period closed · BELO’s current fortnightly plan missing from Dalux',
    'Instrumento de planeamento. Identifica que avaliações de risco e toolbox talks os trabalhos planeados exigem e em que data têm de estar emitidas. Não é uma avaliação de risco e não substitui nenhuma. Base: planeamento quinzenal da BELO de 07/09/2026 (período 07/09 a 19/09). À data de emissão não existe no Dalux planeamento quinzenal da BELO posterior a 19/09/2026.': 'Planning tool. It shows which risk assessments and toolbox talks the planned works require and the date by which they must be issued. It is not a risk assessment and does not replace one. Basis: BELO fortnightly plan of 07/09/2026 (period 07/09 to 19/09). At the date of issue there is no BELO fortnightly plan in Dalux after 19/09/2026.',
    'Frentes de trabalho': 'Work fronts', 'Frente encerrada': 'Front closed', 'Transversal': 'Site-wide',
    'Aplicável a toda a obra, todos os dias, todos os subempreiteiros': 'Applies to the whole site, every day, all subcontractors',
    'Avaliações de risco a emitir': 'Risk assessments to issue', 'Toolbox talks a ministrar': 'Toolbox talks to deliver', 'Toolbox talks': 'Toolbox talks',
    'Total exigido': 'Total required', 'Sessões até 19/09': 'Sessions to 19/09', 'sessões': 'sessions', 'AR': 'RA', 'TBT': 'TBT',
    'duração da frente': 'front duration', 'limite da avaliação de risco': 'risk assessment deadline', 'M1–M8 · planeamento do empreiteiro': 'M1–M8 · contractor’s plan',
    'Julho 2026 · Revisão 01': 'July 2026 · Revision 01',
    'Fachadas ETICS — aplicação de primário': 'ETICS façades — primer application', 'Impermeabilização — cobertura Piso 02': 'Waterproofing — Level 02 roof',
    'Junta estrutural vertical — Bloco A/C': 'Vertical structural joint — Block A/C', 'Estrutura Bloco X0B — viga Piso 01': 'Block X0B structure — Level 01 beam',
    'Betão C25/30 — Bloco F': 'C25/30 concrete — Block F', 'Emboço — platibanda T2': 'Rendering — T2 parapet',
    'Aplicação de emboço na platibanda da fachada posterior do Bloco T2': 'Rendering of the parapet on the rear façade of Block T2',
    'Execução de juntas na fachada frontal, do Piso 00 ao Piso 01': 'Joints on the front façade, Level 00 to Level 01',
    'Laje sobre Cupolex, tramo/zona 2 interior, Piso 00': 'Slab on Cupolex, interior bay/zone 2, Level 00',
    'Preparação e armadura da viga estrutural do Piso 01 (07–11/09) e betonagem (11–12/09)': 'Preparation and reinforcement of the Level 01 structural beam (07–11/09) and concreting (11–12/09)',
    'Primário na fachada posterior e caixa de escada Piso 00 (Bloco D), fachada posterior (Bloco E) e zona exterior interna da fachada (Bloco G)': 'Primer on the rear façade and Level 00 stairwell (Block D), rear façade (Block E) and inner exterior façade area (Block G)',
    'Tela TPO na platibanda (zona da junta) e na cobertura das claraboias — Blocos A e B, C e D, F e G': 'TPO membrane on the parapet (joint area) and skylight roofs — Blocks A and B, C and D, F and G',
    'Aberturas em lajes e claraboias': 'Slab openings and skylights', 'Andaimes de torre': 'Tower scaffolds', 'Andaimes gerais': 'General scaffolding',
    'Amarradores e sinaleiros': 'Slingers and signallers', 'Arrumação e limpeza': 'Housekeeping', 'Arrumação e limpeza (housekeeping)': 'Housekeeping',
    'Atitude e comportamento': 'Attitude and behaviour', 'Combate a incêndios': 'Firefighting', 'Condução': 'Driving',
    'Equipamento de protecção individual': 'Personal protective equipment', 'Gestão de resíduos': 'Waste management',
    'Inspecção de equipamentos': 'Equipment inspection', 'Lingas, correntes, ganchos e manilhas': 'Slings, chains, hooks and shackles',
    'Marcha-atrás de viaturas': 'Vehicle reversing', 'Montagem de bombas móveis de betão': 'Setting up mobile concrete pumps',
    'Movimentação manual de cargas': 'Manual handling', 'Plataformas elevatórias móveis (PEMP)': 'Mobile elevating work platforms (MEWP)',
    'Prevenção de incêndios': 'Fire prevention', 'Queimaduras por betão': 'Concrete burns', 'Rebarbadoras e discos abrasivos': 'Grinders and abrasive discs',
    'Remoção de resíduos': 'Waste removal', 'Responsabilidades do trabalhador': 'Worker responsibilities', 'Substâncias perigosas (COSHH)': 'Hazardous substances (COSHH)',
    'Trabalhar junto a equipamento móvel e gruas': 'Working near mobile plant and cranes', 'Trabalho em período quente': 'Working in hot weather',
    'Trabalhos em altura': 'Working at height', 'Trabalhos em altura — platibandas e bordadura': 'Working at height — parapets and edges',
    'Utilização de arneses': 'Use of harnesses', 'Utilização segura de escadas': 'Safe use of ladders', 'Vestuário de trabalho': 'Workwear',
    'Rev01': 'Rev01', '· 1× cada': '· 1× each', '· 2× cada': '· 2× each', '· 23 títulos': '· 23 titles', '· 29 temas': '· 29 topics',
    'HSE Plano de Verificações 2025': 'HSE Inspection Plan 2025', 'HSE Plano de Verificações 2023': 'HSE Inspection Plan 2023',
    'HSE Alcoolemia — Controlo de Casos Positivos v02': 'HSE Alcohol Testing — Positive Case Control v02',
    'HSE Checklist de Inspecção de Andaime': 'HSE Scaffold Inspection Checklist', 'HSE Checklist de Instalações Sociais': 'HSE Welfare Facilities Checklist',
    'HSE Reconhecimento Mensal': 'HSE Monthly Recognition', 'HSE Registo de Formação': 'HSE Training Record',
    'HSE Checklist de Ferramentas Eléctricas Portáteis Manuais': 'HSE Portable Power Tools Checklist',
    'HSE Checklist Entrada Equipamentos': 'HSE Equipment Entry Checklist', 'HSE Checklist Primeiros Socorros': 'HSE First Aid Checklist',
    'HSE Check-list HSE': 'HSE Checklist', 'HSE Lista AR PES': 'HSE RA / SWP List',
    'Matriz de Perigos': 'Hazard Matrix', 'SEP HSE Registo — Actividades de Engajamento': 'SEP HSE Record — Engagement Activities',
    'VAMED Mapa de Limpeza': 'VAMED Cleaning Schedule', 'Verificação Mensal dos Extintores': 'Monthly Fire Extinguisher Inspection',
    'Verificação Mensal dos Quadros Eléctricos': 'Monthly Electrical Panel Inspection', 'XXX Reunião Semanal HSE N.XX': 'XXX Weekly HSE Meeting No. XX',
    'Relatório Mensal HSE Nº 038': 'Monthly HSE Report No. 038',
    'Upload': 'Upload', 'Download': 'Download', 'Drive': 'Drive', 'Em': 'In', 'Ex': 'Ex'
  };

  var PAPEL = {
    'Site Manager Adjunto': 'Deputy Site Manager', 'Coordenador HSE': 'HSE Coordinator', 'Coordenador Ambientalista': 'Environmental Coordinator',
    'HSE': 'HSE', 'Diretor Adjunto': 'Deputy Director', 'THSE': 'HSE Technician', 'Diretor': 'Director',
    'Respons. de Especialidade': 'Discipline Lead', 'Site Manager HSE': 'HSE Site Manager'
  };
  var CAL = { 'And.': 'Scaff.', 'Equip.': 'Equip.', 'Sociais': 'Welfare', 'Ext.': 'Ext.', 'Socorros': 'First aid', 'Quadros': 'Panels', 'Check': 'Check', 'Simulacro': 'Drill' };
  var DDS = {
    'Higiene pessoal': 'Personal hygiene', 'Setembro Amarelo – prevenção do suicídio': 'Yellow September – suicide prevention',
    'Surto de febre tifóide': 'Typhoid fever outbreak', 'Impactos dos acidentes de trabalho': 'Impact of workplace accidents',
    'Comportamento saudável no canteiro de obra': 'Healthy behaviour on site', 'Cuidados no trânsito após o expediente': 'Road safety after working hours',
    'Outubro Rosa – cancro da mama': 'Pink October – breast cancer'
  };

  var P = [
    [/^([+-][\d.,]+(?:%|pp)?) vs(?: (\S+))?$/, function (m) { return m[1] + ' vs' + (m[2] ? ' ' + tm(m[2]) : ''); }],
    [/^(\d+) efetivos · (.+) checklist HSE$/, function (m) { return m[1] + ' workers · ' + m[2] + ' HSE checklist'; }],
    [/^Detalhes · (.+)$/, function (m) { return 'Details · ' + tm(m[1]); }],
    [/^Ambiente & Recursos · (.+)$/, function (m) { return 'Environment & Resources · ' + tm(m[1]); }],
    [/^Indicadores SST · (.+)$/, function (m) { return 'OHS Indicators · ' + tm(m[1]); }],
    [/^Situações HSE Identificadas · (.+)$/, function (m) { return 'HSE Issues Identified · ' + tm(m[1]); }],
    [/^Sem situações publicadas para (.+)$/, function (m) { return 'No issues published for ' + tm(m[1]); }],
    [/^(\S+) -> (\S+) (\d{4})$/, function (m) { return tm(m[1]) + ' -> ' + tm(m[2]) + ' ' + m[3]; }],
    [/^(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez|JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)( \d{2,4})?$/, function (m) { return tm(m[1]) + (m[2] || ''); }],
    [/^(\d{2}) (Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez) (\d{4})$/, function (m) { return m[1] + ' ' + tm(m[2]) + ' ' + m[3]; }],
    [/^(SEG|TER|QUA|QUI|SEX|SÁB|DOM|dom)$/, function (m) { return DIAS[m[1]]; }],
    [/^(\S+ \d{4}) · (\d+) actas?$/, function (m) { return tm(m[1]) + ' · ' + m[2] + (m[2] === '1' ? ' meeting' : ' meetings'); }],
    [/^(\d+) actas?$/, function (m) { return m[1] + (m[1] === '1' ? ' meeting' : ' meetings'); }],
    [/^Doc\. n\.º (\S+) · Obra (\S+) · (\d+) participantes$/, function (m) { return 'Doc. No. ' + m[1] + ' · Project ' + m[2] + ' · ' + m[3] + ' participants'; }],
    [/^Participantes · (\d+)$/, function (m) { return 'Participants · ' + m[1]; }],
    [/^Temas · (\d+)$/, function (m) { return 'Items · ' + m[1]; }],
    [/^(\d+) tarefas? em aberto · (\d+) com prazo ultrapassado · última Nº (\d+) \((.+)\)$/, function (m) { return m[1] + ' open task' + (m[1] === '1' ? '' : 's') + ' · ' + m[2] + ' overdue · latest No. ' + m[3] + ' (' + m[4] + ')'; }],
    [/^Clique para analisar a última acta \(Nº (\d+)\) ↗$/, function (m) { return 'Click to review the latest minutes (No. ' + m[1] + ') ↗'; }],
    [/^Clique para analisar as 2 últimas actas \(Nº (\d+) e Nº (\d+)\) ↗$/, function (m) { return 'Click to review the last 2 sets of minutes (No. ' + m[1] + ' and No. ' + m[2] + ') ↗'; }],
    [/^Próxima reunião Nº (\d+) · (.+)$/, function (m) { return 'Next meeting No. ' + m[1] + ' · ' + m[2]; }],
    [/^Nº (\d+)$/, function (m) { return 'No. ' + m[1]; }],
    [/^Nº (\d+) — (.+)$/, function (m) { return 'No. ' + m[1] + ' — ' + m[2]; }],
    [/^na acta n\.º (\d+)$/, function (m) { return 'in minutes No. ' + m[1]; }],
    [/^(\d+) positivo\(s\)$/, function (m) { return m[1] + ' positive'; }],
    [/^(\d+) positivos · (\d+) negativos · item (\S+) NÃO CONFORME$/, function (m) { return m[1] + ' positive · ' + m[2] + ' negative · item ' + m[3] + ' NON-COMPLIANT'; }],
    [/^(\d+) participantes$/, function (m) { return m[1] + ' participants'; }],
    [/^Expirada há (\d+) dia\(s\)$/, function (m) { return 'Expired ' + m[1] + ' day(s) ago'; }],
    [/^Vigente · (\d+) dia\(s\) restantes$/, function (m) { return 'Valid · ' + m[1] + ' day(s) left'; }],
    [/^(\d+) d após limite$/, function (m) { return m[1] + ' d past deadline'; }],
    [/^Prazo (\S+)$/, function (m) { return 'Deadline ' + m[1]; }],
    [/^(\d+) marcos$/, function (m) { return m[1] + ' milestones'; }],
    [/^marco (M\d+)$/, function (m) { return 'milestone ' + m[1]; }],
    [/^(\d+) AR$/, function (m) { return m[1] + ' RA'; }],
    [/^(\d+) testes, (\d+) positivos$/, function (m) { return m[1] + ' tests, ' + m[2] + ' positive'; }],
    [/^(\d+) camiões, (.+)$/, function (m) { return m[1] + ' trucks, ' + m[2]; }],
    [/^(.+) \((\d+) participantes\)$/, function (m) { return (DDS[m[1]] || X[m[1]] || m[1]) + ' (' + m[2] + ' participants)'; }],
    [/^Reunião Semanal HSE Nº (\S+)$/, function (m) { return 'Weekly HSE Meeting No. ' + m[1]; }],
    [/^Relatório Mensal HSE Nº (\S+)$/, function (m) { return 'Monthly HSE Report No. ' + m[1]; }],
    [/^Verificações HSE (\S+) (\d{4}): (.+)$/, function (m) { return 'HSE Inspections ' + tm(m[1]) + ' ' + m[2] + ': ' + m[3].replace(/(\d\d\/\d\d) ([^·]+?)(?=$| ·)/g, function (_, d, t) { return d + ' ' + (X[t.trim()] || t); }); }],
    [/^(\d\d\/\d\d) (\S+)$/, function (m) { return CAL[m[2]] ? m[1] + ' ' + CAL[m[2]] : null; }],
    [/^(\d\d\/\d\d) (.+)$/, function (m) { return X[m[2]] ? m[1] + ' ' + X[m[2]] : (DDS[m[2]] ? m[1] + ' ' + DDS[m[2]] : null); }],
    [/^Submeter (.+) preenchido$/, function (m) { return 'Submit completed ' + (tr(m[1]) || m[1]); }],
    [/^Limite da AR — frente (\S+)$/, function (m) { return 'RA deadline — front ' + m[1]; }],
    [/^Sistema activo · (.+)$/, function (m) { return 'System active · ' + m[1]; }],
    [/^Novembro 2026 · 1 actas$/, function () { return 'November 2026 · 1 meeting'; }],
    [/^(.+) — (.+?) \((VAMED|Belo Empreendimentos)\)$/, function (m) { return PAPEL[m[2]] ? m[1] + ' — ' + PAPEL[m[2]] + ' (' + m[3] + ')' : null; }]
  ];

  function tr(s) {
    if (!s) return s;
    var k = s.replace(/\s+/g, ' ').trim();
    if (!k || !/[A-Za-zÀ-ÿ]/.test(k)) return null;
    if (Object.prototype.hasOwnProperty.call(X, k)) return X[k];
    if (DDS[k]) return DDS[k];
    for (var i = 0; i < P.length; i++) {
      var m = k.match(P[i][0]);
      if (m) { var r = P[i][1](m); if (r != null) return r; }
    }
    if (k.indexOf(' · ') > 0) {
      var parts = k.split(' · '), changed = false;
      var out = parts.map(function (p) { var t = tr(p); if (t != null && t !== p) { changed = true; return t; } return p; });
      if (changed) return out.join(' · ');
    }
    return null;
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
    if (DONE.get(n) !== cur) ORIG.set(n, cur);       // texto novo vindo da aplicação
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
      if (!c || !c.data || !c.data.labels) return;
      if (!c.$ptLabels || (c.$enLabels && c.data.labels !== c.$enLabels && c.data.labels !== c.$ptLabels)) c.$ptLabels = c.data.labels.slice();
      var next = LANG === 'en' ? c.$ptLabels.map(function (l) { return typeof l === 'string' ? tm(l) : l; }) : c.$ptLabels.slice();
      if (JSON.stringify(next) === JSON.stringify(c.data.labels)) return;
      c.$enLabels = next;
      c.data.labels = next;
      c.update('none');
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
    var host = document.querySelector('.header-actions') || (document.querySelector('.mode-toggle') || {}).parentElement;
    if (!host) return;
    var box = document.createElement('div');
    box.className = 'mode-toggle lang-toggle';
    box.setAttribute('data-i18n-skip', '');
    box.setAttribute('aria-label', 'Language / Idioma');
    box.innerHTML = '<button class="mode-btn lang-btn" type="button" data-lang="pt">PT</button>' +
                    '<button class="mode-btn lang-btn" type="button" data-lang="en">EN</button>';
    box.addEventListener('click', function (e) { var b = e.target.closest('.lang-btn'); if (b) setLang(b.dataset.lang); });
    host.insertBefore(box, host.firstChild);
    var st = document.createElement('style');
    st.textContent = '.lang-toggle{margin-right:8px}.header-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}';
    document.head.appendChild(st);
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
    // Chart.js e conteúdos tardios
    setTimeout(apply, 400); setTimeout(apply, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
