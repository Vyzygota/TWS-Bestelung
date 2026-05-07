---
name: fix-bug
description: Diagnozuj i napraw błąd w TWS Bestelung. Używaj gdy formularz nie działa poprawnie, dane nie trafiają do arkusza, e-mail nie jest wysyłany lub UI zachowuje się nieprawidłowo.
---

# fix-bug

Diagnozowanie i naprawa błędów w TWS Bestelung.

## Najpierw zlokalizuj warstwę błędu

### Błąd frontendu (UI)
Objawy: formularz nie wysyła, walidacja nie działa, tekst nie wyświetla się poprawnie, błąd w konsoli przeglądarki.

Gdzie szukać:
- `app.js` — logika formularza, walidacja, `translations`
- `index.html` — struktura UI, atrybuty elementów
- `style.css` — tylko jeśli problem wizualny

### Błąd backendu (Apps Script)
Objawy: dane nie trafiają do arkusza Orders, e-mail nie jest wysyłany, zamówienie "znika".

Gdzie szukać:
- `backend/Kod.js` — funkcja `doPost()`, parsowanie `e.parameter`, zapis do Sheets
- Logi Apps Script: `script.google.com` → projekt → Wykonania

Pamiętaj przy debugowaniu backendu:
- Frontend wysyła POST z `mode: 'no-cors'` — brak odpowiedzi po stronie klienta to **normalne**, nie błąd
- Arkusz Clients nie ma nagłówka — iteracja od `i = 0`

### Błąd danych (arkusz)
Objawy: klient nie jest rozpoznawany, styl jest niepoprawny, dane w złej kolumnie.

Gdzie szukać:
- Arkusz `Clients` (Google Sheets) — sprawdź kolumny A–F dla konkretnego klienta
- Arkusz `Orders` — sprawdź czy dane trafiają w odpowiednie kolumny A–AG

## Workflow naprawy

1. Odczytaj `CLAUDE.md` jeśli nie masz kontekstu projektu
2. Zlokalizuj warstwę błędu (frontend / backend / dane)
3. Sprawdź odpowiedni plik — nie edytuj nic zanim nie zrozumiesz przyczyny
4. Wprowadź minimalną zmianę naprawiającą błąd
5. Jeśli zmieniony był `backend/Kod.js` — uruchom skill `deploy`

## Typowe błędy i ich przyczyny

| Objaw | Prawdopodobna przyczyna |
|---|---|
| Klient nie jest rozpoznawany | Iteracja Clients od `i = 1` zamiast `i = 0` |
| Formularz nie wysyła, brak błędu | `mode: 'no-cors'` pochłania błędy — sprawdź logi Apps Script |
| Styl "4mm" dla wszystkich | `e.parameter.style` nie jest przekazywany lub nie trafia do `rowData` |
| Brak e-maila do klienta | Sprawdź `MailApp.sendEmail()` w Kod.js i logi Wykonania |
| Tekst UI w złym języku | Klucz `translations` nie istnieje dla danego języka |
