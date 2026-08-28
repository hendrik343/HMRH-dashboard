/**
 * ⚠ DESALINHADO — NÃO CORRER SEM ACTUALIZAR PRIMEIRO.
 *
 * Este gerador é anterior à divisão do projecto em três pastas (commit ef3951f)
 * e ao trabalho de Junho/Julho de 2026. Verificado a 2026-08-28 contra o
 * repositório actual:
 *
 *   1. buildHuambo() lê 'index.html' na raiz, que já não existe. Rebenta com
 *      ENOENT. As páginas vivem em huambo/, cabinda/ e luena/.
 *
 *   2. Para o Cabinda e o Luena corre até ao fim, mas emite um bloco DATA com
 *      outro vocabulário de campos do que as páginas passaram a ler:
 *        emite      accAcum, ii, ifreq, id, warn
 *        esperado   accAc,   inc, ifq,   idur, adv
 *      e não emite de todo hAc, aguaAc, gasAc, rsuAc, cls nem acumRepetido.
 *      Publicar o dist/ resultante deixaria o Quadro de Sinistralidade do Luena
 *      todo a "—", faria a classificação do checklist voltar ao limiar do
 *      dashboard em vez da do relatório, e apagaria da página os três pontos
 *      por confirmar do RM038.
 *
 * O que está em produção são as páginas escritas à mão em huambo/, cabinda/ e
 * luena/index.html. O dist/ não é servido por nenhum dos três projectos Vercel
 * e está no .gitignore. Fica aqui como registo da ideia — gerar as páginas a
 * partir do dados/obras/*.json — para quem a quiser retomar. Para a retomar é
 * preciso corrigir os dois pontos acima primeiro.
 */

/**
 * build.mjs
 *
 * Reads dados/obras/{cabinda,huambo,luena}.json and emits
 * dist/{cabinda,huambo,luena}/index.html.
 *
 * Strategy: clone + patch
 *   1. Read each site's current HTML as a string.
 *   2. Replace the JS data block (const data / const DATA) with fresh data from JSON.
 *   3. Update months array, labels, active month button.
 *   4. Strip cross-site navigation links (only for the generated copy).
 *   5. Write to dist/{site}/index.html.
 *
 * Run with:  node build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Month key mapping: ISO month digit → short Portuguese key ───────────────
const ISO_TO_SHORT = {
  '08': 'ago', '09': 'set', '10': 'out', '11': 'nov', '12': 'dez',
  '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', '05': 'mai',
  '06': 'jun', '07': 'jul'
};

const SHORT_LABEL = {
  ago: 'AGO 2025', set: 'SET 2025', out: 'OUT 2025', nov: 'NOV 2025',
  dez: 'DEZ 2025', jan: 'JAN 2026', fev: 'FEV 2026', mar: 'MAR 2026',
  abr: 'ABR 2026', mai: 'MAI 2026', jun: 'JUN 2026', jul: 'JUL 2026'
};

const SHORT_ABR = {
  ago: 'Ago', set: 'Set', out: 'Out', nov: 'Nov', dez: 'Dez',
  jan: 'Jan', fev: 'Fev', mar: 'Mar', abr: 'Abr', mai: 'Mai',
  jun: 'Jun', jul: 'Jul'
};

const SHORT_YEAR = {
  ago: '2025', set: '2025', out: '2025', nov: '2025', dez: '2025',
  jan: '2026', fev: '2026', mar: '2026', abr: '2026', mai: '2026',
  jun: '2026', jul: '2026'
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Read file as UTF-8 string */
function readFile(p) {
  return readFileSync(join(__dirname, p), 'utf8');
}

/** Read JSON file */
function readJson(p) {
  return JSON.parse(readFile(p));
}

/** Ensure directory exists */
function mkdirp(p) {
  mkdirSync(join(__dirname, p), { recursive: true });
}

/** Write file */
function writeFile(p, content) {
  writeFileSync(join(__dirname, p), content, 'utf8');
}

/** Convert ISO key "2025-08" → short key "ago" */
function isoToShort(isoKey) {
  const month = isoKey.slice(5, 7); // "08", "09", etc.
  return ISO_TO_SHORT[month];
}

// ─── JSON → JS field mapping ─────────────────────────────────────────────────

