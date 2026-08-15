# DNS `assistenzabat.it` — stato e procedure

> Aggiornato al **15 agosto 2026**. Sostituisce la nota di ripresa
> *"Token Cloudflare MCP (v2)"*, che conteneva due assunzioni errate —
> corrette qui sotto.

---

## 1. Registrar ≠ DNS — chi controlla cosa

È la distinzione da cui discende tutto il resto di questo documento, ed è la
fonte più comune di confusione su questo dominio.

| | Dove | Cosa fa |
|---|---|---|
| **Registrar** | IONOS | Possiede il contratto, rinnova il dominio, decide *a chi delegare* il DNS, pubblica il record DS per DNSSEC |
| **DNS autoritativo** | **Cloudflare** | Contiene i record veri, risponde alle interrogazioni del mondo |

Il dominio è **registrato** presso IONOS, ma il suo **DNS è su Cloudflare**.
IONOS lo dichiara esplicitamente nella scheda Nameserver:

> *"Stai utilizzando name server personali"*
> `teresa.ns.cloudflare.com` — Personalizzato
> `pablo.ns.cloudflare.com` — Personalizzato

Quella pagina è l'ultima cosa che IONOS controlla sul lato DNS: il cartello che
dice "per questo dominio, chiedete a Cloudflare".

**Conseguenze pratiche:**

- Ogni modifica ai record va fatta **su Cloudflare**. La tabella DNS nel pannello
  IONOS è inerte — lo dichiara essa stessa in cima:
  *"Quando utilizzi un name server personale, le impostazioni DNS di IONOS non
  sono attive"*.
- IONOS non può auto-pubblicare i propri record (DKIM in primis): li elenca
  soltanto, e vanno replicati a mano su Cloudflare. Vedi §5.
- Restano di competenza IONOS solo due cose: **la delega dei nameserver** e
  **il record DS di DNSSEC**. Vedi §6.

### ⛔ Il pulsante da non premere

Nella scheda Nameserver, accanto a "Modifica name server", c'è
**"Ripristina il name server"**. Riporta la delega a IONOS e in un click
azzera tutto: sito giù (spariscono i record A verso Lovable), SPF, DKIM,
DMARC e verifiche `_lovable`. Non esiste uno scenario in cui vada premuto
senza aver prima pianificato la migrazione completa.

### Nessuna API IONOS disponibile

L'ambiente non ha né tool MCP `ionos` né credenziali IONOS (`IONOS_API_KEY`,
`IONOS_TOKEN`, ecc. — tutte assenti). Tutto ciò che è di competenza del
registrar va fatto **a mano dal pannello**.

---

## 2. Accesso Cloudflare

Il token in `CLOUDFLARE_API_TOKEN` **funziona**. Verificato contro
`GET /client/v4/zones` → `HTTP 200`.

| | |
|---|---|
| Zona | `assistenzabat.it` |
| Zone ID | `918f8b03829e983d28d043c0e0f99d35` |
| Account | `3645bbcb6bea15d821ff4e8ef40f5c1a` |
| Stato zona | `active` |
| Nameserver attivi | `pablo.ns.cloudflare.com`, `teresa.ns.cloudflare.com` |
| Piano | Free Website |

Permessi effettivi del token: `#zone:read`, `#zone:edit`, `#zone_settings:edit`,
`#dns_records:read`, `#dns_records:edit` (+ altri). Sufficienti per tutte le
operazioni DNS descritte qui.

### ⚠️ Il server MCP `cloudflare` non esiste in queste sessioni

La nota precedente dava per scontato l'uso di `mcp__cloudflare__*`. Quei tool
**non sono collegati** all'ambiente. Non serve inseguire il bug di
`verify_token`: si usa l'API REST direttamente.

```bash
ZONE=918f8b03829e983d28d043c0e0f99d35
curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records?per_page=200"
```

Nota storica sul token `cfat_`: la diagnosi originale era corretta — un token
account-owned viene sempre rifiutato da `/user/tokens/verify` anche se valido.
Ma il punto è ormai accademico: il token attuale è un token utente e passa.

---

## 3. Stato DNS attuale

### Record TXT

| Nome | Contenuto | TTL |
|---|---|---|
| `assistenzabat.it` | `v=spf1 include:_spf-eu.ionos.com ~all` | auto |
| `_dmarc.assistenzabat.it` | `v=DMARC1; p=none; rua=mailto:postmaster@assistenzabat.it` | 3600 |
| `_lovable.assistenzabat.it` | `lovable_verify=c65368d7…aed72` | 3600 |
| `_lovable.www.assistenzabat.it` | `lovable_verify=9a8273d2…5405c` | 3600 |

