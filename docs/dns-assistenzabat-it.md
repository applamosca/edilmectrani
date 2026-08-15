# DNS `assistenzabat.it` — stato e procedure

> Aggiornato al **15 agosto 2026**. Sostituisce la nota di ripresa
> *"Token Cloudflare MCP (v2)"*, che conteneva due assunzioni errate —
> corrette qui sotto.

---

## 1. Accesso Cloudflare — risolto

Il token in `CLOUDFLARE_API_TOKEN` **funziona**. Verificato contro
`GET /client/v4/zones` → `HTTP 200`.

| | |
|---|---|
| Zona | `assistenzabat.it` |
| Zone ID | `918f8b03829e983d28d043c0e0f99d35` |
| Account | `3645bbcb6bea15d821ff4e8ef40f5c1a` |
| Stato zona | `active` |
| Nameserver attivi | `pablo.ns.cloudflare.com`, `teresa.ns.cloudflare.com` |
| NS originari | IONOS (`ui-dns.{com,org,de,biz}`) |
| Piano | Free Website |

Permessi effettivi del token: `#zone:read`, `#zone:edit`, `#zone_settings:edit`,
`#dns_records:read`, `#dns_records:edit` (+ altri). Sufficienti per tutte le
operazioni DNS descritte in questo documento.

### ⚠️ Il server MCP `cloudflare` non esiste in queste sessioni

La nota precedente dava per scontato l'uso di `mcp__cloudflare__*`. Quei tool
**non sono collegati** all'ambiente (né `ionos`). Non serve inseguire il bug di
`verify_token`: si usa l'API REST direttamente.

```bash
# Elenco zone
curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones?per_page=50"

# Elenco record della zona
ZONE=918f8b03829e983d28d043c0e0f99d35
curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records?per_page=200"
```

Nota storica sul token `cfat_`: la diagnosi originale era corretta. Un token
account-owned viene sempre rifiutato da `/user/tokens/verify`, anche se valido.
Ma il punto è ormai accademico — il token attuale è un token utente e passa.

---

## 2. Stato DNS attuale

### Record TXT

| Nome | Contenuto | TTL |
|---|---|---|
| `assistenzabat.it` | `v=spf1 include:_spf-eu.ionos.com ~all` | auto |
| `_dmarc.assistenzabat.it` | `v=DMARC1; p=none; rua=mailto:postmaster@assistenzabat.it` | 3600 |
| `_lovable.assistenzabat.it` | `lovable_verify=c65368d7…aed72` | 3600 |
| `_lovable.www.assistenzabat.it` | `lovable_verify=9a8273d2…5405c` | 3600 |

### Altri record rilevanti

| Tipo | Nome | Contenuto | Note |
|---|---|---|---|
| A | `assistenzabat.it` | `185.158.133.1` | IP Lovable, non proxato |
| A | `www.assistenzabat.it` | `185.158.133.1` | IP Lovable, non proxato |
| A | `storage.assistenzabat.it` | `161.97.179.26` | VPS Contabo, non proxato |
| MX | `assistenzabat.it` | `mx00.ionos.it`, `mx01.ionos.it` | priorità 10 |
| CNAME | `autodiscover` | `adsredir.ionos.info` | proxato |
| CNAME | `_domainconnect` | `_domainconnect.ionos.com` | proxato |
| NS | `assistenzabat.it` | 4× `ui-dns.*` | **residui import IONOS** |

---

## 3. ❌ Correzione: i record `_lovable` NON vanno cancellati

La nota precedente li trattava come residui inerti da rimuovere. **Non lo sono.**

Il dominio è il custom domain del progetto Lovable **`bat-tech-prompt`**
("BAT IT Architect", `https://bat-tech-prompt.lovable.app`, pubblicato).
I record A puntano a `185.158.133.1`, che è l'IP edge di Lovable, e il sito
risponde in produzione:

```
https://assistenzabat.it       → HTTP/2 200
https://www.assistenzabat.it   → HTTP/2 302 → https://assistenzabat.it/
```

