# HomeZero Widget — upgrade 19 augustus 2026

Instructies voor het **Lovable widget-generator project**. Dit document beschrijft uitsluitend wat er
op 19 augustus 2026 aan de widget is veranderd en wat de generator daarvoor moet aanpassen.
Alle eerdere upgrade-context is bewust verwijderd: wat hier staat, is de huidige opdracht.

De volledige referentie van alle bestaande capabilities staat in **`LOVABLE_GENERATOR.md`**; alles
wat daar staat en hieronder niet genoemd wordt, blijft ongewijzigd. Waar dit document iets
tegenspreekt, wint dit document.

**Samenvatting.**

1. **CTA-modus per maatregel.** CTA1 en CTA2 kiezen elk hun eigen modus — `flow` (leadflow),
   `pico` (direct een lead inschieten) of `booking` (agendalink) — per maatregel, per combinatie
   of globaal. Voorheen was dit één globale keuze voor CTA2 en kon CTA1 alleen een leadflow.
2. **De combinatie wint.** Bij twee of meer geselecteerde maatregelen bepalen de combinatie-modus
   en -URL waar beide CTA's heen gaan, identiek voor tags, dropdown en grote tegels.
3. **De 2e CTA werkt zonder opt-in.** Eén doel is genoeg om de knop te laten zien; bij Pico is dat
   doel de modus zelf, want die heeft geen URL nodig. `data-cta2-show` wordt nooit meer geëmit.
4. **Een globale `data-cta2-url` is selectie-onafhankelijk** — zichtbaar en klikbaar vóór er iets
   gekozen is en bij elke maatregel.
5. **Drie nieuwe ingebouwde iconen**: `dynamicenergy` (bliksem), `combination` (duurzaam huis) en
   `servicemaintenance` (moersleutel). Elke maatregel heeft nu een eigen icoon.
6. **Nederlandse alias-keys** voor alle maatregelen, dus `data-tile-warmtepomp-url` krijgt hetzelfde
   icoon als `data-tile-heatpump-url`.
7. **Een mislukte Pico-inschieting valt nu terug op `offline.html`**, net als de leadflow, in plaats
   van dood te lopen in het formulier.
8. **De leadflow ontvangt de geselecteerde maatregelen** in `InterestedInMeasurements`, met de
   namen die de leadflow kent (`Heatpump,SolarPanel`). Altijd meegestuurd, ook bij één maatregel;
   de combinatie-flow koppelt er functioneel gedrag aan.
9. **Pico-routering per CTA, en een leadflow is verplicht.** De flow waaronder een client-side lead
   valt is per maatregel, per combinatie en globaal instelbaar via `-pico-flow-id`. Een Pico-CTA
   zonder oplosbare flow wordt niet meer gerenderd, zodat er nooit een onrouteerbare aanvraag
   uitgaat. `FlowsInterestedIn` bevat altijd de geselecteerde maatregelen — bij een combinatie komen
   ze alle mee. Daarnaast is een verzendfout gerepareerd: dat veld ging als lijst strings mee waar
   de API een lijst objecten verwacht.

---

## 1. CTA-modus per maatregel — `flow`, `pico` of `booking`

### 1.1 Wat er veranderd is

Vóór deze release was de CTA-modus één globale keuze: `data-cta2-action` gold voor de hele widget en
CTA1 kon alleen een leadflow openen (of een agenda, via de legacy `data-tile-{key}-booking-url`).
Per maatregel kon je alleen een URL zetten, niet wát ermee gebeurde.

Nu kiezen **CTA1 en CTA2 elk hun eigen modus, op elk niveau**. Drie modi:

| Modus | Wat het doet | Wat het nodig heeft |
|---|---|---|
| `flow` | HomeZero-leadflow met adres-, naam- en contactvalidatie, plus de `offline.html`-fallback | een leadflow-URL |
| `booking` | opent een externe agenda (Calendly, Google) in een nieuw tabblad, met naam/telefoon/e-mail als query-parameters | een agenda-URL |
| `pico` | schiet de lead client-side rechtstreeks in Pico en toont een bevestigingsscherm — geen redirect | **geen URL, maar wél een leadflow** (§1.6) |

Elke modus heeft dus een doel nodig, alleen niet hetzelfde soort doel. Zonder dat doel bestaat de
CTA niet: CTA2 wordt niet gerenderd, CTA1 weigert de klik.

Hiermee is het scenario uit de briefing mogelijk:

```html
  <!-- Thuisbatterij: CTA1 leadflow, CTA2 boekingslink -->
  data-tile-homebattery-url="https://go.hegg.energy/link/start?id=BAT"
  data-tile-homebattery-cta2-action="booking"
  data-tile-homebattery-cta2-url="https://calendly.com/hegg/thuisbatterij"

  <!-- Warmtepomp: CTA1 direct in Pico, CTA2 leadflow -->
  data-tile-heatpump-url="https://go.hegg.energy/link/start?id=WP"
  data-tile-heatpump-cta1-action="pico"
  data-tile-heatpump-cta2-action="flow"
  data-tile-heatpump-cta2-url="https://go.hegg.energy/link/start?id=WP-ADVIES"

  <!-- Pico-modus vereist een API-sleutel -->
  data-pico-key="..."
```

### 1.2 De attributen

| Niveau | CTA1 modus | CTA2 modus | CTA1 URL | CTA2 URL |
|---|---|---|---|---|
| Per maatregel | `data-tile-{key}-cta1-action` | `data-tile-{key}-cta2-action` | `data-tile-{key}-url` | `data-tile-{key}-cta2-url` |
| Combinatie (≥2 gekozen) | `data-cta1-combo-action` | `data-cta2-combo-action` | `data-cta1-combo-url` | `data-cta2-combo-url` |
| Globaal | `data-cta1-action` | `data-cta2-action` | `data-cta1-url` *(nieuw)* | `data-cta2-url` |

En voor de Pico-modus, die geen URL gebruikt maar een flow-id (zie §1.6):

| Niveau | CTA1 flow-id | CTA2 flow-id |
|---|---|---|
| Per maatregel | `data-tile-{key}-cta1-pico-flow-id` | `data-tile-{key}-cta2-pico-flow-id` |
| Combinatie (≥2 gekozen) | `data-cta1-combo-pico-flow-id` | `data-cta2-combo-pico-flow-id` |
| Globaal | `data-cta1-pico-flow-id` | `data-cta2-pico-flow-id` |
| Widget-breed (bestond al) | `data-pico-flow-id` | `data-pico-flow-id` |

Alles in beide tabellen is **nieuw** behalve `data-tile-{key}-url`, `data-tile-{key}-cta2-url`,
`data-cta1-combo-url`, `data-cta2-combo-url`, `data-cta2-url`, `data-cta2-action` en
`data-pico-flow-id`. Een onbekende modus wordt genegeerd (met een console-waarschuwing) en valt
terug op het niveau eronder — hij verandert nooit stil in iets anders. De flow-id-attributen
accepteren zowel een kaal id als een volledige leadflow-URL; uit een URL wordt de `id=`-parameter
gehaald, zodat de generator gewoon de gekozen leadflow-URL kan doorgeven.

### 1.3 Precedentie — één regel voor alles

Modus, URL, label én icoon volgen **exact dezelfde** volgorde. Dat is de hele mentale modelvoor de
partner: er is geen attribuut dat zich anders gedraagt dan zijn buren.

```
≥2 maatregelen gekozen  →  combinatie  →  globaal
 1 maatregel  gekozen   →  die maatregel  →  globaal
 0 maatregelen gekozen  →  globaal
```

Een niveau dat de modus leeg laat, **erft** hem van het niveau eronder. Zo zet een partner één
globale modus en overschrijft die alleen bij de maatregelen die afwijken.

**De combinatie wint van de maatregel én van globaal.** Zijn er twee of meer maatregelen
geselecteerd, dan luisteren CTA1 en CTA2 naar `data-cta1-combo-action` / `data-cta2-combo-action` en
de bijbehorende combo-URL — de eigen instellingen van de geselecteerde maatregelen worden dan
genegeerd. Dit werkt **identiek voor tags, dropdown en grote tegels**; het selectietype heeft geen
invloed op de CTA-routering.

Twee vangnetten, zodat een half-geconfigureerde widget nooit weigert:

- CTA1 zonder `data-cta1-combo-url` valt bij een combinatie terug op de **eerste** geselecteerde
  maatregel (en daarna op `data-cta1-url`).
- CTA2 zonder `data-cta2-combo-url` valt terug op de globale `data-cta2-url`.

### 1.4 Zichtbaarheid van de 2e CTA

CTA2 verschijnt zodra een selectie een doel oplevert. Een doel is een URL, of — bij modus `pico` —
een gekoppelde leadflow (§1.6). Dat maakt de generatorregel sluitend: **`data-cta2-show` wordt in
geen enkele configuratie geëmit**, ook niet bij Pico. Een Pico-CTA2 zonder leadflow blijft verborgen,
net als een booking-CTA2 zonder agenda-URL.

| Globale CTA2 | Per-maatregel CTA2 | Niets gekozen | Maatregel mét eigen CTA2 | Maatregel zónder eigen CTA2 |
|---|---|---|---|---|
| ✅ | ✅ | zichtbaar (globaal) | zichtbaar (eigen) | zichtbaar (globaal) |
| ✅ | ❌ | zichtbaar (globaal) | — | zichtbaar (globaal) |
| ❌ | ✅ | verborgen | zichtbaar (eigen) | verborgen |
| ❌ | ❌ | verborgen | — | verborgen |

Een globale CTA2 is bewust **selectie-onafhankelijk**: hij staat er vanaf het begin en klikt door
zonder dat de bezoeker eerst een maatregel hoeft te kiezen. De veldvalidatie blijft volledig gelden.
Een globale Pico-CTA2 gedraagt zich net zo — maar heeft dan een eigen `data-cta2-pico-flow-id` of
`data-pico-flow-id` nodig, want zonder selectie is er geen maatregel om de flow uit af te leiden.

`data-cta2-show="false"` blijft de kill-switch en is het enige geval waarin het attribuut nog iets
doet. Omdat de generator geen "CTA2 forceer uit"-schakelaar heeft, komt dat niet voor.

### 1.5 Regels voor de generator