/** Map a single month entry from JSON to Huambo JS format */
function huamboMonthEntry(m) {
  const s = m.sinistralidade;
  const a = m.ambiente;
  const residuos = m.residuos?.mensal || [];

  const fields = [];
  fields.push(`w:${m.trabalhadores}`);
  fields.push(`ch:${m.checklist}`);
  fields.push(`t:${m.alcoolemia.testes}`);
  fields.push(`p:${m.alcoolemia.positivos}`);
  fields.push(`f:${m.formacao.participantes}`);
  fields.push(`i:${a.incidentes}`);
  fields.push(`acc:${s.acidentes}`);

  if (s.acumulado != null) {
    fields.push(`accAcum:${s.acumulado}`);
  }

  // water field (null if missing/null)
  const waterVal = a.agua?.mes;
  fields.push(`water:${waterVal == null ? 'null' : waterVal}`);

  fields.push(`gas:${a.combustivel?.mes ?? 'null'}`);
  fields.push(`elec:${a.electricidade?.mes ?? 'null'}`);

  // warn
  if (m.advertencias?.mes != null) {
    fields.push(`warn:${m.advertencias.mes}`);
  }

  // residuos
  const rcd = residuos.find(r => r.tipo === 'RCD' || r.tipo === 'RCD — Entulho');
  if (rcd != null) fields.push(`rcdKg:${rcd.quantidade}`);

  const indiferenciados = residuos.find(r =>
    r.tipo === 'Indiferenciados' || r.tipo === 'RSU Indiferenciados'
  );
  if (indiferenciados != null) fields.push(`wasteKg:${indiferenciados.quantidade}`);

  const aguasNegras = residuos.find(r =>
    r.tipo === 'Águas Negras' && r.quantidade != null
  );
  if (aguasNegras != null) fields.push(`blackWaterL:${aguasNegras.quantidade}`);

  const rsu = residuos.find(r =>
    (r.tipo === 'RSU' || r.tipo === 'RSU — Entulho') && !r.tipo.includes('Indiferenciados')
  );
  if (rsu != null && rsu.quantidade != null) fields.push(`rsuKg:${rsu.quantidade}`);

  // sinistralidade indices
  const idx = s.indices;
  if (idx) {
    if (idx.incidencia != null) fields.push(`ii:${idx.incidencia}`);
    if (idx.frequencia != null) fields.push(`ifreq:${idx.frequencia}`);
    if (idx.gravidade != null)  fields.push(`ig:${idx.gravidade}`);
    if (idx.duracao != null)    fields.push(`id:${idx.duracao}`);
  }

  return `{${fields.join(', ')}}`;
}

/** Map a single month entry from JSON to Cabinda/Luena JS format */
function cabindaLuenaMonthEntry(m, isLuena = false) {
  const s = m.sinistralidade;
  const a = m.ambiente;
  const residuos = m.residuos?.mensal || [];

  const fields = [];
  fields.push(`w:${m.trabalhadores}`);
  fields.push(`ch:${m.checklist}`);
  fields.push(`t:${m.alcoolemia.testes ?? 'null'}`);
  fields.push(`p:${m.alcoolemia.positivos ?? 'null'}`);
  fields.push(`f:${m.formacao.participantes ?? 'null'}`);
  fields.push(`i:${a.incidentes}`);
  fields.push(`acc:${s.acidentes}`);

  if (s.acumulado != null) {
    fields.push(`accAcum:${s.acumulado}`);
  }

  // agua field (not water)
  const aguaVal = a.agua?.mes;
  fields.push(`agua:${aguaVal == null ? 'null' : aguaVal}`);

  fields.push(`gas:${a.combustivel?.mes ?? 'null'}`);
  fields.push(`elec:${a.electricidade?.mes ?? 'null'}`);

  // Luena adds h: (worked hours)
  if (isLuena && s.horas != null) {
    fields.push(`h:${s.horas}`);
  }

  // warn
  if (m.advertencias?.mes != null) {
    fields.push(`warn:${m.advertencias.mes}`);
  }

  // sinistralidade indices
  const idx = s.indices;
  if (idx) {
    if (idx.incidencia != null) fields.push(`ii:${idx.incidencia}`);
    if (idx.frequencia != null) fields.push(`ifreq:${idx.frequencia}`);
    if (idx.gravidade != null)  fields.push(`ig:${idx.gravidade}`);
    if (idx.duracao != null)    fields.push(`id:${idx.duracao}`);
  }

  return `{${fields.join(', ')}}`;
}

// ─── Build Huambo ─────────────────────────────────────────────────────────────

