# Arquitectura de Dados — Quatro Projectos HSE

## Objectivo

Substituir as quatro estruturas de dados ad-hoc (objecto `DATA` em JS,
números codificados no markup, `companiesByMonth`, `dailyByMonth`) por um
ficheiro JSON por obra em `dados/obras/<obra>.json`, com esquema uniforme
e regras de qualidade de dados explícitas.

## Localização dos ficheiros

```
dados/
  obras/
    cabinda.json   ← HMRC  12DC-DEI/SV/2021
    huambo.json    ← HMRH  13DC-DEI/SV/2021
    luena.json     ← HMRL  14DC-DEI/SV/2021
    (quarto proj)
```

## Chave de mês

Cada mês é chave ISO-8601 truncada ao mês: `"2026-06"`.  
Todos os meses do projecto existem como entradas, mesmo que a obra
esteja suspensa.

---

## Esquema por mês

```jsonc
{
  "relatorio": {
    "numero": 33,      // número do RM — null se não constar no HTML
    "revisao": "01"    // revisão — null se não constar
  },
  "estado": "activa",  // activa | suspensa | encerrada  (regra a)
  "trabalhadores": 71,
  "checklist": 96.23,  // percentagem, float
  "alcoolemia": {
    "testes": 77,
    "positivos": 0
  },
  "formacao": {
    "accoes": null,        // número de acções/sessões
    "participantes": 982
  },
  "sinistralidade": {
    "acidentes": 0,
    "diasPerdidos": null,
    "acumulado": null,     // acidentes acumulados no projecto
    "indices": {
      "incidencia": null,
      "frequencia": null,
      "gravidade": null,
      "duracao": null
    }
  },
  "advertencias": {
    "mes": 0,
    "acumulado": 13
  },
  "ambiente": {
    "agua": {
      "mes": 64,
      "acumulado": 3420.6,
      "unidade": "m³"
    },
    "combustivel": {
      "mes": 5784,
      "acumulado": 416537,
      "unidade": "L"
    },
    "electricidade": {
      "mes": 1982.4,
      "acumulado": 61603.6,
      "unidade": "kWh"
    },
    "incidentes": 0
  },
  "empresas": [
    { "nome": "VAMED", "tipo": "Gestão do Projecto", "efectivos": 8 }
  ],
  "residuos": {
    "mensal": [
      { "tipo": "RSU", "quantidade": 76, "unidade": "kg", "acumulado": 9765, "acumulado_unidade": "kg" }
    ]
  },
  "eventos": [
    {
      "data": "2026-06-10",   // data própria do evento (regra c)
      "tipo": "Simulacro",
      "descricao": "Simulacro — queda de nível diferente",
      "estado": "Realizado",
      "responsavel": null
    }
  ],
  "documentos": [
    {
      "tipo": "DOC",
      "nome": "Relatório Mensal HSE RM Nº 033 · Junho 2026",
      "fonte": "Drive",
      "ref": "2026-06"
    }
  ]
}
```

---

## Cabeçalho do ficheiro

Cada `<obra>.json` tem um objecto raiz com metadados fixos e o mapa de meses:

```jsonc
{
  "obra": "HMRC",
  "nome": "Hospital Militar Regional de Cabinda",
  "contrato": "12DC – DEI/SV/2021",
  "coordenadas": [-5.5487, 12.1948],
  "meses": { ... }
}
```

---

## Quatro regras de qualidade

### a) `estado` por mês

Valor obrigatório num de três: `"activa"`, `"suspensa"`, `"encerrada"`.

- Luena Mai/Jun 2026 → `"suspensa"` (obra parada, actividade HSE
  mínima, sem testes de alcoolemia por ausência de actividade em exercício).
- Luena Abr 2026 → `"activa"` (wind-down, ainda com actividade residual — RM035).
- Luena Jul 2026 → `"activa"` (retoma de caretaker — RM038).
- Um mês `suspensa` **não** produz zeros nos gráficos — a UI deve
  excluir esses meses das médias e marcar as colunas como N/A.

### b) Campos ausentes são `null`, nunca `0`

`null` renderiza como traço ("—"); `0` afirma que o valor é zero.  
Água e combustível de Luena Abr e Mai não constam em nenhum documento
→ `null`.  
Um acidente zero confirmado → `0`.

### c) Eventos têm data própria

O campo `data` do evento reflecte a data em que o evento ocorreu,
**não** o mês do relatório em que foi mencionado.  
Se vários relatórios repetirem o mesmo evento, incluir apenas uma vez,
com a data real.  
Eventos sem data precisa usam `"YYYY-MM"` (mês).

### d) Índices de sinistralidade são campos individuais

```jsonc
"indices": {
  "incidencia": null,
  "frequencia": null,
  "gravidade": null,
  "duracao": null
}
```

Nunca um array ou um objecto genérico `{nome, valor}[]`.  
Nomes fixos eliminam o bug de Luena onde `frequencia` e `gravidade`
exibiam ambos o valor de `incidencia`.

---

## Fontes e precedência

1. **Documentos fonte confirmados** (mencionados em comentários JS ou
   nomes de ficheiro) têm precedência sobre valores estimados no `DATA`.
2. **DATA object** (JS) é a fonte primária para campos numéricos
   mensais.
3. **Markup hardcoded** (valores no HTML antes de o JS correr) deve
   coincidir com o DATA para o mesmo mês.  
   Se discordarem → anotar conflito, não escolher.
4. **Valores acumulados** no markup ambiental incluem período
   anterior ao intervalo coberto pelo `DATA` — preservar tal qual.

---

## Cobertura por obra (extraída)

| Obra | Código | Meses | Período |
|------|--------|-------|---------|
| Cabinda | HMRC | 11 | 2025-08 → 2026-06 |
| Huambo  | HMRH | 10 | 2025-09 → 2026-06 |
| Luena   | HMRL | 12 | 2025-08 → 2026-07 |