| Onderwerp | Regel |
|---|---|
| `data-cta2-show` | **Nooit emitten.** Het bestaan van een doel bepaalt de zichtbaarheid, in álle modi inclusief Pico. |
| Action-attributen | **Emit de gekozen modus op het niveau waar de partner hem instelt** — ook als dat `flow` is. Expliciet `flow` uitschrijven is veilig en voorkomt dat een afwijkende globale modus doorlekt naar een maatregel. Laat het attribuut weg als de partner niets koos; dan erft dat niveau. |
| Standaardwaarde | Globaal is `flow` de default voor beide CTA's. Zet dat als voorselectie in de UI. |
| Pico | Emit `data-pico-key` (en `data-pico-env="acceptance"` buiten productie) zodra **enig** niveau op `pico` staat. Zonder sleutel kan de lead niet verstuurd worden. |
| Pico-routering | **Verplicht een leadflow bij elke Pico-keuze** en emit die als `-pico-flow-id` op hetzelfde niveau. De widget rendert een Pico-CTA zonder leadflow niet (§1.6). De waarde mag de leadflow-URL zelf zijn; de widget haalt de `id=` eruit. |
| Pico in brochure-modus | `data-pico-flow-id` is daar verplicht: geen maatregelen betekent geen terugval. |
| Pico + URL | Een URL naast een Pico-modus wordt **niet** genavigeerd; hij levert alleen de flow-id. Onveilige URL's worden genegeerd. Een expliciete `-pico-flow-id` wint hiervan. |
| Booking | Vereist een URL op hetzelfde niveau. Ontbreekt die, dan blijft CTA2 verborgen en weigert CTA1 met een console-waarschuwing. |
| Generieke 2e CTA | Zet het blok "Generieke 2e CTA (altijd zichtbaar)" **bovenaan** de CTA-sectie, met dezelfde drie keuzes als CTA1 en de hint dat één doel hier volstaat voor alle maatregelen. Geldt in beide modi (één maatregel én tegels). |
| Per-maatregel CTA2 | Hint: *"Laat leeg om de generieke 2e CTA te gebruiken. Vul alleen in als deze maatregel naar een ander doel moet."* |
| Samenvoegen | Staan alle per-maatregel CTA2-doelen op dezelfde waarde én dezelfde modus, schrijf dan één globale `data-cta2-url` (+ `data-cta2-action`) uit in plaats van N identieke per-maatregel attributen. Dat maakt de knop ook zichtbaar vóór de eerste keuze. |
| Combinatie-blok | Alleen tonen bij multi-select (`data-tiles-max-select` ≠ 1). Bied daar dezelfde drie modi aan, voor CTA1 en CTA2 apart. |
| Legacy | `data-tile-{key}-booking-url` blijft werken: het zet CTA1 impliciet op `booking`. Een expliciete `data-tile-{key}-cta1-action` wint daarvan. Nieuwe configuraties gebruiken de expliciete modus. |

**Preview-component.** `cta2Resolvable` volgt de nieuwe logica: `true` zodra er een globale URL of
een globale Pico-modus is (ongeacht selectie), anders `true` bij een maatregel die zelf een doel of
Pico-modus heeft. Het CTA1-label volgt de modus: in `booking` is de fallback
`data-cta1-text-booking`, in `flow` en `pico` is dat `data-cta1-text`.

### 1.6 De Pico-modus: een leadflow is verplicht

Pico stuurt de lead client-side naar `POST {base}/assignments/create` met de API-sleutel in de
`X-API-Key`-header. Base-URL's: `https://pico.homezero.nl/rest/pico/v1/` (productie) en
`https://pico-accp.homezero.nl/rest/pico/v1/` (acceptatie, via `data-pico-env="acceptance"`).

**De widget dwingt af dat er een leadflow gekoppeld is.** Een CTA in Pico-modus zonder oplosbare
flow-id bestáát niet: CTA2 wordt dan niet gerenderd en CTA1 weigert de klik met een
console-waarschuwing. Er gaat dus nooit een aanvraag de deur uit die Pico niet kan routeren. De
generator moet dezelfde eis stellen, zodat die situatie de partner nooit bereikt.

**Waar `FlowID` vandaan komt** — dezelfde precedentie als de rest, met twee vangnetten:

```
1. combinatie   data-cta{n}-combo-pico-flow-id      (bij ≥2 geselecteerd)
2. maatregel    data-tile-{key}-cta{n}-pico-flow-id (bij 1 geselecteerd)
3. globaal      data-cta{n}-pico-flow-id
4. de id= uit de URL van diezelfde CTA
5. data-pico-flow-id                                (widget-breed)
6. de leadflow van de primair geselecteerde maatregel
```

Stap 6 is waarom de normale situatie geen configuratie nodig heeft: staat CTA1 van de warmtepomp op
`pico` en heeft die maatregel `data-tile-heatpump-url="…?id=WP"`, dan wordt `WP` de `FlowID`. Een
expliciete `-pico-flow-id` is er voor als het quick-contact onder een **andere** flow moet vallen dan
de leadflow van die maatregel.

**Waar `FlowsInterestedIn` vandaan komt** — altijd uit de geselecteerde maatregelen, één entry per
maatregel, in de volgorde waarin de bezoeker ze koos:

| Selectie | `FlowID` | `FlowsInterestedIn` |
|---|---|---|
| Eén maatregel | de flow van die maatregel | `[{ FlowID: "<die maatregel>" }]` |
| Combinatie (≥2) | de combinatie-flow (of stap 4–6) | `[{ FlowID: "A" }, { FlowID: "B" }, …]` — **alle** geselecteerde maatregelen |
| Niets gekozen (globale Pico-CTA2) | de globale flow | `[]` |

Bij een combinatie komen de gekozen maatregelen dus direct mee, náást de flow waarop gerouteerd
wordt. Een maatregel wordt geïdentificeerd door zijn eigen leadflow (`id=` uit
`data-tile-{key}-url`), en anders door zijn `-pico-flow-id`. Dubbelingen worden samengevoegd: twee
maatregelen die naar dezelfde flow verwijzen zijn één interesse.

De overige contractregels die de widget respecteert: `Phonenumber` **of** `Email` is verplicht (de
widget valideert dat vóór het versturen), `HouseDetails` gaat alleen mee als zowel `Zipcode` als
`Housenumber` bekend zijn, en `Country` gaat in hoofdletters mee met standaard `NL`.

**Ook de brochure-modus vereist nu een leadflow.** Die modus heeft geen maatregelen, dus er is geen
`FlowsInterestedIn` om op terug te vallen: zonder `data-pico-flow-id` weigert de widget de aanvraag
en waarschuwt hij bij het laden. Emit dat attribuut dus altijd in brochure-modus.

### 1.7 Wat de leadflow-URL meekrijgt

Bij modus `flow` bouwt de widget de start-URL van de leadflow. Naast het adres, de naam- en
contactvelden en `ReferralURL` gaan de geselecteerde maatregelen mee in drie parameters:

| Parameter | Inhoud |
|---|---|
| `Tiles` | de ruwe tegel-keys, komma-gescheiden (`heatpump,solarpanels`) — ongewijzigd |
| `PrimaryTile` | de eerst geselecteerde key — ongewijzigd |
| `InterestedInMeasurements` *(nieuw)* | de maatregelnamen zoals de leadflow ze kent, komma-gescheiden (`Heatpump,SolarPanel`) |

`InterestedInMeasurements` gaat **altijd** mee, ook bij één geselecteerde maatregel. De leadflow
gebruikt het om de juiste maatregelen alvast aan te vinken; de **combinatie-flow** koppelt er
functioneel gedrag aan. Voor de andere flows is het onschadelijk — daar landt het in een veld.

De namen zijn niet gelijk aan de keys en de spelling moet exact kloppen. De widget vertaalt ze zelf,
dus de generator hoeft hier niets voor te emitten — maar de **keuze van de key bepaalt nu ook het
leadflow-gedrag**, niet alleen het icoon:

| Key | Naam in `InterestedInMeasurements` |
|---|---|
| `solarpanels` | `SolarPanel` |
| `heatpump` | `Heatpump` |
| `floorinsulation` | `FloorInsulation` |
| `wallinsulation` | `WallInsulation` |
| `roofinsulation` | `RoofInsulation` |
| `glassinsulation` | `GlasInsulation` |
| `carcharger` | `ChargingStation` |
| `airconditioning` | `Airconditioning` |
| `homebattery` | `HomeBattery` |
| `solarboiler` | `SolarBoiler` |
| `meterkast` | `FuseBox` |
| `gasboiler` | `GasBoiler` |
| `dynamicenergy` | `DynamicEnergyContract` |
| `servicemaintenance` | `ServiceAndMaintenance` |
| `advisormodule` | `AdvisorModule` |
| `combination` | `Combination` |
| `general` | `General` |

De Nederlandse alias-keys uit §2.2 geven dezelfde naam, dus `data-tile-warmtepomp-url` levert net als
`data-tile-heatpump-url` de naam `Heatpump`. Dubbelingen worden samengevoegd en de selectievolgorde
blijft behouden.

**Twee keys hebben geen leadflow-naam**: `advicescan` (Huisscan) en `ems` (Energiemanagement). Die
staan niet in de maatregellijst van de leadflow, dus ze vallen uit `InterestedInMeasurements` weg —
ze reizen wel mee in `Tiles`. Gebruik die keys dus niet in een widget die op een combinatie-flow
uitkomt, of vraag om een officiële naam.

**Trackingparameters.** Alle dertien gedocumenteerde parameters — `utm_campaign`, `utm_medium`,
`utm_source`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `dclid`, `ttclid`, `fbclid`,
`li_fat_id`, `ad_id` — worden van de pagina waar de widget staat overgenomen en doorgegeven. De
widget leest ze uit de query-string **en uit cookies** met dezelfde naam, zodat ze ook overleven
wanneer de bezoeker eerst naar een andere pagina navigeert. Waarden die alleen uit witruimte bestaan
of letterlijk `undefined`/`null` zijn (wat ad-scripts soms schrijven) worden overgeslagen. Dit geldt
voor de leadflow-URL, voor de Pico-payload (daar heten de velden `UtmSource`, `GCLID`, …) en voor de
classic-modus. De `booking`-route stuurt ze niet mee: die opent een externe agenda.

### 1.8 Wat er gebeurt bij een storing

`offline.html` is de storingspagina van HomeZero. Hij wordt naast het script zelf gezocht, dus elke
omgeving serveert zijn eigen kopie (`…/Production/offline.html`). Per route:

| Route | Bij een storing |
|---|---|
| `flow` (scan) en de classic-modus | ping-check; faalt die, dan `offline.html` |
| `pico` (scan) en de brochure-modus | **nieuw:** een technische fout leidt naar `offline.html` |
| `booking` | geen fallback — de externe agenda wordt direct geopend |

**Pico onderscheidt twee soorten fouten**, en dat verschil moet de generator ook uitleggen:

- **Herstelbaar** — de twee gedocumenteerde adresfouten, `Could not find a building with this
  address` en `address not inside the operating area`. Die blijven een inline melding bij het
  adresveld, zodat de bezoeker zijn invoer houdt en kan corrigeren. Naar een storingspagina sturen
  zou hier onjuist zijn: de dienst werkt, het adres is het probleem.
- **Technisch** — netwerkfout, 5xx, API onbereikbaar. Dat gaat naar `offline.html`, met de reden,
  de partnersite als `referralUrl` en client-diagnostiek als `context`. Staat er een leadflow-URL
  bij de maatregel, dan gaat die mee als `targetUrl` zodat de pagina een "opnieuw proberen" kan
  aanbieden; bij de brochure-modus is er niets om te herhalen en blijft die parameter weg.

Bij de keuze `booking` hoort in de configurator de notitie dat die route geen storingspagina heeft.

> **Aandachtspunt.** De API-sleutel is gewhitelist per domein. Wordt de widget op een niet-gewhiteliste
> host geplaatst, dan is de afwijzing een *configuratiefout*, maar de widget classificeert hem als
> technisch en stuurt de bezoeker naar de storingspagina. Dat is niet misleidend voor de bezoeker,
> maar de partner ziet er niet aan dat zijn domein nog aangemeld moet worden. Laat de generator bij
> het aanvragen van de sleutel expliciet het domein uitvragen.