function buildHuambo() {
  const json = readJson('dados/obras/huambo.json');
  let html = readFile('index.html');

  const monthEntries = Object.entries(json.meses);
  const shortKeys = monthEntries.map(([iso]) => isoToShort(iso));
  const lastKey = shortKeys[shortKeys.length - 1];

  // Generate const months, labels, short, year lines
  const monthsArr = `['${shortKeys.join("','")}']`;

  const labelsObj = shortKeys.map(k => `${k}: '${SHORT_LABEL[k]}'`).join(', ');
  const shortObj  = shortKeys.map(k => `${k}:'${SHORT_ABR[k]}'`).join(', ');
  const yearObj   = shortKeys.map(k => `${k}:'${SHORT_YEAR[k]}'`).join(', ');

  // Generate data entries
  const dataLines = monthEntries.map(([iso, m]) => {
    const key = isoToShort(iso);
    return `      ${key}: ${huamboMonthEntry(m)}`;
  }).join(',\n');

  // Generate companiesByMonth
  const companiesEntries = monthEntries
    .filter(([, m]) => m.empresas && m.empresas.length > 0)
    .map(([iso, m]) => {
      const key = isoToShort(iso);
      const arr = m.empresas.map(e => `['${e.nome}', ${e.efectivos}]`).join(', ');
      return `      ${key}: [\n        ${arr}\n      ]`;
    });
  const companiesByMonthBlock = companiesEntries.length > 0
    ? `    const companiesByMonth = {\n${companiesEntries.join(',\n')}\n    };`
    : `    const companiesByMonth = {};`;

  // Build new JS block
  const newDataBlock = `    const months = ${monthsArr};
    const labels = {
      ${labelsObj}
    };
    const short = { ${shortObj} };
    const year = { ${yearObj} };
    const data = {
${dataLines}
    };

${companiesByMonthBlock}`;

  // Old JS block pattern: from "const months = [" through "const companiesByMonth = {" ... closing "};"
  // We'll replace from "    const months = [" to the end of companiesByMonth block
  const oldBlockStart = `    const months = [`;
  const oldBlockEndMarker = `    };`; // ends the companiesByMonth block

  const startIdx = html.indexOf(oldBlockStart);
  if (startIdx === -1) throw new Error('Huambo: cannot find "const months = ["');

  // Find the companiesByMonth block end
  const companiesByMonthIdx = html.indexOf('    const companiesByMonth = {', startIdx);
  if (companiesByMonthIdx === -1) throw new Error('Huambo: cannot find companiesByMonth');

  // Find the closing "};" after companiesByMonth
  const closingIdx = html.indexOf('\n    };', companiesByMonthIdx);
  if (closingIdx === -1) throw new Error('Huambo: cannot find closing }; of companiesByMonth');
  const endIdx = closingIdx + '\n    };'.length;

  html = html.slice(0, startIdx) + newDataBlock + html.slice(endIdx);

  // Update the daily events block (dailyByMonth) — we keep it hardcoded since
  // the per-day data structure is highly specific and not fully in JSON.
  // The current file already has the correct jul data, so no changes needed.

  // Update active month button in nav
  // Find pattern: data-month="..." active ... last button
  // Replace the active class: class="month-btn active" data-month="${lastKey}"
  // Current HTML has: data-month="${lastKey}" class="month-btn active"
  // We regenerate the full month nav from months array via JS already, so
  // the hardcoded nav buttons don't matter — the script rebuilds them.
  // But to be safe, update the hardcoded nav too:
  html = html.replace(
    /<nav class="months" id="monthButtons">.*?<\/nav>/s,
    `<nav class="months" id="monthButtons">${shortKeys.map(k =>
      `<button class="month-btn${k === lastKey ? ' active' : ''}" data-month="${k}" onclick="setMonth('${k}')">${SHORT_LABEL[k]}</button>`
    ).join('')}</nav>`
  );

  // Remove cross-site navigation (site-btn links to cabinda/ and luena/)
  html = html.replace(
    /\s*<a class="site-btn" href="\.\/cabinda\/"[^>]*>Cabinda<\/a>/g, ''
  );
  html = html.replace(
    /\s*<a class="site-btn" href="\.\/luena\/"[^>]*>Luena<\/a>/g, ''
  );

  return html;
}

// ─── Build Cabinda ────────────────────────────────────────────────────────────

