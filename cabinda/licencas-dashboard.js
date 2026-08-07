(function () {
  const API = "/api/licencas/";
  const STATUS_CLASSES = ["vrf-lic--ok", "vrf-lic--warn", "vrf-lic--bad", "vrf-lic--unknown", "hp-lic--ok", "hp-lic--warn", "hp-lic--bad", "hp-lic--unknown"];
  const SITE = detectSite();
  let cache = [];

  function detectSite() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/luena")) return { code: "HMRL", name: "Luena" };
    if (path.includes("/cabinda")) return { code: "HMRC", name: "Cabinda" };
    return { code: "HMRH", name: "Huambo" };
  }

  function injectStyles() {
    if (document.getElementById("lic-admin-style")) return;
    const style = document.createElement("style");
    style.id = "lic-admin-style";
    style.textContent = `
.lic-admin-btn{margin-left:auto;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:inherit;border-radius:7px;padding:6px 9px;font:700 10px/1.1 var(--vrf-mono,var(--hp-mono,ui-monospace));letter-spacing:.04em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
.lic-admin-btn:hover{background:rgba(255,255,255,.12)}
.lic-file-row{grid-column:2/4;display:flex;align-items:center;gap:6px;min-width:0;margin-top:2px;font-family:var(--vrf-mono,var(--hp-mono,ui-monospace))}
.lic-file-state{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--vrf-text-muted,var(--hp-muted,#8a9bb0));font-size:9.5px}
.lic-file-state.has-file{color:#22c55e}.lic-file-state.no-file{color:#f59e0b}
.lic-file-open,.lic-file-edit{flex:0 0 auto;border:1px solid rgba(148,163,184,.35);background:rgba(255,255,255,.06);color:inherit;border-radius:6px;padding:3px 6px;font:800 9px/1 var(--vrf-mono,var(--hp-mono,ui-monospace));letter-spacing:.04em;text-transform:uppercase;text-decoration:none;cursor:pointer}
.lic-file-open:hover,.lic-file-edit:hover{background:rgba(255,255,255,.13)}
.lic-admin-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(3,7,18,.68);padding:18px}
.lic-admin-modal.open{display:flex}
.lic-admin-card{width:min(560px,100%);background:#111827;color:#e5eef8;border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:18px;box-shadow:0 24px 70px rgba(0,0,0,.45);font-family:var(--vrf-mono,var(--hp-mono,ui-monospace))}
.lic-admin-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:14px}
.lic-admin-head h3{margin:0;font-size:15px;color:#fff}.lic-admin-head p{margin:4px 0 0;color:#9ca3af;font-size:11px;line-height:1.4}
.lic-admin-close{border:0;background:transparent;color:#9ca3af;font-size:22px;line-height:1;cursor:pointer}
.lic-admin-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.lic-admin-form label{display:grid;gap:5px;color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:.05em}
.lic-admin-form label.full{grid-column:1/-1}.lic-admin-form input,.lic-admin-form select,.lic-admin-form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(0,0,0,.28);color:#fff;padding:9px 10px;font:500 13px/1.2 inherit}
.lic-admin-form input[type=file]{padding:8px;background:rgba(14,165,233,.08);border-color:rgba(14,165,233,.32)}
.lic-admin-form textarea{min-height:58px;resize:vertical}.lic-admin-current{grid-column:1/-1;display:none;color:#9ca3af;font-size:11px;line-height:1.4}
.lic-admin-current.show{display:block}.lic-admin-current a{color:#7dd3fc;text-decoration:none}.lic-admin-current a:hover{text-decoration:underline}
.lic-admin-actions{grid-column:1/-1;display:flex;gap:8px;margin-top:4px}
.lic-admin-actions button{flex:1;border:0;border-radius:7px;padding:10px;font:800 12px/1 inherit;cursor:pointer}.lic-admin-save{background:#0ea5e9;color:#fff}.lic-admin-cancel{background:transparent;color:#cbd5e1;border:1px solid rgba(255,255,255,.14)!important}
.lic-admin-msg{grid-column:1/-1;display:none;border-radius:7px;padding:9px 10px;font-size:12px}.lic-admin-msg.ok{display:block;background:rgba(16,185,129,.16);color:#86efac}.lic-admin-msg.err{display:block;background:rgba(239,68,68,.16);color:#fecaca}
@media(max-width:620px){.lic-admin-form{grid-template-columns:1fr}.lic-admin-btn{margin-left:0}.lic-file-row{grid-column:1/4;flex-wrap:wrap}.lic-file-state{flex-basis:100%}}
`;
    document.head.appendChild(style);
  }

  function fmt(dateText) {
    if (!dateText) return "-";
    const d = new Date(`${dateText}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
  }

  function statusInfo(item) {
    const days = Number(item.dias_restantes);
    if (item.estado === "expirada") return { cls: "bad", label: `Expirada há ${Math.abs(days)} dia(s)` };
    if (item.estado === "critica") return { cls: "bad", label: `Expira em ${days} dia(s)` };
    if (item.estado === "a_expirar") return { cls: "warn", label: `Expira em ${days} dia(s)` };
    if (item.estado === "vigente") return { cls: "ok", label: `Vigente · ${days} dia(s) restantes` };
    return { cls: "unknown", label: "Sem data" };
  }

  function fileHref(item) {
    const value = String(item.file_url || item.drive_file_id || "").trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    return `https://drive.google.com/file/d/${encodeURIComponent(value)}/view`;
  }

  function fileLabel(item) {
    if (item.file_name) return item.file_name;
    const href = fileHref(item);
    if (!href) return "";
    try {
      const bits = new URL(href).pathname.split("/").filter(Boolean);
      return decodeURIComponent(bits[bits.length - 1] || "ficheiro da licença");
    } catch (_) {
      return "ficheiro da licença";
    }
  }

  function getLicenseId(li, index) {
    const num = li.querySelector(".vrf-licencas-num,.hp-num");
    return String(li.dataset.licencaId || (num && num.textContent.trim()) || index + 1);
  }

  function updateSubtitle(card) {
    const subtitle = card.querySelector(".vrf-licencas-title-wrap p,.hp-licencas-head p");
    if (!subtitle) return;
    subtitle.textContent = `9 licenças físicas · Repositório de Licenças · ${SITE.code}`;
  }

  function updateFileActions(li, item) {
    let row = li.querySelector(".lic-file-row");
    if (!row) {
      row = document.createElement("span");
      row.className = "lic-file-row";
      li.appendChild(row);
    }
    row.textContent = "";

    const href = fileHref(item);
    const state = document.createElement("span");
    state.className = `lic-file-state ${href ? "has-file" : "no-file"}`;
    state.textContent = href ? `Ficheiro: ${fileLabel(item)}` : "Sem ficheiro físico inserido";
    row.appendChild(state);

    if (href) {
      const open = document.createElement("a");
      open.className = "lic-file-open";
      open.href = href;
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "Abrir";
      row.appendChild(open);
    }

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "lic-file-edit";
    edit.textContent = href ? "Actualizar" : "Inserir";
    edit.addEventListener("click", () => openModal(item.id));
    row.appendChild(edit);
  }

  function updateCard(card, data) {
    const isVrf = card.classList.contains("vrf-licencas-card");
    const rowSelector = isVrf ? ".vrf-licencas-list li" : ".hp-licencas-list li";
    const nameSelector = isVrf ? ".vrf-licencas-name" : ".hp-name";
    const emSelector = isVrf ? ".vrf-lic-em" : ".hp-em";
    const exSelector = isVrf ? ".vrf-lic-ex" : ".hp-ex";
    const dotSelector = isVrf ? ".vrf-licencas-status" : ".hp-status";
    const prefix = isVrf ? "vrf" : "hp";

    updateSubtitle(card);
    card.querySelectorAll(rowSelector).forEach((li, index) => {
      const id = getLicenseId(li, index);
      li.dataset.licencaId = id;
      const item = data.find((entry) => String(entry.id) === id);
      if (!item) return;

      li.dataset.emitida = item.data_emissao || "";
      li.dataset.expiracao = item.data_expira || "";
      const name = li.querySelector(nameSelector);
      const em = li.querySelector(emSelector);
      const ex = li.querySelector(exSelector);
      const dot = li.querySelector(dotSelector);
      if (name) name.textContent = item.nome || `Licença ${id}`;
      if (em) em.textContent = fmt(item.data_emissao);
      if (ex) ex.textContent = fmt(item.data_expira);
      STATUS_CLASSES.forEach((cls) => li.classList.remove(cls));
      const status = statusInfo(item);
      li.classList.add(`${prefix}-lic--${status.cls}`);
      if (dot) dot.setAttribute("title", status.label);
      updateFileActions(li, item);
    });
  }

  function fillSelect(select) {
    select.textContent = "";
    cache.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.id} · ${item.nome}`;
      select.appendChild(option);
    });
  }

  function ensureModal() {
    let modal = document.getElementById("lic-admin-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "lic-admin-modal";
    modal.className = "lic-admin-modal";
    modal.innerHTML = `
<div class="lic-admin-card" role="dialog" aria-modal="true" aria-labelledby="lic-admin-title">
  <div class="lic-admin-head">
    <div><h3 id="lic-admin-title">Repositório de Licenças</h3><p>Insere o ficheiro físico da licença e mantém as datas por site. A password fica só no servidor.</p></div>
    <button class="lic-admin-close" type="button" aria-label="Fechar">×</button>
  </div>
  <form class="lic-admin-form">
    <input name="site" type="hidden">
    <input name="file_url" type="hidden">
    <input name="file_name" type="hidden">
    <input name="mime_type" type="hidden">
    <label>Licença<select name="id" required></select></label>
    <label>Password admin<input name="password" type="password" autocomplete="current-password" required></label>
    <label class="full">Autor / responsável<input name="autor" autocomplete="name" placeholder="Nome de quem envia"></label>
    <label class="full">Nome<input name="nome" required minlength="3"></label>
    <label>Data emissão<input name="data_emissao" type="date"></label>
    <label>Data expiração<input name="data_expira" type="date"></label>
    <label class="full">Ficheiro físico da licença<input name="ficheiro" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx,.xls,.xlsx,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></label>
    <div class="lic-admin-current"></div>
    <label class="full">Observações<textarea name="observacoes"></textarea></label>
    <div class="lic-admin-msg"></div>
    <div class="lic-admin-actions"><button class="lic-admin-cancel" type="button">Cancelar</button><button class="lic-admin-save" type="submit">Guardar licença</button></div>
  </form>
</div>`;
    document.body.appendChild(modal);

    const form = modal.querySelector("form");
    const close = () => modal.classList.remove("open");
    modal.querySelector(".lic-admin-close").addEventListener("click", close);
    modal.querySelector(".lic-admin-cancel").addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    form.elements.id.addEventListener("change", () => fillForm(form, form.elements.id.value));
    form.addEventListener("submit", saveLicense);
    return modal;
  }

  function fillForm(form, id) {
    const item = cache.find((entry) => String(entry.id) === String(id)) || cache[0];
    if (!item) return;
    form.elements.site.value = SITE.code;
    form.elements.id.value = item.id;
    form.elements.nome.value = item.nome || "";
    form.elements.data_emissao.value = item.data_emissao || "";
    form.elements.data_expira.value = item.data_expira || "";
    form.elements.file_url.value = item.file_url || item.drive_file_id || "";
    form.elements.file_name.value = item.file_name || "";
    form.elements.mime_type.value = item.mime_type || "";
    form.elements.observacoes.value = item.observacoes || "";
    form.elements.ficheiro.value = "";
    if (form.elements.autor && !form.elements.autor.value) {
      form.elements.autor.value = localStorage.getItem("vamedLicencaAutor") || "";
    }

    const current = form.querySelector(".lic-admin-current");
    const href = fileHref(item);
    current.className = href ? "lic-admin-current show" : "lic-admin-current";
    current.textContent = "";
    if (href) {
      current.append("Ficheiro actual: ");
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = fileLabel(item);
      current.appendChild(a);
    }
  }

  async function saveLicense(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = form.querySelector(".lic-admin-msg");
    const submit = form.querySelector(".lic-admin-save");
    msg.className = "lic-admin-msg";
    msg.textContent = "";
    submit.disabled = true;
    submit.textContent = "A guardar...";
    try {
      const payload = new FormData(form);
      payload.set("site", SITE.code);
      const autor = String(payload.get("autor") || "").trim();
      if (autor) localStorage.setItem("vamedLicencaAutor", autor);
      if (!form.elements.ficheiro.files.length) payload.delete("ficheiro");
      const res = await fetch(API, { method: "POST", body: payload });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao guardar licença.");
      await loadLicenses();
      fillSelect(form.elements.id);
      fillForm(form, json.data?.id || payload.get("id"));
      msg.className = "lic-admin-msg ok";
      msg.textContent = "Licença actualizada no repositório.";
    } catch (err) {
      msg.className = "lic-admin-msg err";
      msg.textContent = err.message;
    } finally {
      submit.disabled = false;
      submit.textContent = "Guardar licença";
    }
  }

  function openModal(id) {
    const modal = ensureModal();
    const form = modal.querySelector("form");
    fillSelect(form.elements.id);
    fillForm(form, id || form.elements.id.value || "1");
    modal.classList.add("open");
    setTimeout(() => form.elements.password.focus(), 80);
  }

  function mountAdminButton(card) {
    const header = card.querySelector(".vrf-licencas-head,.hp-licencas-head");
    if (!header || header.querySelector(".lic-admin-btn")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lic-admin-btn";
    button.textContent = "Inserir";
    button.title = `Inserir licenças físicas em ${SITE.name}`;
    button.addEventListener("click", () => openModal("1"));
    header.appendChild(button);
  }

  async function loadLicenses() {
    const url = `${API}?site=${encodeURIComponent(SITE.code)}`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Erro ao carregar licenças.");
    cache = Array.isArray(json.data) ? json.data : [];
    document.querySelectorAll(".vrf-licencas-card,.hp-licencas").forEach((card) => {
      updateCard(card, cache);
      mountAdminButton(card);
    });
  }

  function init() {
    injectStyles();
    loadLicenses().catch((err) => {
      console.warn("[licencas]", err.message);
      document.querySelectorAll(".vrf-licencas-card,.hp-licencas").forEach((card) => {
        updateSubtitle(card);
        mountAdminButton(card);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