### 1.9 Validaties die de generator moet uitvoeren

De widget degradeert netjes en waarschuwt in de console; hij gooit nooit. Maar een partner ziet die
console niet, dus de generator moet deze fouten **vóór** het genereren afvangen. Links de melding
die de widget geeft, rechts wat de configurator moet doen om die onmogelijk te maken.

| Waarschuwing in de widget | Check in de generator |
|---|---|
| `onbekende CTA-actie "…"; toegestaan zijn flow, pico, booking` | Modus alleen uit een gesloten keuzelijst; nooit vrije tekst. |
| `een CTA staat op actie "pico" maar data-pico-key ontbreekt` | Zodra enig niveau `pico` is: `data-pico-key` verplicht maken en meeschrijven. |
| `actie "pico" zonder gekoppelde leadflow … CTA2 wordt verborgen, CTA1 weigert` | Bij elke Pico-keuze een leadflow verplicht maken. Let op de globale Pico-CTA2: die is klikbaar zonder selectie, dus daar kan geen maatregel de flow leveren en is een eigen flow-id echt nodig. |
| `brochure-modus zonder data-pico-flow-id` | In brochure-modus een leadflow verplicht maken; anders weigert de widget de aanvraag. |
| `brochure-modus zonder data-pico-key` | In brochure-modus `data-pico-key` verplicht maken. |
| `CTA{n} staat op actie "booking" maar heeft geen agenda-URL voor maatregel "…"` | URL-veld verplicht zodra de modus `booking` is, op hetzelfde niveau. |
| `CTA{n} verwijst naar een ongeldige URL: …` | Alleen `http(s)`-URL's toestaan; `javascript:` en `data:` weigeren. |
| `maatregel "…" heeft geen geldige data-tile-{key}-url` | Bij modus `flow` is de leadflow-URL van die maatregel verplicht. Bij `pico` en `booking` niet. |
| `CTA2 is aan maar heeft geen doel … CTA2 blijft verborgen` | Geen 2e CTA uitschrijven zonder doel: óf een URL, óf modus `pico` **met** gekoppelde leadflow. |
| `multi-select zonder data-cta1-combo-url of data-cta1-combo-action` | Bij multi-select het combinatie-blok aanbieden en invullen aanmoedigen; anders erft de combinatie de eerste maatregel. |
| `dropdown is single-select; data-tiles-max-select wordt geforceerd naar 1` | Bij `data-tile-display="dropdown"` de multi-select-optie verbergen en `data-tiles-max-select="1"` emitten. |
| `data-cta2-action="ai-chat" is verouderd` | Nooit `ai-chat` als modus emitten; gebruik `data-ai-chat-show="true"` + `data-ai-chat-text`. |
| `CTA{n} heeft geen geldige doel-URL voor de huidige selectie` (bij de klik) | Idem als de rij hierboven: de URL bestaat wel maar is geen geldige `http(s)`-URL. |
| `CTA{n} heeft geen doel voor de huidige selectie` (bij de klik) | Sluit uit met de checks hierboven. Bij modus `pico` noemt de melding expliciet dat er een leadflow ontbreekt. |
| `brochure-aanvraag geweigerd: geen gekoppelde leadflow` (bij de klik) | Idem — komt niet voor als `data-pico-flow-id` altijd geëmit wordt. |

Twee dingen die de widget **niet** kan controleren en die dus in de configurator thuishoren:

- Of een leadflow-URL daadwerkelijk bestaat. De widget kijkt alleen of het een geldige `http(s)`-URL
  is; een typefout in de `id=`-parameter komt pas bij de bezoeker aan het licht.
- Of meer dan vier maatregelen met `large`/`tiles` gecombineerd worden — de widget kapt stil af op
  vier (§1.10). Waarschuw of blokkeer dat in de UI.

### 1.10 Bekende beperking van grote tegels

`data-tile-display="large"` (en `"tiles"`) rendert een raster van **maximaal 4 maatregelen** — het
raster is vier kolommen breed en een vijfde tegel valt weg. Dropdown en tags kennen die grens niet.
Configureert een partner meer dan vier maatregelen, stuur hem dan naar `dropdown` of `tags`, of
waarschuw dat maatregel 5 en verder onzichtbaar blijven. Multi-select zelf werkt in alle drie de
selectietypen gelijk, inclusief de combinatie-CTA's.

## 2. Maatregelen — keys, weergavenamen en iconen

### 2.1 Volledige lijst

De **key** is technisch: hij vormt de attribuutnamen (`data-tile-{key}-url`), kiest het ingebouwde
icoon en gaat als `Tiles=` / `PrimaryTile=` naar de leadflow. Hij moet matchen op `[a-z0-9]+` —
**geen streepjes**, want de attribuut-parser is `/^data-tile-[a-z0-9]+-url$/`. De **weergavenaam**
is vrije tekst in `data-tile-{key}-title` en het enige dat de bezoeker leest. Emit die altijd.

| # | Weergavenaam (default) | Key | Icoon | Leadflow-naam |
|---|---|---|---|---|
| 1 | Zonnepanelen | `solarpanels` | ingebouwd | `SolarPanel` |
| 2 | Warmtepomp | `heatpump` | ingebouwd | `Heatpump` |
| 3 | Vloerisolatie | `floorinsulation` | ingebouwd | `FloorInsulation` |
| 4 | Muurisolatie | `wallinsulation` | ingebouwd | `WallInsulation` |
| 5 | Dakisolatie | `roofinsulation` | ingebouwd | `RoofInsulation` |
| 6 | Glasisolatie | `glassinsulation` | ingebouwd | `GlasInsulation` |
| 7 | Laadpaal | `carcharger` | ingebouwd | `ChargingStation` |
| 8 | Airco | `airconditioning` | ingebouwd | `Airconditioning` |
| 9 | Thuisbatterij | `homebattery` | ingebouwd | `HomeBattery` |
| 10 | Zonnestroomboiler | `solarboiler` | ingebouwd | `SolarBoiler` |
| 11 | Meterkast | `meterkast` | ingebouwd | `FuseBox` |
| 12 | Cv-ketel | `gasboiler` | ingebouwd | `GasBoiler` |
| 13 | Dynamische energie | `dynamicenergy` | ingebouwd · **nieuw icoon** | `DynamicEnergyContract` |
| 14 | Service en onderhoud | `servicemaintenance` | ingebouwd · **nieuw icoon** | `ServiceAndMaintenance` |
| 15 | Combinatie | `combination` | ingebouwd · **nieuw icoon** | `Combination` |
| 98 | Adviseur | `advisormodule` | ingebouwd | `AdvisorModule` |
| 99 | Algemeen | `general` | ingebouwd | `General` |
| — | Huisscan | `advicescan` | ingebouwd · bestond al, staat niet in de lijst | — |
| — | Energiemanagement (EMS) | `ems` | ingebouwd · bestond al, staat niet in de lijst | — |

Alle 19 keys hierboven bestaan in de widget en hebben een eigen ingebouwd icoon. Er is geen
maatregel meer die op het generieke `general`-icoon terugvalt. De laatste kolom is de naam waarmee
de maatregel in `InterestedInMeasurements` naar de leadflow gaat (§1.7); `advicescan` en `ems` hebben
die niet.

### 2.2 Nederlandse alias-keys *(correctie op `LOVABLE_GENERATOR.md`)*

`LOVABLE_GENERATOR.md` stelt dat er géén alias-mechanisme is. Dat is onjuist en nu ook uitgebreid:
de widget mapt Nederlandse keys op hetzelfde icoon als hun Engelse tegenhanger. Beide varianten
geven dus een correct icoon in de dropdown, de tags en de tegels.

| Alias-key | Verwijst naar |
|---|---|
| `advies` | `advisormodule` |
| `adviseur` | `advisormodule` |
| `airco` | `airconditioning` |
| `algemeen` | `general` |
| `batterij` | `homebattery` |
| `combinatie` | `combination` |
| `cvketel` | `gasboiler` |
| `dakisolatie` | `roofinsulation` |
| `dynamischeenergie` | `dynamicenergy` |
| `glasisolatie` | `glassinsulation` |
| `huisscan` | `advicescan` |
| `laadpaal` | `carcharger` |
| `muurisolatie` | `wallinsulation` |
| `serviceonderhoud` | `servicemaintenance` |
| `thuisbatterij` | `homebattery` |
| `vloerisolatie` | `floorinsulation` |
| `warmtepomp` | `heatpump` |
| `zon` | `solarpanels` |
| `zonnepanelen` | `solarpanels` |
| `zonnestroomboiler` | `solarboiler` |

**Advies voor de generator:** blijf de **Engelse canonieke key** uitschrijven. De aliassen zijn er
voor bestaande, handgeschreven embeds en voor partners die Nederlandse keys gebruiken — niet als
nieuwe standaard. Eén key per maatregel houdt de leadflow-parameters consistent.

### 2.3 Eigen artwork blijft mogelijk

`data-tile-{key}-icon-svg` (base64-SVG) overschrijft het ingebouwde icoon. Resolutie is:
`data-tile-{key}-icon-svg` → ingebouwd icoon op de exacte key → `general`.

Eisen aan aangeleverde SVG's, zodat ze meekleuren met de widget:

- `fill="currentColor"` (of `stroke="currentColor"`) — **geen** vaste hexkleur; in een geselecteerde
  tegel en in een chip erft het icoon de contrastkleur.
- Een `viewBox` is verplicht; `width`/`height` worden door de widget verwijderd en door de
  stylesheet bepaald (28×28 in de dropdown/tags, 36×36 in grote tegels).
- Niet-vierkante viewBoxen zijn toegestaan; het icoon wordt passend geschaald en gecentreerd.

### 2.4 Iconen compleet

Er staan geen openstaande icoon-verzoeken meer. Toegevoegd op 19 augustus 2026:

| Key | Icoon |
|---|---|
| `dynamicenergy` | bliksemschicht |
| `combination` | huis met zonnepaneel en laadpaal |
| `servicemaintenance` | moersleutel |

Daarnaast zijn twee bestaande iconen gerepareerd: `gasboiler` (Cv-ketel) stond op `fill="#132039"`
en `general` (Algemeen) op `fill="black"`, waardoor ze donker bleven in een geselecteerde tegel waar
alle andere iconen wit worden. Beide gebruiken nu `currentColor`. **Alle 19 iconen kleuren nu mee**;
de bron in §2.5 is bijgewerkt, dus een preview die daaruit leest is direct correct.

### 2.5 Alle iconen in SVG

Voor de icoon-preview in de configurator. Dit is de exacte bron zoals de widget hem gebruikt: de
widget kiest deze op basis van de key, dus de generator hoeft ze **niet** mee te sturen in de embed
— alleen te tónen. Alle 19 gebruiken `fill="currentColor"`, zodat ze meekleuren met de tegel.


#### `solarpanels` — Zonnepanelen