function buildCabinda() {
  const json = readJson('dados/obras/cabinda.json');
  let html = readFile('cabinda/index.html');

  const monthEntries = Object.entries(json.meses);
  const shortKeys = monthEntries.map(([iso]) => isoToShort(iso));
  const lastKey = shortKeys[shortKeys.length - 1];

  // Generate MONTHS, M_LABEL, M_ABR arrays/objects
  const monthsArr = `['${shortKeys.join("','")}']`;
  const mLabelObj = shortKeys.map(k => `${k}:'${SHORT_LABEL[k]}'`).join(',');
  const mAbrObj   = shortKeys.map(k => `${k}:'${SHORT_ABR[k]}'`).join(',');

  // Data entries
  const dataLines = monthEntries.map(([iso, m]) => {
    const key = isoToShort(iso);
    return `  ${key}: ${cabindaLuenaMonthEntry(m, false)}`;
  }).join(',\n');

  // Build replacement block for the DATA section
  // Old pattern starts at: const MONTHS = [
  // Ends at: };\n (end of const DATA = { ... };)
  // We also update the comment block above

  const newDataBlock = `const MONTHS = ${monthsArr};
const M_LABEL = {${mLabelObj}};
const M_ABR   = {${mAbrObj}};

const DATA = {
${dataLines}
};

let currMonth = '${lastKey}';`;

  // Find old block
  const oldStart = html.indexOf('const MONTHS = [');
  if (oldStart === -1) throw new Error('Cabinda: cannot find "const MONTHS = ["');

  // Find "let currMonth = '" line end
  const currMonthIdx = html.indexOf("let currMonth = '", oldStart);
  if (currMonthIdx === -1) throw new Error('Cabinda: cannot find "let currMonth"');
  const currMonthEnd = html.indexOf('\n', currMonthIdx) + 1;

  html = html.slice(0, oldStart) + newDataBlock + '\n' + html.slice(currMonthEnd);

  // Update hardcoded month buttons in the HTML nav (single targeted replacement)
  const firstMbtnC = html.indexOf('<button class="mbtn"');
  if (firstMbtnC !== -1) {
    const navStartC = html.lastIndexOf('<nav', firstMbtnC);
    const navEndC   = html.indexOf('</nav>', firstMbtnC) + '</nav>'.length;
    if (navStartC !== -1 && navEndC > navStartC) {
      const newNav = html.slice(navStartC, html.indexOf('>', navStartC) + 1) + '\n' +
        shortKeys.map(k =>
          `      <button class="mbtn${k === lastKey ? ' active' : ''}" onclick="setMonth('${k}',this)">${SHORT_LABEL[k]}</button>`
        ).join('\n') + '\n    </nav>';
      html = html.slice(0, navStartC) + newNav + html.slice(navEndC);
    }
  }

  // Remove cross-site navigation (site-btn links to ../ and ../luena/)
  html = html.replace(
    /\s*<a class="site-btn" href="\.\.\/"[^>]*>Huambo<\/a>/g, ''
  );
  html = html.replace(
    /\s*<a class="site-btn" href="\.\.\/luena\/"[^>]*>Luena<\/a>/g, ''
  );

  // Update active month in the map popup (hardcoded worker count etc.)
  // These are cosmetic; the popup shows last-month data from JSON
  const lastM = json.meses[Object.keys(json.meses).pop()];
  if (lastM) {
    // Update popup pkv values: workers, checklist, accidents, alcoolemia
    html = html.replace(
      /(<div class="pkv" style="color:#BF5FFF">)\d+(<\/div><div class="pkl">Trabalhadores)/,
      `$1${lastM.trabalhadores}$2`
    );
    html = html.replace(
      /(<div class="pkv" style="color:#FFD000">)\d+\.\d+%(<\/div><div class="pkl">Checklist)/,
      `$1${lastM.checklist}%$2`
    );
    html = html.replace(
      /(<div class="pkv" style="color:#00F5FF">)\d+(<\/div><div class="pkl">Alc\. Neg\.)/,
      `$1${lastM.alcoolemia.testes ?? 0}$2`
    );
  }

  return html;
}

// ─── Build Luena ──────────────────────────────────────────────────────────────

