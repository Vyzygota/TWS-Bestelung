# TWS Bestelung — kontekst projektu

Formularz zamówień B2B dla pralni **TWS Rügen** (Niemcy). Klienci hotelowi i gastronomiczni zamawiają pościel, ręczniki i obrusy.

## Stack

| Warstwa | Technologia |
|---|---|
| Frontend | `index.html` + `app.js` + `style.css` (vanilla JS, Tailwind CDN) |
| Backend | Google Apps Script — `backend/Kod.js` |
| Baza danych | Google Sheets (ID: `1uL4nELMXSHz5MKQyVUC7cX4rU5YrGKY0stpXAPefstc`) |
| Deployment | `clasp` (scriptId: `1l8lz5rH7n5rB8r8EVg-Iaj23-JAc_W-Ak6eNN6rKDAnyCdgPKG51TfOd`) |
| Hosting | GitHub Pages (`vyzygota.github.io/TWS-Bestelung/`) |

## Arkusze Google Sheets

- **Orders** — zamówienia (kolumny A–AG: timestamp, nr zamówienia, klient, produkty, uwagi)
- **Clients** — baza klientów: A=ID(6 cyfr), B=Nazwa, C=Styl(np. "4mm"), D=Trasa, E=Miejscowość, F=Email
- **Raport_Pralnia**, **Raport_Ekspedycja**, **Raport_Kierowcy** — raporty generowane z zamówień

## Pułapki — obowiązkowe do przeczytania

### Arkusz Clients nie ma nagłówka
Dane zaczynają się od wiersza 1. W `Kod.js` iteracja musi startować od `i = 0`, nie od `i = 1`.

### Fetch używa `mode: 'no-cors'`
POST do Apps Script wymaga `no-cors` z powodu przekierowań Google (`script.google.com → script.googleusercontent.com`). **Konsekwencja:** frontend nie może odczytać odpowiedzi backendu — nie próbuj parsować `response.json()`.

### Styl klienta pochodzi z arkusza, nie z formularza
Kolumna C arkusza Clients zawiera styl (np. "4mm") przypisany przez pralnię. Klient nie ma wyboru stylu w formularzu. Default "4mm" tylko dla klientów nieznanych w bazie.

### Deployment URL Apps Script
`AKfycbxZsT2WpaWXZNKxXiAdHkPjzyCCPmlMLPsEn3N6tKD3jGboUKoSwh0SoWwX9XdEYh8Y`

Po każdej zmianie backendu należy wykonać **nowy deploy** (nie edytować istniejącego). Wersja aktualna: @41+.

### Projekt jest testowy
E-maile klienta są kopiowane na adres magazynu — celowe, do testów.

## Wielojęzyczność

Interfejs obsługuje DE / PL / EN. Wszystkie nowe teksty UI muszą mieć tłumaczenia w trzech językach. Tłumaczenia są w `app.js` w obiekcie `translations`.

## Workflow agentów

Dostępne skills (`.agents/skills/`):

- **`deploy`** — jak wdrożyć zmiany backendu przez clasp
- **`add-feature`** — jak dodać nową funkcję do formularza
- **`fix-bug`** — jak diagnozować i naprawiać błędy

**Używanie Warp Workflows:**
Jako Agent (AntiGravity) w tym projekcie współpracuję z infrastrukturą narzędzia Warp. Przy wykonywaniu standardowych zadań (takich jak deploy backendu czy commitowanie) zawsze w pierwszej kolejności sprawdzam dostępne skrypty w folderze `.warp/workflows/` (np. `push-backend.yaml` lub `quick-commit.yaml`) i na ich podstawie generuję oraz wykonuję komendy. Zapewnia to, że współdzielimy te same procesy automatyzacji.