```svg
<svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.2003 3.53237C3.47642 2.66949 4.27854 2.08398 5.18451 2.08398H14.8347C15.7406 2.08398 16.5428 2.66949 16.8189 3.53237L19.0856 10.6157C19.5157 11.96 18.5128 13.334 17.1013 13.334H12.7179V14.584C13.6384 14.584 14.3846 15.3302 14.3846 16.2507C14.3846 17.1711 13.6384 17.9173 12.7179 17.9173H7.71793C6.79745 17.9173 6.05126 17.1711 6.05126 16.2507C6.05126 15.3302 6.79745 14.584 7.71793 14.584V13.334H2.91785C1.50639 13.334 0.503452 11.96 0.933629 10.6157L3.2003 3.53237ZM8.55126 13.334V15.0007C8.55126 15.2308 8.73781 15.4173 8.96793 15.4173H11.4679C11.698 15.4173 11.8846 15.2308 11.8846 15.0007V13.334H8.55126ZM7.78905 15.4173H7.71793C7.25769 15.4173 6.88459 15.7904 6.88459 16.2507C6.88459 16.7109 7.25769 17.084 7.71793 17.084H12.7179C13.1782 17.084 13.5513 16.7109 13.5513 16.2507C13.5513 15.7904 13.1782 15.4173 12.7179 15.4173H12.6468C12.4752 15.9028 12.0122 16.2507 11.4679 16.2507H8.96793C8.42367 16.2507 7.96065 15.9028 7.78905 15.4173ZM5.18451 2.91732C4.64093 2.91732 4.15965 3.26862 3.99398 3.78635L3.47207 5.41732H5.99596L6.39596 2.91732H5.18451ZM7.23989 2.91732L6.83989 5.41732H9.80126V2.91732H7.23989ZM10.6346 2.91732V5.41732H13.596L13.196 2.91732H10.6346ZM14.0399 2.91732L14.4399 5.41732H16.5471L16.0252 3.78635C15.8595 3.26862 15.3783 2.91732 14.8347 2.91732H14.0399ZM16.8138 6.25065H14.5732L14.9482 8.5944H17.5638L16.8138 6.25065ZM17.8304 9.42774H15.0816L15.5732 12.5007H17.1013C17.9482 12.5007 18.55 11.6763 18.2919 10.8697L17.8304 9.42774ZM14.7293 12.5007L14.2376 9.42774H10.6346V12.5007H14.7293ZM9.80126 12.5007V9.42774H6.19823L5.70656 12.5007H9.80126ZM4.86263 12.5007L5.35429 9.42774H2.18874L1.72732 10.8697C1.46921 11.6763 2.07097 12.5007 2.91785 12.5007H4.86263ZM2.45541 8.5944H5.48763L5.86263 6.25065H3.20541L2.45541 8.5944ZM6.70656 6.25065L6.33156 8.5944H9.80126V6.25065H6.70656ZM10.6346 6.25065V8.5944H14.1043L13.7293 6.25065H10.6346Z" fill="currentColor"></path> </svg>
```

#### `heatpump` — Warmtepomp

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.39375 4.04545C3.11416 4.04545 2.8875 4.27949 2.8875 4.56818V17.1136C2.8875 17.4023 3.11416 17.6364 3.39375 17.6364H20.6063C20.8858 17.6364 21.1125 17.4023 21.1125 17.1136V4.56818C21.1125 4.27949 20.8858 4.04545 20.6063 4.04545H3.39375ZM1.875 4.56818C1.875 3.7021 2.55497 3 3.39375 3H20.6063C21.445 3 22.125 3.7021 22.125 4.56818V17.1136C22.125 17.9797 21.445 18.6818 20.6063 18.6818H19.0875V19.4136C19.0875 19.8755 18.7249 20.25 18.2775 20.25H16.3538C15.9064 20.25 15.5438 19.8755 15.5438 19.4136V18.6818H8.45625V19.4136C8.45625 19.8755 8.0936 20.25 7.64625 20.25H5.7225C5.27515 20.25 4.9125 19.8755 4.9125 19.4136V18.6818H3.39375C2.55497 18.6818 1.875 17.9797 1.875 17.1136V4.56818ZM5.925 18.6818V19.2045H7.44375V18.6818H5.925ZM16.5563 18.6818V19.2045H18.075V18.6818H16.5563ZM3.9 10.8409C3.9 7.66527 6.39321 5.09091 9.46875 5.09091C12.5443 5.09091 15.0375 7.66527 15.0375 10.8409C15.0375 14.0165 12.5443 16.5909 9.46875 16.5909C6.39321 16.5909 3.9 14.0165 3.9 10.8409ZM4.94031 10.3182H13.9972C13.9375 9.76023 13.7832 9.23169 13.5514 8.75H5.38611C5.15427 9.23169 5.00004 9.76023 4.94031 10.3182ZM6.07266 7.70455H12.8648C12.0306 6.74207 10.8182 6.13636 9.46875 6.13636C8.11934 6.13636 6.90694 6.74207 6.07266 7.70455ZM13.9972 11.3636H4.94031C5.00004 11.9216 5.15427 12.4501 5.38611 12.9318H13.5514C13.7832 12.4501 13.9375 11.9216 13.9972 11.3636ZM12.8648 13.9773H6.07266C6.90694 14.9397 8.11934 15.5455 9.46875 15.5455C10.8182 15.5455 12.0306 14.9397 12.8648 13.9773Z" fill="currentColor"></path> </svg>
```

#### `floorinsulation` — Vloerisolatie

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2237 4.18927C11.9063 4.04573 11.5368 4.0491 11.2223 4.19841L2.01788 8.56808C1.84778 8.64884 1.85012 8.88009 2.02183 8.95772L3.88432 9.79981L13.8538 4.92625L12.2237 4.18927ZM15.1495 5.51206L5.18 10.3856L8.08182 11.6976L18.1272 6.85838L15.1495 5.51206ZM19.4288 7.44687L9.38342 12.2861L11.5247 13.2543C12.0009 13.4696 12.5551 13.4645 13.0268 13.2405L21.9821 8.98916C22.1522 8.90841 22.1499 8.67715 21.9782 8.59952L19.4288 7.44687ZM2.56649 10.4046L1.53099 9.9364C0.500728 9.47059 0.486678 8.08308 1.50732 7.59855L10.7118 3.22888C11.3408 2.93026 12.0796 2.92352 12.7146 3.21059L22.469 7.62084C23.4993 8.08665 23.5133 9.47416 22.4927 9.95869L21.4256 10.4653L22.3993 10.8807C23.4531 11.3302 23.4838 12.7401 22.4505 13.2306L21.4256 13.7172L22.3993 14.1326C23.4531 14.5821 23.4838 15.992 22.4505 16.4825L13.5374 20.7139C12.7511 21.0872 11.8276 21.0956 11.0339 20.7368L1.64951 16.4938C0.584921 16.0125 0.615517 14.5639 1.69959 14.1235L2.70027 13.717L1.56778 13.2049C0.52646 12.7341 0.52646 11.3269 1.56778 10.8561L2.56649 10.4046ZM3.89421 11.0049L2.05861 11.8348C1.88506 11.9133 1.88506 12.1478 2.05861 12.2263L11.5247 16.5062C12.0009 16.7215 12.5551 16.7164 13.0268 16.4925L21.94 12.2611C22.1122 12.1793 22.1071 11.9443 21.9314 11.8694L20.1071 11.0912L13.5374 14.2101C12.7511 14.5833 11.8276 14.5918 11.0339 14.2329L3.89421 11.0049ZM4.07381 14.338L2.1487 15.1201C1.96802 15.1935 1.96292 15.4349 2.14035 15.5151L11.5247 19.7581C12.0009 19.9734 12.5551 19.9683 13.0268 19.7444L21.94 15.513C22.1122 15.4312 22.1071 15.1963 21.9314 15.1213L20.1071 14.3431L13.5374 17.462C12.7511 17.8353 11.8276 17.8437 11.0339 17.4848L4.07381 14.338Z" fill="currentColor"></path> </svg>
```

#### `wallinsulation` — Muurisolatie

```svg
<svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.625 2.22222C5.35653 2.22222 5.13889 2.43986 5.13889 2.70833V4.16667H14.375C15.1804 4.16667 15.8333 4.81958 15.8333 5.625V14.8611H17.2917C17.5601 14.8611 17.7778 14.6435 17.7778 14.375V2.70833C17.7778 2.43986 17.5601 2.22222 17.2917 2.22222H5.625ZM15.8333 15.8333H17.2917C18.0971 15.8333 18.75 15.1804 18.75 14.375V2.70833C18.75 1.90292 18.0971 1.25 17.2917 1.25H5.625C4.81958 1.25 4.16667 1.90292 4.16667 2.70833V4.16667H2.70833C1.90292 4.16667 1.25 4.81959 1.25 5.625V17.2917C1.25 18.0971 1.90292 18.75 2.70833 18.75H14.375C15.1804 18.75 15.8333 18.0971 15.8333 17.2917V15.8333ZM2.70833 5.13889C2.43986 5.13889 2.22222 5.35653 2.22222 5.625V17.2917C2.22222 17.5601 2.43986 17.7778 2.70833 17.7778H14.375C14.6435 17.7778 14.8611 17.5601 14.8611 17.2917V5.625C14.8611 5.35653 14.6435 5.13889 14.375 5.13889H2.70833ZM6.11111 7.08333C6.37958 7.08333 6.59722 7.30097 6.59722 7.56944C6.59722 7.83792 6.37958 8.05556 6.11111 8.05556H5.13889C4.87042 8.05556 4.65278 7.83792 4.65278 7.56944C4.65278 7.30097 4.87042 7.08333 5.13889 7.08333H6.11111ZM10.4861 7.56944C10.4861 7.30097 10.7038 7.08333 10.9722 7.08333H11.9444C12.2129 7.08333 12.4306 7.30097 12.4306 7.56944C12.4306 7.83792 12.2129 8.05556 11.9444 8.05556H10.9722C10.7038 8.05556 10.4861 7.83792 10.4861 7.56944ZM9.02778 9.02778C9.29625 9.02778 9.51389 9.24542 9.51389 9.51389C9.51389 9.78236 9.29625 10 9.02778 10H8.05556C7.78708 10 7.56944 9.78236 7.56944 9.51389C7.56944 9.24542 7.78708 9.02778 8.05556 9.02778H9.02778ZM6.11111 10.9722C6.37958 10.9722 6.59722 11.1899 6.59722 11.4583C6.59722 11.7268 6.37958 11.9444 6.11111 11.9444H5.13889C4.87042 11.9444 4.65278 11.7268 4.65278 11.4583C4.65278 11.1899 4.87042 10.9722 5.13889 10.9722H6.11111ZM12.4306 11.4583C12.4306 11.7268 12.2129 11.9444 11.9444 11.9444H10.9722C10.7038 11.9444 10.4861 11.7268 10.4861 11.4583C10.4861 11.1899 10.7038 10.9722 10.9722 10.9722H11.9444C12.2129 10.9722 12.4306 11.1899 12.4306 11.4583ZM9.02778 12.9167C9.29625 12.9167 9.51389 13.1343 9.51389 13.4028C9.51389 13.6712 9.29625 13.8889 9.02778 13.8889H8.05556C7.78708 13.8889 7.56944 13.6712 7.56944 13.4028C7.56944 13.1343 7.78708 12.9167 8.05556 12.9167H9.02778ZM6.11111 14.8611C6.37958 14.8611 6.59722 15.0788 6.59722 15.3472C6.59722 15.6157 6.37958 15.8333 6.11111 15.8333H5.13889C4.87042 15.8333 4.65278 15.6157 4.65278 15.3472C4.65278 15.0788 4.87042 14.8611 5.13889 14.8611H6.11111ZM12.4306 15.3472C12.4306 15.6157 12.2129 15.8333 11.9444 15.8333H10.9722C10.7038 15.8333 10.4861 15.6157 10.4861 15.3472C10.4861 15.0788 10.7038 14.8611 10.9722 14.8611H11.9444C12.2129 14.8611 12.4306 15.0788 12.4306 15.3472Z" fill="currentColor"></path> </svg>
```

