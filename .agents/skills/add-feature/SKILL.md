---
name: add-feature
description: Dodaj nową funkcję do formularza TWS. Używaj gdy użytkownik prosi o nowe zachowanie UI, nowe pole, nową logikę walidacji lub nową kolumnę w arkuszu Orders.
---

# add-feature

Dodawanie nowej funkcji do systemu TWS Bestelung.

## Przed implementacją

Zadaj użytkownikowi pytania wyjaśniające zanim zaczniesz pisać kod:

1. **Co widzi użytkownik?** — jaki jest nowy element UI lub zmiana zachowania
2. **Co trafia do arkusza?** — czy zmiana wymaga nowej kolumny w Orders lub Clients
3. **Wielojęzyczność** — czy nowy tekst wymaga tłumaczeń DE / PL / EN
4. **Walidacja** — czy nowe pole jest wymagane, opcjonalne, jakie warunki musi spełniać

## Struktura implementacji

### Frontend (`app.js` + `index.html`)

- Nowe pola UI dodawaj w `index.html` w odpowiedniej sekcji formularza
- Logika walidacji — w funkcji `validateForm()` lub inline przy `submit`
- Tłumaczenia — dodaj klucze do obiektu `translations` dla wszystkich trzech języków (DE, PL, EN)
- Nowe dane zbierane z formularza — dodaj do obiektu `formData` przed wysłaniem

### Backend (`backend/Kod.js`)

- Nowe pole z `formData` — odbierz z `e.parameter.nazwaPolaFeld`
- Nowe kolumny w Orders — dopisz wartość do tablicy `rowData` w odpowiedniej pozycji
- Pamiętaj: arkusz Clients **nie ma wiersza nagłówkowego** — iteruj od `i = 0`

### Po implementacji

Uruchom skill `deploy` jeśli zmieniałeś `backend/Kod.js`.

## Typowe pułapki

- Frontend nie może odczytać odpowiedzi backendu (`no-cors`) — nie dodawaj logiki zależnej od odpowiedzi POST
- Nowe pole wymagane? Sprawdź czy walidacja obejmuje wszystkie kategorie produktów (pościel `bed_`, ręczniki `tow_`, obrusy `tb_`)
- Obrusy (`tb_`) są wyjęte z walidacji "co najmniej jeden produkt" — jeśli dodajesz nową kategorię, ustal czy ma ten sam wyjątek