function buildLuena() {
  const json = readJson('dados/obras/luena.json');
  let html = readFile('luena/index.html');

  const monthEntries = Object.entries(json.meses);
  const shortKeys = monthEntries.map(([iso]) => isoToShort(iso));
  const lastKey = shortKeys[shortKeys.length - 1];

  // Generate MONTHS, M_LABEL, M_ABR, M_YEAR arrays/objects
  const monthsArr = `['${shortKeys.join("','")}']`;
  const mLabelPairs = shortKeys.map(k => `  ${k}:'${SHORT_LABEL[k]}'`).join(', ');
  const mAbrPairs   = shortKeys.map(k => `  ${k}:'${SHORT_ABR[k]}'`).join(', ');
  const mYearPairs  = shortKeys.map(k => `  ${k}:'${SHORT_YEAR[k]}'`).join(', ');

  // Data entries
  const dataLines = monthEntries.map(([iso, m]) => {
    const key = isoToShort(iso);
    return `  ${key}: ${cabindaLuenaMonthEntry(m, true)}`;
  }).join(',\n');

  // Build replacement block
  const newDataBlock = `const MONTHS = ${monthsArr};

const M_LABEL = {
${mLabelPairs}
};
const M_ABR = {
${mAbrPairs}
};
const M_YEAR = {
${mYearPairs}
};

/* Real data from HMRL files — auto-generated by build.mjs */
const DATA = {
${dataLines}
};

let currMonth = '${lastKey}';`;

  // Find old block: from "const MONTHS = [" through "let currMonth = ..."
  const oldStart = html.indexOf('const MONTHS = [');
  if (oldStart === -1) throw new Error('Luena: cannot find "const MONTHS = ["');

  const currMonthIdx = html.indexOf("let currMonth = '", oldStart);
  if (currMonthIdx === -1) throw new Error('Luena: cannot find "let currMonth"');
  const currMonthEnd = html.indexOf('\n', currMonthIdx) + 1;

  html = html.slice(0, oldStart) + newDataBlock + '\n' + html.slice(currMonthEnd);

  // Update hardcoded month buttons in the HTML nav
  const firstMbtn = html.indexOf('<button class="mbtn"');
  if (firstMbtn !== -1) {
    const navStart = html.lastIndexOf('<nav', firstMbtn);
    const navEnd   = html.indexOf('</nav>', firstMbtn) + '</nav>'.length;
    if (navStart !== -1 && navEnd > navStart) {
      const newNav = html.slice(navStart, html.indexOf('>', navStart) + 1) + '\n' +
        shortKeys.map(k =>
          `      <button class="mbtn${k === lastKey ? ' active' : ''}" onclick="setMonth('${k}',this)">${SHORT_LABEL[k]}</button>`
        ).join('\n') + '\n    </nav>';
      html = html.slice(0, navStart) + newNav + html.slice(navEnd);
    }
  }

  // Remove cross-site navigation
  html = html.replace(
    /\s*<a class="site-btn" href="\.\.\/"[^>]*>Huambo<\/a>/g, ''
  );
  html = html.replace(
    /\s*<a class="site-btn" href="\.\.\/cabinda\/"[^>]*>Cabinda<\/a>/g, ''
  );

  // Update map popup to reflect last month
  const lastM = json.meses[Object.keys(json.meses).pop()];
  if (lastM) {
    html = html.replace(
      /(<div class="pkv" style="color:#39FF14">)\d+(<\/div><div class="pkl">Trabalhadores)/,
      `$1${lastM.trabalhadores}$2`
    );
    html = html.replace(
      /(<div class="pkv" style="color:#FFD000">)\d+\.\d+%(<\/div><div class="pkl">Checklist)/,
      `$1${lastM.checklist}%$2`
    );
    // Hours worked
    const hrs = lastM.sinistralidade?.horas;
    if (hrs != null) {
      html = html.replace(
        /(<div class="pkv" style="color:#00F5FF">)[\d,\.]+(<\/div><div class="pkl">H\. Trabalhadas)/,
        `$1${hrs.toLocaleString('pt-PT')}$2`
      );
    }
  }

  // Update footer status text to reflect last month
  html = html.replace(
    /document\.getElementById\('footer-status'\)\.textContent = '.*?';/,
    `document.getElementById('footer-status').textContent = '✓ Atualizado · ${SHORT_LABEL[lastKey]} · 0 Acidentes Mortais';`
  );

  // Update period pill text
  const firstLabel = SHORT_ABR[shortKeys[0]] + ' ' + SHORT_YEAR[shortKeys[0]];
  const lastLabel  = SHORT_ABR[lastKey] + ' ' + SHORT_YEAR[lastKey];
  html = html.replace(
    /document\.getElementById\('period-pill'\)\.textContent = '.*?';/,
    `document.getElementById('period-pill').textContent = '${firstLabel} → ${lastLabel}';`
  );

  return html;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const sites = [
    { name: 'huambo', builder: buildHuambo, outPath: 'dist/huambo/index.html' },
    { name: 'cabinda', builder: buildCabinda, outPath: 'dist/cabinda/index.html' },
    { name: 'luena',  builder: buildLuena,  outPath: 'dist/luena/index.html'  },
  ];

  for (const { name, builder, outPath } of sites) {
    try {
      console.log(`Building ${name}...`);
      const html = builder();
      mkdirp(`dist/${name}`);
      writeFile(outPath, html);
      const lines = html.split('\n').length;
      console.log(`  ✓ ${outPath}  (${lines} lines, ${(html.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log('\nDone.');
}

main();