#### `roofinsulation` — Dakisolatie

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5309 3.41474C10.9546 2.86175 11.7963 2.86175 12.2199 3.41474L13.1225 4.5928L14.0243 3.41566C14.4484 2.86212 15.2912 2.86278 15.7144 3.417L16.6685 4.66646L17.4683 3.4888C17.8702 2.89696 18.7411 2.86691 19.1839 3.4296L20.1051 4.60016L21.0133 3.41474C21.437 2.86175 22.2787 2.86175 22.7024 3.41474L23.7857 4.82874C24.0714 5.20171 24.0714 5.71664 23.7857 6.08961L22.3873 7.91491V18.6189C22.3873 19.1961 21.9132 19.664 21.3284 19.664H13.9421L13.8508 19.7912C13.5203 20.2512 12.8797 20.3696 12.403 20.0585L10.9156 19.0878L10.3503 19.8256C10.0133 20.2655 9.38796 20.3712 8.92186 20.067L7.42145 19.0878L6.84882 19.8352C6.51789 20.2671 5.9075 20.378 5.44246 20.0906L3.82546 19.0914L3.3606 19.7671C3.03441 20.2413 2.38221 20.3677 1.89862 20.0505L0.472899 19.1152C-0.0252137 18.7885 -0.150502 18.1196 0.196305 17.6387L9.20147 5.14998L10.5309 3.41474ZM4.43426 18.2345L6.0043 19.2048L6.8733 18.0705L16.0356 5.57407L14.8689 4.04609L13.5483 5.76974L4.43426 18.2345ZM12.4643 5.46642L11.3754 4.04517L10.0552 5.76836L1.05894 18.2447L2.48465 19.18L3.24032 18.0815L12.4643 5.46642ZM8.05161 18.2461L9.50582 19.1951L10.3662 18.0721L19.4511 5.47281L18.3478 4.07078L17.1282 5.86655L8.05161 18.2461ZM20.5376 5.76838L11.5421 18.2437L12.987 19.1867L21.4307 7.43075L22.9412 5.45917L21.8579 4.04517L20.5376 5.76838ZM14.6928 18.6189H21.3284V9.38019L14.6928 18.6189Z" fill="currentColor"></path> </svg>
```

#### `glassinsulation` — Glasisolatie

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.25C5 2.2835 5.7835 1.5 6.75 1.5H20.75C21.7165 1.5 22.5 2.2835 22.5 3.25V17.25C22.5 18.2165 21.7165 19 20.75 19H19V20.75C19 21.7165 18.2165 22.5 17.25 22.5H3.25C2.2835 22.5 1.5 21.7165 1.5 20.75V6.75C1.5 5.7835 2.2835 5 3.25 5H5V3.25ZM6.16667 5H17.25C18.2165 5 19 5.7835 19 6.75V17.8333H20.75C21.0722 17.8333 21.3333 17.5722 21.3333 17.25V3.25C21.3333 2.92783 21.0722 2.66667 20.75 2.66667H6.75C6.42783 2.66667 6.16667 2.92783 6.16667 3.25V5ZM3.25 6.16667C2.92783 6.16667 2.66667 6.42783 2.66667 6.75V20.75C2.66667 21.0722 2.92783 21.3333 3.25 21.3333H17.25C17.5722 21.3333 17.8333 21.0722 17.8333 20.75V6.75C17.8333 6.42783 17.5722 6.16667 17.25 6.16667H3.25Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99581 7.50419C6.22362 7.73199 6.22362 8.10134 5.99581 8.32915L4.82915 9.49581C4.60134 9.72362 4.23199 9.72362 4.00419 9.49581C3.77638 9.26801 3.77638 8.89866 4.00419 8.67085L5.17085 7.50419C5.39866 7.27638 5.76801 7.27638 5.99581 7.50419Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1625 15.6709C14.3903 15.8987 14.3903 16.268 14.1625 16.4958L12.9958 17.6625C12.768 17.8903 12.3987 17.8903 12.1709 17.6625C11.943 17.4347 11.943 17.0653 12.1709 16.8375L13.3375 15.6709C13.5653 15.443 13.9347 15.443 14.1625 15.6709Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4958 18.0042C16.7236 18.232 16.7236 18.6013 16.4958 18.8291L15.3291 19.9958C15.1013 20.2236 14.732 20.2236 14.5042 19.9958C14.2764 19.768 14.2764 19.3987 14.5042 19.1709L15.6709 18.0042C15.8987 17.7764 16.268 17.7764 16.4958 18.0042Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.32915 7.50419C8.55695 7.73199 8.55695 8.10134 8.32915 8.32915L4.82915 11.8291C4.60134 12.057 4.23199 12.057 4.00419 11.8291C3.77638 11.6013 3.77638 11.232 4.00419 11.0042L7.50419 7.50419C7.73199 7.27638 8.10134 7.27638 8.32915 7.50419Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4958 15.6709C16.7236 15.8987 16.7236 16.268 16.4958 16.4958L12.9958 19.9958C12.768 20.2236 12.3987 20.2236 12.1709 19.9958C11.943 19.768 11.943 19.3987 12.1709 19.1709L15.6709 15.6709C15.8987 15.443 16.268 15.443 16.4958 15.6709Z" fill="currentColor"></path> </svg>
```