I record DKIM sono CNAME, non TXT — vedi sotto e §5.

### Altri record rilevanti

| Tipo | Nome | Contenuto | Note |
|---|---|---|---|
| A | `assistenzabat.it` | `185.158.133.1` | IP Lovable, non proxato |
| A | `www.assistenzabat.it` | `185.158.133.1` | IP Lovable, non proxato |
| A | `storage.assistenzabat.it` | `161.97.179.26` | VPS Contabo, non proxato |
| MX | `assistenzabat.it` | `mx00.ionos.it`, `mx01.ionos.it` | priorità 10 |
| CNAME | `s1-ionos._domainkey` | `s1.dkim.ionos.com` | DKIM, non proxato |
| CNAME | `s2-ionos._domainkey` | `s2.dkim.ionos.com` | DKIM, non proxato |
| CNAME | `s42582890._domainkey` | `s42582890.dkim.ionos.com` | ⚠️ selettore orfano, vedi §5 |
| CNAME | `autodiscover` | `adsredir.ionos.info` | proxato |
| CNAME | `_domainconnect` | `_domainconnect.ionos.com` | proxato |
| NS | `assistenzabat.it` | 4× `ui-dns.*` | residui import IONOS, innocui |

---

## 4. ❌ Correzione: i record `_lovable` NON vanno cancellati

La nota precedente li trattava come residui inerti da rimuovere. **Non lo sono.**

Il dominio è il custom domain del progetto Lovable **`bat-tech-prompt`**
("BAT IT Architect", `https://bat-tech-prompt.lovable.app`, pubblicato).
I record A puntano a `185.158.133.1`, IP edge di Lovable, e il sito risponde
in produzione:

```
https://assistenzabat.it       → HTTP/2 200
https://www.assistenzabat.it   → HTTP/2 302 → https://assistenzabat.it/
```

I due TXT sono la **prova di proprietà attiva** del dominio custom.
Cancellarli può de-verificare il dominio su Lovable e far cadere il sito.

**Vanno rimossi solo dopo** aver migrato il sito fuori da Lovable e aver
ripuntato i record A altrove. Non prima.

---

## 5. Email — SPF, DKIM e DMARC attivi

| Meccanismo | Stato |
|---|---|
| SPF | ✅ `v=spf1 include:_spf-eu.ionos.com ~all` |
| DKIM | ✅ 2 selettori vivi (`s1-ionos`, `s2-ionos`) |
| DMARC | ✅ `p=none` (monitoraggio) |

### Perché DKIM andava copiato a mano

Vedi §1: la delega è su Cloudflare, quindi IONOS non può pubblicare i propri
record DKIM. Le chiavi restano di IONOS — è il loro mailserver che firma — ma
i CNAME che puntano a quelle chiavi devono stare dove i verificatori li
cercano, cioè su Cloudflare.

Valori replicati (dal pannello IONOS, 15/08/2026):

| Nome host | Valore |
|---|---|
| `s1-ionos._domainkey` | `s1.dkim.ionos.com` |
| `s2-ionos._domainkey` | `s2.dkim.ionos.com` |
| `s42582890._domainkey` | `s42582890.dkim.ionos.com` |

⚠️ Attenzione ai nomi: IONOS usa i selettori **`s1-ionos` / `s2-ionos`**, non
`s1` / `s2`. Un errore qui produce un DKIM silenziosamente rotto.

⚠️ I record DKIM **non vanno proxati** (`proxied: false`), altrimenti Cloudflare
li appiattisce e la catena si rompe.

```bash
ZONE=918f8b03829e983d28d043c0e0f99d35
curl -sS -X POST \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"type":"CNAME","name":"s1-ionos._domainkey","content":"s1.dkim.ionos.com","ttl":3600,"proxied":false}' \
  "https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records"
```

### Verifica end-to-end

Non basta che il record esista: va controllato che risolva fino a una chiave
reale. Senza `dig` disponibile, si usa DNS over HTTPS:

```bash
curl -sS -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=s1-ionos._domainkey.assistenzabat.it&type=TXT"
```

Risultato al 15/08/2026:

| Selettore | CNAME | Chiave |
|---|---|---|
| `s1-ionos` | ✅ risolve | ✅ `v=DKIM1; p=MIIBIjANBgkq…` |
| `s2-ionos` | ✅ risolve | ✅ `v=DKIM1; p=MIIBIjANBgkq…` |
| `s42582890` | ✅ risolve | ❌ **NXDOMAIN sul target** |

### ⚠️ `s42582890` è un selettore orfano

`s42582890.dkim.ionos.com` **non esiste** (NXDOMAIN). IONOS lo elenca nel
pannello ma non pubblica nessuna chiave lì — verosimilmente il residuo di una
configurazione dismessa.

È innocuo: i verificatori interrogano solo il selettore indicato nell'header
`DKIM-Signature`, e IONOS firma con `s1`/`s2`. Ma resta un CNAME penzolante,
candidato a confondere una diagnosi futura. Rimovibile in sicurezza.

### Sul DMARC

`p=none` raccoglie i report aggregati senza bloccare nulla. Ora che DKIM è
attivo l'allineamento poggia su due pilastri, quindi il DMARC ha qualcosa da
proteggere davvero — non è più solo osservazione.

Percorso di irrigidimento, quando i report `rua` saranno puliti:

```
p=none  →  p=quarantine; pct=10  →  p=quarantine  →  p=reject
```

Non saltare passaggi, e non muoversi finché i report non mostrano allineamento
stabile per tutte le sorgenti legittime.

### Prova finale (da fare)

Mandare una mail di test da `assistenzabat.it` verso Gmail e verificare negli
header originali: `spf=pass`, `dkim=pass` con `header.d=assistenzabat.it`,
`dmarc=pass`. È l'unica prova che chiude il cerchio.

---

## 6. DNSSEC — non attivabile con IONOS come registrar

**Esito al 15/08/2026: richiesta respinta. DNSSEC disattivato su Cloudflare.**

### Cronologia

| Ora | Evento |
|---|---|
| 20:46 | Richiesta DS inviata a `transfer@ionos.com` dall'indirizzo del contratto |
| 20:47 | Ack automatico IONOS (elaborazione dichiarata entro ~24h) |
| 21:10 | Risposta di IONOS: **rifiuto** |

Testo della risposta (Assistenza Clienti IONOS):

> *"Sono costretto ad informarLa che per i domini con TLD .it non è possibile
> l'attivazione del protocollo DNSSEC."*

### ⚠️ La motivazione data è falsa

Il ccTLD `.it` **supporta DNSSEC**. Registro .it lo ha introdotto anni fa e
pubblica linee guida per l'accreditamento dei registrar. Verifica empirica
(query DS via DoH, 15/08/2026):

| Dominio `.it` | Record DS |
|---|---|
| `nic.it` | ✅ `3974 13 2 b275e4dd…` |
| `registro.it` | ✅ `32095 13 2 f55b9b76…` |

Se `.it` non ammettesse DNSSEC, il registro stesso non potrebbe avere un DS
firmato nella zona radice.

### Cosa è vero, allora

L'ostacolo non è il TLD: è **IONOS**. Registro .it richiede che il registrar
superi un test di accreditamento DNSSEC per poter firmare i domini gestiti.
IONOS non offre il servizio sui `.it`, e l'operatore ha riportato la
limitazione del proprio pannello come se fosse una regola del registro.

La distinzione conta per una ragione pratica: **non è una porta chiusa in
assoluto**. Insistere con l'assistenza IONOS non serve — la limitazione è
strutturale dalla loro parte. L'unica strada per avere DNSSEC su questo dominio
è **trasferirlo a un registrar accreditato DNSSEC per `.it`**, decisione che
esula da questo intervento.

### Azione presa

DNSSEC **disattivato** sulla zona Cloudflare (`status: pending-disabled` →
`disabled`). Lasciarlo in `pending` sarebbe stato tecnicamente innocuo — senza
DS nel registro nessun resolver valida — ma avrebbe mostrato a tempo
indeterminato un'operazione incompiuta nel pannello.

Nessun impatto su sito o posta: la zona torna semplicemente non firmata,
esattamente come era prima del 15/08.

### Se un giorno si riprende (registrar accreditato)

I valori vanno **rigenerati**: riabilitando DNSSEC, Cloudflare produce una nuova
chiave. Quelli sotto sono storici, non riutilizzabili.

<details>
<summary>Valori generati il 15/08/2026 (obsoleti)</summary>

```
assistenzabat.it. 3600 IN DS 2371 13 2 27C2985ED939A6292F97378E4108F4C17A27AEB5FE64DB40CB33E9DE51A06C83
```

