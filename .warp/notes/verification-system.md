# System Weryfikacji Zamówień (TWS Bestelung)

Ten dokument stanowi część **Warp Drive** (współdzielonej bazy wiedzy) dla projektu TWS Bestelung.

## Cel systemu
Zabezpieczenie formularza przed nieautoryzowanym użyciem (tzw. zamknięty obieg danych klienta). Użytkownicy nie mogą sami modyfikować swoich danych (Nazwa, E-mail, Miejscowość), są one wyłącznie pobierane z autoryzowanej bazy Google Sheets na podstawie ID Klienta.

## Architektura rozwiązania

1. **Frontend (`index.html`, `app.js`)**
   - Pola danych są zablokowane (`readonly="true"`, `autocomplete="off"`).
   - Wpisanie 6-cyfrowego ID odkrywa przycisk "Pobierz dane i wyślij kod".
   - Przed właściwym wysłaniem zamówienia (POST), wykonywany jest test próbny (pre-flight GET) weryfikujący podany 4-cyfrowy kod.

2. **Backend (`backend/Kod.js` - Google Apps Script)**
   - **`doGet` (action: getClient&sendCode=true)**: Generuje 4-cyfrowy kod, zapisuje w `CacheService` na 15 minut i wysyła HTML E-mail do klienta.
   - **`doGet` (action: verifyCode)**: Weryfikuje przesłany kod względem Cache. Tu zaimplementowany jest mechanizm **Rate-Limitingu**.
   - **`doPost`**: Dla 100% bezpieczeństwa, kod jest weryfikowany ponownie w locie i od razu niszczony (`cache.remove()`), co zapobiega powielaniu zamówień z tym samym kodem.

## Mechanizm Blokady (Rate-Limiting)
- 3-krotne podanie błędnego kodu skutkuje natychmiastowym założeniem blokady dla danego ID Klienta.
- Blokada utrzymuje się dokładnie 30 minut (`CacheService.put("BLOCKED_...", 1800)`).
- Zarówno frontend jak i backend odrzucają wszelkie zapytania wysłane podczas trwania blokady, wyświetlając stosowny błąd.