#### `carcharger` — Laadpaal

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.2002 1C7.86865 1 7.6001 1.26855 7.6001 1.6001V4H7.5C5.29077 4 3.5 5.79077 3.5 8V12C3.5 16.4182 7.08179 20 11.5 20H11.3999V22.3999C11.3999 22.7314 11.6685 23 12 23C12.3313 23 12.5999 22.7314 12.5999 22.3999V20H12.5C16.9182 20 20.5 16.4182 20.5 12V8C20.5 5.79077 18.7092 4 16.5 4H16.3999V1.6001C16.3999 1.5127 16.3813 1.42969 16.3477 1.35474C16.2539 1.14551 16.0439 1 15.8 1C15.4685 1 15.2 1.26855 15.2 1.6001V4H8.80005V1.6001C8.80005 1.26855 8.53149 1 8.2002 1ZM16.5 5.19995H7.5C5.95361 5.19995 4.69995 6.45361 4.69995 8V12C4.69995 15.7556 7.74438 18.8 11.5 18.8H12.5C16.2556 18.8 19.3 15.7556 19.3 12V8C19.3 6.45361 18.0464 5.19995 16.5 5.19995ZM10.0183 12.0618L11.4548 8.24487C11.5657 7.94971 12.0046 8.02905 12.0046 8.34424V10.6042C12.0046 10.6321 12.0073 10.6592 12.0127 10.6855L12.0186 10.7122C12.0457 10.8157 12.1111 10.9038 12.199 10.9607C12.2659 11.0039 12.3455 11.0291 12.4309 11.0291H13.7251C13.9236 11.0291 14.0608 11.2263 13.9912 11.4114L12.5547 15.2283C12.491 15.3972 12.3198 15.4436 12.1851 15.3931C12.1294 15.3721 12.0798 15.3345 12.0469 15.2822C12.0205 15.2402 12.0046 15.189 12.0046 15.1289V12.8687C12.0046 12.6343 11.814 12.4441 11.5786 12.4441H10.2842C10.0859 12.4441 9.94873 12.2468 10.0183 12.0618Z" fill="currentColor"></path> </svg>
```

#### `airconditioning` — Airco

```svg
<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.18118 16.6654C5.28847 16.4328 5.20796 16.1742 4.96642 16.0449C4.72488 15.9416 4.45636 16.0191 4.32214 16.2517C3.89262 17.1049 3.89262 18.1132 4.32214 18.9404C4.61742 19.535 4.61742 20.2331 4.32214 20.8277C4.21486 21.0603 4.29537 21.319 4.53691 21.4482C4.59065 21.474 4.67116 21.5 4.75168 21.5C4.9127 21.5 5.10069 21.3967 5.1812 21.2414C5.61073 20.3882 5.61073 19.3799 5.1812 18.5527C4.88592 17.9839 4.8859 17.26 5.18118 16.6654Z" fill="currentColor"></path> <path d="M8.80466 16.6654C8.91195 16.4328 8.83144 16.1742 8.5899 16.0449C8.34836 15.9416 8.07984 16.0191 7.94563 16.2517C7.5161 17.1049 7.5161 18.1132 7.94563 18.9404C8.2409 19.535 8.2409 20.2331 7.94563 20.8277C7.83834 21.0603 7.91885 21.319 8.16039 21.4482C8.21413 21.474 8.29464 21.5 8.37516 21.5C8.53618 21.5 8.72417 21.3967 8.80468 21.2414C9.23421 20.3882 9.23421 19.3799 8.80468 18.5527C8.48263 17.9839 8.48261 17.26 8.80466 16.6654Z" fill="currentColor"></path> <path d="M12.4309 16.6654C12.5382 16.4328 12.4576 16.1742 12.2161 16.0449C11.9746 15.9416 11.706 16.0191 11.5718 16.2517C11.1423 17.1049 11.1423 18.1132 11.5718 18.9404C11.8671 19.535 11.8671 20.2331 11.5718 20.8277C11.4645 21.0603 11.5451 21.319 11.7866 21.4482C11.8403 21.474 11.9209 21.5 12.0014 21.5C12.1624 21.5 12.3504 21.3967 12.4309 21.2414C12.8604 20.3882 12.8604 19.3799 12.4309 18.5527C12.1087 17.9839 12.1086 17.26 12.4309 16.6654Z" fill="currentColor"></path> <path d="M16.0544 16.6654C16.1616 16.4328 16.0811 16.1742 15.8396 16.0449C15.598 15.9416 15.3295 16.0191 15.1953 16.2517C14.7658 17.1049 14.7658 18.1132 15.1953 18.9404C15.4906 19.535 15.4906 20.2331 15.1953 20.8277C15.088 21.0603 15.1685 21.319 15.4101 21.4482C15.4638 21.474 15.5443 21.5 15.6248 21.5C15.7859 21.5 15.9739 21.3967 16.0544 21.2414C16.4839 20.3882 16.4839 19.3799 16.0544 18.5527C15.7323 17.9839 15.7323 17.26 16.0544 16.6654Z" fill="currentColor"></path> <path d="M19.6778 16.6654C19.7851 16.4328 19.7046 16.1742 19.4631 16.0449C19.2215 15.9416 18.953 16.0191 18.8188 16.2517C18.3893 17.1049 18.3893 18.1132 18.8188 18.9404C19.1141 19.535 19.1141 20.2331 18.8188 20.8277C18.7115 21.0603 18.792 21.319 19.0336 21.4482C19.0873 21.474 19.1678 21.5 19.2483 21.5C19.4094 21.5 19.5973 21.3967 19.6779 21.2414C20.1074 20.3882 20.1074 19.3799 19.6779 18.5527C19.3558 17.9839 19.3558 17.26 19.6778 16.6654Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 4.3C21 3.85817 20.6418 3.5 20.2 3.5H3.8C3.35817 3.5 3 3.85817 3 4.3V8.5H21V4.3ZM21 9.5H3V12.8834C3 13.224 3.27604 13.5 3.61656 13.5L3.98629 12.1135C4.16139 11.4569 4.75607 11 5.43564 11H18.5658C19.2453 11 19.84 11.4569 20.0151 12.1135L20.3848 13.5C20.7246 13.5 21 13.2246 21 12.8848V9.5ZM19.3499 13.5H4.6515L4.89314 12.5939C4.98652 12.2437 5.30368 12 5.66612 12H18.3353C18.6977 12 19.0149 12.2437 19.1083 12.5939L19.3499 13.5ZM3.5 2.5C2.67157 2.5 2 3.17157 2 4V13C2 13.8284 2.67157 14.5 3.5 14.5H20.5C21.3284 14.5 22 13.8284 22 13V4C22 3.17157 21.3284 2.5 20.5 2.5H3.5Z" fill="currentColor"></path> <path d="M17 6C17 5.72386 17.2239 5.5 17.5 5.5H18.5C18.7761 5.5 19 5.72386 19 6C19 6.27614 18.7761 6.5 18.5 6.5H17.5C17.2239 6.5 17 6.27614 17 6Z" fill="currentColor"></path> </svg>
```

#### `homebattery` — Thuisbatterij

```svg
<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6101 2.56854C8.89251 2.07047 6.10787 2.07049 3.39022 2.56853C3.05568 2.62984 2.8125 2.92354 2.8125 3.26624V6.06003H12.1878V3.26618C12.1878 2.92349 11.9446 2.62984 11.6101 2.56854ZM12.1878 7.00503H2.8125V17.3588C2.8125 17.7015 3.05568 17.9952 3.39022 18.0565C6.10787 18.5545 8.89251 18.5545 11.6101 18.0565C11.9446 17.9952 12.1878 17.7015 12.1878 17.3588V7.00503ZM3.22252 1.63878C6.05106 1.12042 8.94931 1.1204 11.7779 1.63879C12.5581 1.78179 13.1253 2.46679 13.1253 3.26618V7.47752H13.5937C14.3704 7.47752 15 8.11215 15 8.89501V15.51C15 15.7709 15.2099 15.9825 15.4687 15.9825C15.7276 15.9825 15.9375 15.7709 15.9375 15.51V5.95966H15.419C14.6698 5.95966 14.0625 5.3475 14.0625 4.59236C14.0625 3.9846 14.4559 3.46945 15 3.29152V2.28006C15 2.01911 15.2099 1.80757 15.4687 1.80757C15.7276 1.80757 15.9375 2.01911 15.9375 2.28006V3.22506H16.875V2.28006C16.875 2.01911 17.0849 1.80757 17.3437 1.80757C17.6026 1.80757 17.8125 2.01911 17.8125 2.28006V3.29152C18.3566 3.46945 18.75 3.9846 18.75 4.59236C18.75 5.3475 18.1427 5.95966 17.3935 5.95966H16.875V15.51C16.875 16.2928 16.2454 16.9274 15.4687 16.9274C14.6921 16.9274 14.0625 16.2928 14.0625 15.51V8.89501C14.0625 8.63406 13.8526 8.42251 13.5937 8.42251H13.1253V17.3588C13.1253 18.1582 12.5581 18.8432 11.7779 18.9862C8.94931 19.5046 6.05106 19.5046 3.22252 18.9862C2.44224 18.8432 1.875 18.1582 1.875 17.3588V3.26624C1.875 2.4668 2.44224 1.78177 3.22252 1.63878ZM15.419 4.17005C15.1876 4.17005 15 4.35912 15 4.59236C15 4.82559 15.1876 5.01467 15.419 5.01467H17.3935C17.6249 5.01467 17.8125 4.82559 17.8125 4.59236C17.8125 4.35912 17.6249 4.17005 17.3935 4.17005H15.419Z" fill="currentColor"></path> <path d="M6.28375 12.3888L7.23194 9.84006C7.30523 9.64305 7.595 9.69601 7.595 9.90643V11.4156C7.595 11.5722 7.72092 11.6991 7.87625 11.6991H8.73069C8.8616 11.6991 8.95222 11.8309 8.90625 11.9545L7.95806 14.5032C7.88477 14.7002 7.595 14.6473 7.595 14.4368V12.9276C7.595 12.7711 7.46908 12.6441 7.31375 12.6441H6.45931C6.3284 12.6441 6.23778 12.5123 6.28375 12.3888Z" fill="currentColor"></path> </svg>
```

#### `solarboiler` — Zonnestroomboiler

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.02656 3.73216V14.3171C5.02656 14.5159 5.18771 14.677 5.38648 14.677C5.42942 14.1836 5.84352 13.7966 6.34803 13.7966H7.3426C7.72719 13.7966 8.05925 14.0215 8.21439 14.347C8.29808 14.5226 8.45342 14.677 8.64792 14.677H9.7302C9.92471 14.677 10.08 14.5226 10.1637 14.347C10.3189 14.0215 10.6509 13.7966 11.0355 13.7966H12.9676C13.3522 13.7966 13.6842 14.0215 13.8394 14.347C13.9231 14.5226 14.0784 14.677 14.2729 14.677H15.3552C15.5497 14.677 15.705 14.5226 15.7887 14.347C15.9439 14.0215 16.2759 13.7966 16.6605 13.7966H17.6551C18.1002 13.7966 18.475 14.0979 18.5865 14.5077C18.6121 14.6017 18.6914 14.677 18.7888 14.677C18.8925 14.677 18.9766 14.5929 18.9766 14.4892V3.73216C14.3888 2.65595 9.61429 2.65595 5.02656 3.73216ZM18.9766 16.102C18.9766 15.8949 18.8087 15.727 18.6016 15.727H18.5355C18.1509 15.727 17.8189 15.5021 17.6637 15.1766C17.58 15.001 17.4247 14.8466 17.2302 14.8466H17.0854C16.8909 14.8466 16.7356 15.001 16.6519 15.1766C16.4967 15.5021 16.1647 15.727 15.7801 15.727H13.848C13.4634 15.727 13.1314 15.5021 12.9762 15.1766C12.8925 15.001 12.7372 14.8466 12.5427 14.8466H11.4604C11.2659 14.8466 11.1106 15.001 11.0269 15.1766C10.8717 15.5021 10.5397 15.727 10.1551 15.727H8.22303C7.83843 15.727 7.50638 15.5021 7.35123 15.1766C7.26755 15.001 7.11221 14.8466 6.9177 14.8466H6.77292C6.57842 14.8466 6.42308 15.001 6.33939 15.1766C6.18425 15.5021 5.85219 15.727 5.4676 15.727H5.40156C5.19446 15.727 5.02656 15.8949 5.02656 16.102V17.6892C5.02656 17.7937 5.09845 17.8844 5.20014 17.9083L9.77781 18.983C11.2404 19.3264 12.7627 19.3264 14.2253 18.983L18.803 17.9083C18.9047 17.8844 18.9766 17.7937 18.9766 17.6892V16.102ZM13.8203 20.136C12.6166 20.3421 11.3865 20.3421 10.1828 20.136V21.5803C10.1828 21.9945 9.84703 22.3303 9.43281 22.3303H7.53906C7.12485 22.3303 6.78906 21.9945 6.78906 21.5803V19.3599L4.96014 18.9305C4.38391 18.7952 3.97656 18.2811 3.97656 17.6892V3.72642C3.97656 3.24234 4.30971 2.82191 4.78098 2.71126C9.53013 1.59625 14.473 1.59625 19.2221 2.71126C19.6934 2.82191 20.0266 3.24234 20.0266 3.72642V17.6892C20.0266 18.2811 19.6192 18.7952 19.043 18.9305L17.2141 19.3599V21.5803C17.2141 21.9945 16.8783 22.3303 16.4641 22.3303H14.5703C14.1561 22.3303 13.8203 21.9945 13.8203 21.5803V20.136ZM16.1641 19.6064L14.8703 19.9101V21.2803H16.1641V19.6064ZM7.83906 19.6064V21.2803H9.13281V19.9101L7.83906 19.6064ZM12.0016 5.83027C11.0489 5.83027 10.2766 6.60258 10.2766 7.55527C10.2766 8.50796 11.0489 9.28027 12.0016 9.28027C12.9543 9.28027 13.7266 8.50796 13.7266 7.55527C13.7266 6.60258 12.9543 5.83027 12.0016 5.83027ZM9.22656 7.55527C9.22656 6.02268 10.469 4.78027 12.0016 4.78027C13.5342 4.78027 14.7766 6.02268 14.7766 7.55527C14.7766 9.08786 13.5342 10.3303 12.0016 10.3303C10.469 10.3303 9.22656 9.08786 9.22656 7.55527ZM13.1266 6.43027C13.3316 6.6353 13.3316 6.96771 13.1266 7.17274L12.744 7.55527C12.539 7.7603 12.2066 7.7603 12.0016 7.55527C11.7965 7.35025 11.7965 7.01784 12.0016 6.81281L12.3841 6.43027C12.5891 6.22525 12.9215 6.22525 13.1266 6.43027Z" fill="currentColor"/> </svg>
```

#### `meterkast` — Meterkast

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM5 5H19V19H5V5ZM8 8C8 7.44772 8.44772 7 9 7H10C10.5523 7 11 7.44772 11 8C11 8.55228 10.5523 9 10 9H9C8.44772 9 8 8.55228 8 8ZM13 8C13 7.44772 13.4477 7 14 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H14C13.4477 9 13 8.55228 13 8ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H9ZM9 15C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H15C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15H9Z" fill="currentColor"/></svg>
```

#### `gasboiler` — Cv-ketel

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none"> <path d="M9.71771 0.414932C10.2974 -0.138289 11.2104 -0.138333 11.79 0.414932L21.1963 9.39443C21.8485 10.0174 21.4078 11.117 20.5059 11.1171H19.2539V18.6171C19.2538 19.4454 18.5822 20.117 17.7539 20.1171H3.75381C2.92544 20.1171 2.25388 19.4454 2.2538 18.6171V11.1171H1.00185C0.0997649 11.1171 -0.340905 10.0174 0.311412 9.39443L9.71771 0.414932ZM11.0996 1.13759C10.9065 0.953347 10.6024 0.953687 10.4091 1.13759L1.00185 10.1171H2.2538C2.80592 10.1172 3.2537 10.565 3.25381 11.1171V18.6171C3.25388 18.8932 3.47773 19.1171 3.75381 19.1171H17.7539C18.0299 19.117 18.2538 18.8931 18.2539 18.6171V11.1171C18.254 10.5649 18.7017 10.1171 19.2539 10.1171H20.5059L11.0996 1.13759ZM16.2539 17.1171C16.5299 17.1172 16.7538 17.3411 16.7539 17.6171C16.7538 17.8931 16.5299 18.117 16.2539 18.1171H5.25382C4.97773 18.1171 4.75388 17.8932 4.75382 17.6171C4.75393 17.3411 4.97776 17.1171 5.25382 17.1171H16.2539ZM11.039 8.14052C11.1571 8.06826 11.3029 8.17535 11.2724 8.31435C10.8519 10.194 12.5937 10.2644 13.083 11.5575C13.4318 12.4069 13.1945 13.3832 12.5468 13.995C11.9581 14.5433 11.1387 14.686 10.3818 14.5878C9.85195 14.5179 8.37809 13.973 8.25969 12.1981C8.25974 11.3963 8.47562 10.8637 8.68743 10.5341C8.77776 10.3983 8.98774 10.4772 8.96966 10.6415C8.9199 11.0884 8.98037 11.7132 9.54388 12.1474C9.66533 12.242 9.83319 12.1055 9.77728 11.9599C9.09555 10.1788 9.90845 8.81887 11.039 8.14052ZM10.9052 10.8065C10.6345 11.5225 11.0349 11.9668 10.9326 12.4198C10.8702 12.7112 10.6403 13.0411 10.1923 13.1522C11.0954 13.906 11.9474 13.2186 11.9228 12.4169C11.9222 11.7707 11.0083 11.3989 10.9052 10.8065Z" fill="currentColor"/> </svg>
```