I due TXT sono la **prova di proprietà attiva** del dominio custom.
Cancellarli può de-verificare il dominio su Lovable e far cadere il sito.

**Vanno rimossi solo dopo** aver migrato il sito fuori da Lovable e aver
ripuntato i record A altrove. Non prima.

---

## 4. Email — SPF ok, DKIM mancante

| Meccanismo | Stato |
|---|---|
| SPF | ✅ presente — `v=spf1 include:_spf-eu.ionos.com ~all` |
| DKIM | ❌ **assente** — nessun record `*._domainkey` |
| DMARC | ✅ presente — `p=none` (solo monitoraggio) |

### Perché DKIM manca, e perché non si risolve da solo

La delega DNS è passata a Cloudflare. **IONOS non può più pubblicare
automaticamente i propri record DKIM**, perché non controlla più la zona.
Il pannello IONOS mostrerà i valori ma non riuscirà a scriverli.

Procedura:

1. Pannello mail IONOS → dominio `assistenzabat.it` → attiva DKIM.
2. Copia i record che IONOS restituisce (tipicamente CNAME su
   `s1._domainkey` / `s2._domainkey`, oppure un TXT con la chiave pubblica).
3. Inseriscili **a mano su Cloudflare**, es.:

```bash
ZONE=918f8b03829e983d28d043c0e0f99d35
curl -sS -X POST \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"type":"CNAME","name":"s1._domainkey","content":"<valore_da_ionos>","ttl":3600,"proxied":false}' \
  "https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records"
```

⚠️ I record DKIM **non vanno proxati** (`proxied: false`).

4. Attendi la propagazione, poi verifica che una mail di test superi sia SPF
   sia DKIM con allineamento sul dominio `assistenzabat.it`.

### Sul DMARC attuale

`p=none` è la scelta corretta per partire: raccoglie i report aggregati senza
bloccare nulla. Ma finché DKIM manca, l'allineamento poggia sul solo SPF —
il DMARC **non sta proteggendo il dominio**, sta solo osservando.

Percorso di irrigidimento, una volta che DKIM è attivo e i report sono puliti:

```
p=none  →  p=quarantine; pct=10  →  p=quarantine  →  p=reject
```

Non saltare passaggi, e non muoversi finché i report `rua` non mostrano
allineamento stabile per tutte le sorgenti legittime.

---

## 5. Pulizia opzionale

I 4 record `NS` con i nameserver IONOS (`ui-dns.*`) sono residui dell'import.
La delega reale è su Cloudflare e la zona è `active`, quindi sono **innocui** —
ma sono sporcizia e possono confondere una diagnosi futura. Rimuovibili in
sicurezza in qualsiasi momento.

---

## 6. Sicurezza

- Le variabili d'ambiente degli ambienti cloud sono **in chiaro**, senza
  secrets store, leggibili da chiunque usi l'ambiente. Non è cifratura.
- Il vecchio token account-owned `frosty-wind-34c4` (`cfat_`) è passato per
  screenshot e log di chat → **va revocato**, non serve più.
- Il token utente attuale ha TTL breve: lasciarlo scadere, o revocarlo a
  operazioni concluse.
- Non committare mai il valore di `CLOUDFLARE_API_TOKEN` in questo repo.

---

## 7. Nota sulla collocazione

Questo repo è **`edilmectrani`** (progetto Lovable *Edilmec Precision*), mentre
`assistenzabat.it` appartiene al progetto **`bat-tech-prompt`**. Il documento è
qui perché è qui che è stato prodotto il lavoro; la sua sede naturale sarebbe il
repo del progetto BAT, se e quando ne esisterà uno.

---

## Changelog operativo

| Data | Operazione | Esito |
|---|---|---|
| 2026-08-15 | Verifica token via `GET /zones` | ✅ HTTP 200 |
| 2026-08-15 | Creazione `_dmarc` TXT, `p=none`, TTL 3600 | ✅ `06a435fe5a8522157fcdb665ac4c0d0b` |
| 2026-08-15 | Cancellazione record `_lovable` | ⛔ **non eseguita** — sito in produzione su Lovable |