keyTag `2371`, alg `13`, digestType `2`, flags `257`, protocol `3`.

</details>

Avvertenza che resterebbe valida: **un DS errato non degrada, spegne**. I
resolver validanti rispondono `SERVFAIL` e il dominio sparisce. E finché un DS
è pubblicato non si cambiano i nameserver né si cancella la zona senza prima
rimuoverlo e attendere la propagazione.

Verifica, se mai servisse:

```bash
curl -sS -H "accept: application/dns-json" \
  "https://cloudflare-dns.com/dns-query?name=assistenzabat.it&type=DS"
```

---

## 7. Falsi allarmi del pannello IONOS

Il pannello mostra due avvisi rossi. Sono **upsell**, non diagnosi.

### "Il tuo dominio non dispone ancora di SSL" — falso

IONOS non può vedere certificati che non ha emesso lui. Verifica indipendente
sui log pubblici di Certificate Transparency (`crt.sh`), 15/08/2026:

| Nome | Emittente | Scadenza |
|---|---|---|
| `assistenzabat.it` | Google Trust Services | 10/10/2026 |
| `www.assistenzabat.it` | Google Trust Services | 09/10/2026 |
| `*.assistenzabat.it` | Google Trust Services | 09/10/2026 |
| `storage.assistenzabat.it` | Let's Encrypt | 16/10/2026 |

Il sito risponde `HTTP/2 200` con HSTS attivo. Un certificato IONOS sarebbe
denaro speso per qualcosa che esiste già, e per giunta non installabile: IONOS
non serve il sito.

### "Domain Guard" — opzionale

Prodotto a pagamento per la protezione da trasferimenti non autorizzati. Il
rischio è coperto in larga parte dal *transfer lock* standard, gratuito e di
norma già attivo (verificabile nella scheda "Trasferimento & Proroga" — non
verificabile da questo ambiente: le query RDAP al registro sono bloccate dal
proxy).

Priorità reale: **2FA sull'account IONOS** prima di Domain Guard. Protegge di
più e costa zero.

(La controindicazione su Domain Guard e il record DS è decaduta: IONOS non
attiva DNSSEC sui `.it` in nessun caso — vedi §6.)

---

## 8. Pulizia opzionale

- I 4 record `NS` con i nameserver IONOS (`ui-dns.*`) sono residui dell'import.
  La delega reale è su Cloudflare e la zona è `active`: innocui, ma sporcizia.
- Il CNAME `s42582890._domainkey` (§5), che punta a un host inesistente.

---

## 9. Sicurezza

- Le variabili d'ambiente degli ambienti cloud sono **in chiaro**, senza secrets
  store, leggibili da chiunque usi l'ambiente. Non è cifratura.
- Il vecchio token account-owned `frosty-wind-34c4` (`cfat_`) è passato per
  screenshot e log di chat → **va revocato**.
- Il token utente attuale ha TTL breve: lasciarlo scadere o revocarlo a
  operazioni concluse.
- Non committare mai il valore di `CLOUDFLARE_API_TOKEN` in questo repo.

---

## 10. Nota sulla collocazione

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
| 2026-08-15 | Cancellazione record `_lovable` | ⛔ **non eseguita** — sito in produzione |
| 2026-08-15 | Creazione 3 CNAME DKIM da pannello IONOS | ✅ creati, non proxati |
| 2026-08-15 | Verifica DKIM via DoH | ✅ `s1-ionos`, `s2-ionos` — ❌ `s42582890` NXDOMAIN |
| 2026-08-15 | Verifica certificati via Certificate Transparency | ✅ SSL valido, allarme IONOS infondato |
| 2026-08-15 | Abilitazione DNSSEC su Cloudflare | ✅ `pending` — DS key tag `2371` (poi annullata) |
| 2026-08-15 | Richiesta DS inviata a `transfer@ionos.com` | ✅ 20:46 da `pillo19@gmail.com`, ack 20:47 |
| 2026-08-15 | Risposta IONOS | ❌ 21:10 **rifiutata** — motivazione tecnicamente errata (vedi §6) |
| 2026-08-15 | Disattivazione DNSSEC su Cloudflare | ✅ `pending-disabled` |
| 2026-08-15 | Rimozione selettore orfano `s42582890` | ⏳ da decidere |
| — | Mail di test per `dkim=pass` / `dmarc=pass` | ⏳ da fare |