#### `dynamicenergy` — Dynamische energie

```svg
<svg viewBox="170.6 -917 682.8 938" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M474 21L474 21Q470 21 465.50 20Q461 19 457 18L457 18Q453 16 449 13Q445 10 442 7L442 7Q439 4 437 0Q435-4 434-8L434-8Q432-13 431.50-17.50Q431-22 432-26L432-26L465-329L213-329Q208-329 202-330.50Q196-332 191-335L191-335Q186-338 182-342Q178-346 176-351L176-351Q173-356 171.50-362Q170-368 171-373L171-373Q171-379 173-384.50Q175-390 178-395L178-395L515-899Q519-904 524.50-908.50Q530-913 537-915L537-915Q544-917 551-917Q558-917 564-915L564-915Q571-912 576.50-908Q582-904 585-898L585-898Q589-892 591-885.50Q593-879 592-872L592-872L559-567L811-567Q816-567 822-565.50Q828-564 833-561L833-561Q838-558 842-554Q846-550 848-545L848-545Q851-540 852.50-534Q854-528 853-523L853-523Q853-517 851-511.50Q849-506 846-501L846-501L509 3Q507 7 503 10.50Q499 14 494 16L494 16Q489 19 484 20Q479 21 474 21L474 21ZM293-414L293-414L512-414Q516-414 520.50-413Q525-412 529-410L529-410Q533-408 537-405.50Q541-403 544-400L544-400Q547-396 549-392Q551-388 552-384L552-384Q554-380 554.50-375.50Q555-371 554-367L554-367L535-189L731-482L512-482Q507-482 503-483Q499-484 495-486L495-486Q490-488 486.50-490.50Q483-493 480-496L480-496Q477-500 475-503.50Q473-507 471-512L471-512Q470-516 469.50-520.50Q469-525 469-529L469-529L489-707L293-414Z" fill="currentColor"/></svg>
```

#### `servicemaintenance` — Service en onderhoud

```svg
<svg viewBox="0 -960 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M597-721L706-831Q701-831 695-832L695-832Q689-832 683-832L683-832Q673-832 663-831L663-831Q654-830 644-829L644-829Q612-823 583-808L583-808Q555-793 532-770Q509-747 494-718L494-718Q478-689 473-657L473-657Q467-625 471-593Q475-561 488-531L488-531Q494-519 491-506L491-506Q489-493 479-483L479-483L185-188Q178-182 174-173L174-173Q171-164 171-154L171-154Q171-145 174-136L174-136Q178-127 185-121L185-121Q191-114 200-110L200-110Q209-107 218-107L218-107Q228-107 237-110L237-110Q246-114 252-121L252-121L547-415Q557-425 570-427L570-427Q583-430 595-424L595-424Q625-411 657-407Q689-403 721-409L721-409Q753-414 782-430L782-430Q811-445 834-468Q857-491 872-519L872-519Q887-548 893-580L893-580Q894-590 895-599L895-599Q896-609 896-619L896-619Q896-625 896-631L896-631Q895-637 895-642L895-642L785-533Q773-521 758-515L758-515Q742-508 725-508L725-508Q709-508 693-515L693-515Q678-521 666-533L666-533L665-533L597-602Q585-614 579-629L579-629Q572-645 572-661L572-661Q572-678 579-694L579-694Q585-709 597-721L597-721ZM629-913L629-913Q642-915 656-916L656-916Q669-917 683-917L683-917Q714-917 745-911L745-911Q777-904 806-891L806-891Q815-887 822-878L822-878Q828-870 830-860L830-860Q832-849 829-839Q826-829 818-822L818-822L658-661L725-594L886-754Q893-762 903-765Q913-768 924-766L924-766Q934-764 942-758L942-758Q951-751 955-742L955-742Q968-713 975-681L975-681Q981-650 981-619L981-619Q981-605 980-592L980-592Q979-578 977-565L977-565Q968-520 947-480Q926-440 894-407L894-407Q862-375 821-354L821-354Q781-333 736-325L736-325Q699-318 661-321L661-321Q624-323 588-335L588-335L313-60Q294-42 269-31L269-31Q245-21 218-21L218-21Q192-21 167-31L167-31Q143-42 124-60L124-60Q106-79 95-103L95-103Q85-128 85-154L85-154Q85-181 95-205L95-205Q106-230 124-249L124-249L399-524Q387-560 385-597L385-597Q382-635 389-672L389-672Q397-717 418-757L418-757Q439-798 471-830L471-830Q504-862 544-883Q584-904 629-913Z" fill="currentColor"/></svg>
```

#### `combination` — Combinatie

```svg
<svg viewBox="0 -960 1229 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M398-960L398-959Q392-959 386-956.50Q380-954 376-950L376-950L376-950L29-619Q17-607 8.50-593Q0-579 0-561L0-561Q0-544 9.50-529Q19-514 32-504L32-504Q36-501 41-499Q46-497 52-497L52-497L68-497L68-181Q68-165 72.50-150Q77-135 88-123L88-123Q100-111 115.50-106.50Q131-102 146-102L146-102L651-102L670-103L670-63Q670-50 679.50-40.50Q689-31 702-31L702-31L702-31L749-31Q747-21 747-12L747-12Q747 20 769 42Q791 64 823 64L823 64Q854 64 876 41.50Q898 19 898-12L898-12Q898-17 897.50-22Q897-27 896-31L896-31L896-31L1002-31Q999-21 999-12L999-12Q999 20 1021.50 42Q1044 64 1075 64L1075 64Q1106 64 1128.50 41.50Q1151 19 1151-12L1151-12Q1151-17 1150-22Q1149-27 1148-31L1148-31L1148-31L1195-31Q1209-31 1218.50-40.50Q1228-50 1229-63L1229-63L1229-63L1229-118Q1229-135 1223.50-151.50Q1218-168 1206-180L1206-180Q1194-190 1179-196.50Q1164-203 1147-203L1147-203Q1146-203 1145.50-203Q1145-203 1144-203L1144-203L1144-203L1146-203L1098-283L1097-285Q1086-302 1067-312.50Q1048-323 1026-323L1026-323L871-323Q850-323 831-312.50Q812-302 800-285L800-285L800-283L752-203L754-203Q742-203 729-200L729-200L729-498L745-498Q745-498 745.50-498Q746-498 746-498L746-498Q751-498 756-499.50Q761-501 766-504L766-504L765-504Q778-514 787.50-528.50Q797-543 797-562L797-562Q797-579 788.50-593Q780-607 768-619L768-619L628-754L634-759Q638-764 640.50-770Q643-776 643-783L643-783Q643-789 640-795.50Q637-802 633-806L633-806L633-806L517-917Q512-921 506-923.50Q500-926 493-926L493-926Q486-926 480-923.50Q474-921 470-916L470-916L470-916L464-910L421-950Q417-955 411-957.50Q405-960 399-960L399-960L398-960ZM75-571L398-881L722-572Q728-568 728-566Q728-564 729-564L729-564L697-564Q683-563 674-553.50Q665-544 664-531L664-531L664-531L664-181Q664-174 663-172Q662-170 662-170L662-170Q662-170 660-169Q658-168 650-168L650-168L469-168L469-459Q469-480 454-495Q439-510 419-510L419-510L264-510Q244-510 229-495Q214-480 214-459L214-459L214-168L146-168Q139-168 137-169Q135-170 135-170L135-170Q135-170 134.50-172Q134-174 134-182L134-182L134-531Q133-544 123.50-553.50Q114-563 100-563L100-563L68-563Q68-564 69-565.50Q70-567 74-571L74-571L75-571ZM264-461L264-461L419-461Q420-461 420-459L420-459L420-410L263-410L263-459Q263-461 264-461ZM263-173L263-361L420-361L420-173Q420-171 419-171L419-171L355-171L394-236Q395-238 396-240Q397-242 397-244L397-244Q397-251 392.50-255.50Q388-260 381-261L381-261L381-261L346-261L381-317Q382-318 382-320Q382-322 382-324L382-324Q382-329 380-332.50Q378-336 375-338L375-338L375-338Q373-339 371-340Q369-341 367-341L367-341Q366-341 365-340.50Q364-340 363-340L363-340L364-340Q360-339 357.50-337Q355-335 354-333L354-333L354-333L304-252Q304-251 303.50-249Q303-247 303-245L303-245Q303-239 307.50-234Q312-229 318-229L318-229L318-229L353-229L319-172L319-171L264-171Q263-171 263-173L263-173ZM871-257L871-258L1026-258Q1034-258 1036-256.50Q1038-255 1041-250L1041-250L1099-153Q1103-146 1110.50-141.50Q1118-137 1127-137L1127-137L1127-137L1144-137Q1152-137 1155-135.50Q1158-134 1159-134L1159-134Q1160-133 1161.50-130Q1163-127 1163-118L1163-118L1163-97L736-97L736-118Q736-127 737-130Q738-133 738-134L738-134Q739-134 742-135.50Q745-137 754-137L754-137L771-137Q780-137 787.50-141.50Q795-146 800-153L800-153L800-153L857-250Q860-255 862-256Q864-257 871-257L871-257ZM823-22L823-22Q832-21 833-12L833-12Q832-3 823-2L823-2Q819-2 816.50-5Q814-8 813-12L813-12L813-12Q814-21 823-22L823-22ZM1075-22L1075-22Q1084-21 1085-12L1085-12Q1084-3 1075-2L1075-2Q1071-2 1068.50-5Q1066-8 1065-12L1065-12L1065-12Q1066-21 1075-22L1075-22Z" fill="currentColor" fill-rule="evenodd"/></svg>
```

