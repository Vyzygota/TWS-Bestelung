---
name: deploy
description: Wdróż zmiany backendu (Kod.js) do Google Apps Script przez clasp. Używaj po każdej zmianie w backend/Kod.js.
---

# deploy

Wdrożenie zmian backendu do Google Apps Script.

## Kiedy używać

Po każdej zmianie w `backend/Kod.js`. Frontend (`index.html`, `app.js`, `style.css`) jest hostowany na GitHub Pages i nie wymaga osobnego deploymentu — wystarczy push do `main`.

## Kroki

### 1. Wypchnij kod do Apps Script

```bash
cd backend
clasp push
```

### 2. Utwórz nową wersję deploymentu

```bash
clasp deploy --deploymentId AKfycbxZsT2WpaWXZNKxXiAdHkPjzyCCPmlMLPsEn3N6tKD3jGboUKoSwh0SoWwX9XdEYh8Y --description "opis zmiany"
```

Zawsze używaj tego samego `deploymentId` — to aktualizuje istniejący Web App URL, a nie tworzy nowego.

### 3. Zweryfikuj

Sprawdź w Apps Script (`script.google.com`) że nowa wersja jest aktywna. Możesz też wykonać testowe zamówienie przez formularz.

## Pułapki

- **Nie twórz nowego deploymentu** — zawsze aktualizuj istniejący przez `--deploymentId`. Nowy deployment generuje nowy URL, który nie jest skonfigurowany w frontendzie.
- `clasp push` bez `clasp deploy` nie aktualizuje działającego Web App — tylko wysyła kod do edytora.
- Jeśli `clasp` nie jest zalogowany: `clasp login` przed pierwszym użyciem.

## Deployment frontendu

Frontend (`index.html`, `app.js`, `style.css`) jest automatycznie publikowany przez GitHub Pages po push do brancha `main`. Brak dodatkowych kroków.