#### `advisormodule` — Adviseur

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.934 1.42359C18.0749 1.38511 17.2312 1.65866 16.56 2.19453L16.5599 2.19464C15.8883 2.73039 15.4336 3.49207 15.2815 4.33721C15.1294 5.18257 15.2894 6.05446 15.7323 6.79075C15.7974 6.89896 15.814 7.02954 15.7781 7.15061L15.4222 8.35114L16.7519 8.03305C16.8602 8.00713 16.9744 8.02232 17.0722 8.07569C17.8265 8.48735 18.7046 8.61143 19.5441 8.42442C20.3832 8.23741 21.1253 7.75267 21.6337 7.05961C22.1417 6.36658 22.3807 5.51292 22.3059 4.65775L22.3059 4.65753C22.2314 3.8017 21.8484 3.00244 21.2281 2.40728C20.6084 1.81291 19.7931 1.46357 18.934 1.42359ZM15.9986 1.49108C16.8408 0.818755 17.8986 0.476205 18.9747 0.524512L18.9754 0.524543C20.0515 0.574517 21.0737 1.01208 21.8511 1.75778L21.8511 1.75779C22.6287 2.50377 23.1091 3.50602 23.2025 4.57952C23.2963 5.65255 22.9963 6.72309 22.3595 7.59182L22.3594 7.59196C21.722 8.46073 20.7917 9.06847 19.7398 9.30288L19.7398 9.30289C18.7452 9.52444 17.7073 9.39766 16.7981 8.9474L14.874 9.40766C14.7177 9.44505 14.5533 9.39624 14.4428 9.2796C14.3322 9.16295 14.2922 8.99619 14.3379 8.8421L14.8607 7.07882C14.382 6.19412 14.217 5.1713 14.3957 4.17783C14.5865 3.11766 15.1567 2.16277 15.9985 1.49119L15.9986 1.49108ZM8.27002 5.46948C7.07655 5.46948 5.93195 5.94359 5.08804 6.7875C4.24413 7.63142 3.77002 8.77601 3.77002 9.96948C3.77002 11.163 4.24413 12.3075 5.08804 13.1515C5.93195 13.9954 7.07655 14.4695 8.27002 14.4695C9.46349 14.4695 10.6081 13.9954 11.452 13.1515C12.2959 12.3075 12.77 11.163 12.77 9.96948C12.77 8.77601 12.2959 7.63142 11.452 6.7875C10.6081 5.94359 9.46349 5.46948 8.27002 5.46948ZM5.79515 7.49461C6.45152 6.83823 7.34176 6.46948 8.27002 6.46948C9.19828 6.46948 10.0885 6.83823 10.7449 7.49461C11.4013 8.15099 11.77 9.04122 11.77 9.96948C11.77 10.8977 11.4013 11.788 10.7449 12.4444C10.0885 13.1007 9.19828 13.4695 8.27002 13.4695C7.34176 13.4695 6.45152 13.1007 5.79515 12.4444C5.13877 11.788 4.77002 10.8977 4.77002 9.96948C4.77002 9.04122 5.13877 8.15099 5.79515 7.49461ZM2.99041 17.6899C3.77181 16.9085 4.83162 16.4695 5.93669 16.4695H10.6034C11.7084 16.4695 12.7682 16.9085 13.5496 17.6899C14.331 18.4713 14.77 19.5311 14.77 20.6362V20.9695C14.77 21.7979 14.0984 22.4695 13.27 22.4695H3.27002C2.44159 22.4695 1.77002 21.7979 1.77002 20.9695V20.6362C1.77002 19.5311 2.20901 18.4713 2.99041 17.6899ZM5.93669 15.4695C4.5664 15.4695 3.25224 16.0138 2.2833 16.9828C1.31436 17.9517 0.77002 19.2659 0.77002 20.6362V20.9695C0.77002 22.3502 1.88931 23.4695 3.27002 23.4695H13.27C14.6507 23.4695 15.77 22.3502 15.77 20.9695V20.6362C15.77 19.2659 15.2257 17.9517 14.2567 16.9828C13.2878 16.0138 11.9736 15.4695 10.6034 15.4695H5.93669ZM19.1947 5.39377C19.0822 5.50629 18.9295 5.56951 18.7704 5.56951C18.6113 5.56951 18.4587 5.50629 18.3461 5.39377C18.2336 5.28125 18.1704 5.12864 18.1704 4.96951C18.1704 4.81038 18.2336 4.65776 18.3461 4.54524C18.4587 4.43272 18.6113 4.36951 18.7704 4.36951C18.9295 4.36951 19.0822 4.43272 19.1947 4.54524C19.3072 4.65776 19.3704 4.81038 19.3704 4.96951C19.3704 5.12864 19.3072 5.28125 19.1947 5.39377ZM20.4706 5.56951C20.6297 5.56951 20.7823 5.50629 20.8949 5.39377C21.0074 5.28125 21.0706 5.12864 21.0706 4.96951C21.0706 4.81038 21.0074 4.65776 20.8949 4.54524C20.7823 4.43272 20.6297 4.36951 20.4706 4.36951C20.3115 4.36951 20.1589 4.43272 20.0463 4.54524C19.9338 4.65776 19.8706 4.81038 19.8706 4.96951C19.8706 5.12864 19.9338 5.28125 20.0463 5.39377C20.1589 5.50629 20.3115 5.56951 20.4706 5.56951ZM17.4945 5.39377C17.382 5.50629 17.2293 5.56951 17.0702 5.56951C16.9111 5.56951 16.7585 5.50629 16.646 5.39377C16.5334 5.28125 16.4702 5.12864 16.4702 4.96951C16.4702 4.81038 16.5334 4.65776 16.646 4.54524C16.7585 4.43272 16.9111 4.36951 17.0702 4.36951C17.2293 4.36951 17.382 4.43272 17.4945 4.54524C17.607 4.65776 17.6702 4.81038 17.6702 4.96951C17.6702 5.12864 17.607 5.28125 17.4945 5.39377Z" fill="currentColor"/> </svg>
```

#### `general` — Algemeen

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_4387_117838)"> <path d="M20.4201 10.184L12.7101 2.30403C12.6172 2.21018 12.5066 2.13568 12.3848 2.08484C12.2629 2.03399 12.1322 2.00781 12.0001 2.00781C11.8681 2.00781 11.7373 2.03399 11.6155 2.08484C11.4936 2.13568 11.383 2.21018 11.2901 2.30403L3.58012 10.194C3.39355 10.3821 3.24621 10.6054 3.14664 10.8508C3.04708 11.0963 2.99727 11.3591 3.00012 11.624V20.004C2.99934 20.5159 3.19489 21.0087 3.54649 21.3807C3.89809 21.7528 4.37898 21.9759 4.89012 22.004H19.1101C19.6213 21.9759 20.1021 21.7528 20.4537 21.3807C20.8053 21.0087 21.0009 20.5159 21.0001 20.004V11.624C21.0009 11.087 20.7929 10.5706 20.4201 10.184ZM10.0001 20.004V14.004H14.0001V20.004H10.0001ZM19.0001 20.004H16.0001V13.004C16.0001 12.7388 15.8948 12.4845 15.7072 12.2969C15.5197 12.1094 15.2653 12.004 15.0001 12.004H9.00012C8.7349 12.004 8.48055 12.1094 8.29301 12.2969C8.10547 12.4845 8.00012 12.7388 8.00012 13.004V20.004H5.00012V11.584L12.0001 4.43403L19.0001 11.624V20.004Z" fill="currentColor"/> </g> <defs> <clipPath id="clip0_4387_117838"> <rect width="24" height="24" fill="white"/> </clipPath> </defs> </svg>
```

#### `advicescan` — Huisscan

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_3911_139521)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6ZM15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V7C21 7.55228 20.5523 8 20 8C19.4477 8 19 7.55228 19 7V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM4 16C4.55228 16 5 16.4477 5 17V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H8C8.55228 19 9 19.4477 9 20C9 20.5523 8.55228 21 8 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V17C3 16.4477 3.44772 16 4 16ZM20 16C20.5523 16 21 16.4477 21 17V18C21 18.7957 20.6839 19.5587 20.1213 20.1213C19.5587 20.6839 18.7957 21 18 21H16C15.4477 21 15 20.5523 15 20C15 19.4477 15.4477 19 16 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V17C19 16.4477 19.4477 16 20 16Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_3911_139521"> <rect width="24" height="24" fill="currentColor"></rect> </clipPath> </defs> </svg>
```

#### `ems` — Energiemanagement (EMS)

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11 16V13H8L13 8V11H16L11 16ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor"/></svg>
```

---

## 3. Checklist voor de generator

**CTA-modi**

- [ ] Modus-keuze (`Leadflow` / `Direct in Pico` / `Boekingslink`) beschikbaar voor CTA1 **én** CTA2,
      op maatregelniveau, combinatieniveau en globaal. Default overal `Leadflow`.
- [ ] De gekozen modus wordt geëmit op het niveau waar hij is ingesteld — ook als dat `flow` is.
- [ ] `data-cta2-show` wordt in geen enkele configuratie geëmit.
- [ ] `data-pico-key` (en `data-pico-env` buiten productie) wordt geëmit zodra enig niveau `pico` is.
- [ ] Elke Pico-keuze dwingt een leadflow af, geëmit als `-pico-flow-id` op hetzelfde niveau.
- [ ] Een globale Pico-CTA2 (klikbaar zonder selectie) krijgt altijd een eigen flow-id.
- [ ] Brochure-modus emit altijd `data-pico-flow-id`.
- [ ] Bij het aanvragen van een Pico-sleutel wordt het domein van de partner uitgevraagd
      (de sleutel is per domein gewhitelist).
- [ ] `booking` zonder URL wordt in de configurator geblokkeerd, niet stil geëmit.
- [ ] Bij `booking` staat in de UI dat die route geen storingspagina heeft.
- [ ] Bij `pico` staat in de UI dat een technische fout naar de storingspagina leidt en een
      adresfout inline blijft.
- [ ] Combinatie-blok alleen zichtbaar bij multi-select, met eigen modus voor CTA1 en CTA2.
- [ ] Legacy `data-tile-{key}-booking-url` wordt niet meer nieuw uitgeschreven; expliciete modus wint.

**Generieke 2e CTA**

- [ ] Blok "Generieke 2e CTA (altijd zichtbaar)" bovenaan de CTA-sectie, in beide modi, met dezelfde
      drie keuzes als CTA1.
- [ ] Identieke per-maatregel CTA2-doelen worden samengevoegd tot één globale `data-cta2-url`.
- [ ] Per-maatregel CTA2 heeft de hint "Laat leeg om de generieke 2e CTA te gebruiken".
- [ ] Preview: `cta2Resolvable` is `true` bij een globale URL of globale Pico-modus, ook zonder
      selectie; geen "kies eerst een maatregel"-melding op zo'n CTA2.
- [ ] Preview: CTA1-label volgt de modus (`data-cta1-text-booking` in booking, anders
      `data-cta1-text`).

**Maatregelen en iconen**

- [ ] Alle 19 keys uit §2.1 selecteerbaar, elk met zijn weergavenaam voorgevuld en editeerbaar.
- [ ] `data-tile-{key}-title` wordt altijd uitgeschreven.
- [ ] Iconen in de preview komen uit §2.5, opgezocht op de exacte key.
- [ ] Keys matchen `[a-z0-9]+` — geen streepjes, geen hoofdletters.
- [ ] De keuze van de key wordt als functioneel behandeld, niet cosmetisch: hij bepaalt het icoon
      **en** de naam in `InterestedInMeasurements` (§1.7).
- [ ] `advicescan` en `ems` worden niet aangeboden in een widget die op een combinatie-flow uitkomt:
      die keys hebben geen leadflow-naam.
- [ ] Bij meer dan 4 maatregelen wordt `large`/`tiles` afgeraden of geblokkeerd (§1.10).
