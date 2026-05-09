/**
 * TWS Rügen - Order System Logic
 * Refactored and improved frontend logic.
 */

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxZsT2WpaWXZNKxXiAdHkPjzyCCPmlMLPsEn3N6tKD3jGboUKoSwh0SoWwX9XdEYh8Y/exec";
const API_KEY = "cc38db64bdab951fa5638d58d3063e47cc4ac57cb4c79fd7";

// Translations Dictionary
const dict = {
    'de': {
        clientData: 'Bestellerdaten', clientName: 'Name des Kunden', clientId: 'Kundennummer (6 Ziffern)', email: 'E-Mail',
        diffReceiverText: 'Empfänger weicht ab', receiverName: 'Name des Empfängers', receiverEmail: 'Empfänger E-Mail', city: 'Ort (Lieferung)',
        orderDate: 'Bestelldatum:', deliveryDate: 'Voraussichtliche Lieferung:',
        sec1: 'Bettwäsche (Weiß)', bed1: 'Bettbezug', bed2: 'Kissenbezug 80x80', bed3: 'Kissenbezug 60x80', bed4: 'Kissenbezug 40x80', bed5: 'Bettlaken', bed6: 'Französisches Bettlaken',
        sec2: 'Frottee / Handtücher', tow1: 'Handtuch klein', tow2: 'Handtuch groß', tow3: 'Badvorleger', tow4: 'Duschtuch / Badetuch', tow5: 'Geschirrtücher',
        sec3: 'Tischwäsche', tab1: 'Servietten 50x50', tab2: 'Tischdecke 80x80', tab3: 'Tischdecke 100x100', tab4: 'Tischdecke 130x130', tab5: 'Tischdecke 130x170', tab6: 'Tischdecke 130x200',
        sec4: 'Farbige Bettwäsche', selectColor: 'Farbe auswählen', col1: 'Gelb', col2: 'Beige', col3: 'Rosa', col4: 'Weiß-Blau', col5: 'Weiß-Gelb',
        btnSubmit: 'Kostenpflichtig bestellen', footer: 'Alle Rechte vorbehalten.',
        notes: 'Zusätzliche Anmerkungen',
        errReq: 'Bitte füllen Sie Name und E-Mail aus!', errId: 'Die Kundennummer muss genau 6 Ziffern enthalten!', errEmpty: 'Bitte wählen Sie mindestens einen Artikel aus!', errCode: 'Bitte geben Sie den 4-stelligen Verifizierungscode ein!',
        msgSending: 'Bestellung wird gesendet...', msgSuccess: 'Erfolgreich gesendet! Ihre Bestellung wurde erfasst.', msgError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', errInvalidCode: 'Ungültiger Verifizierungscode.',
        btnVerify: 'Daten abrufen & Code senden', verifyCode: 'Verifizierungscode (4 Ziffern)', verifyMsg: 'Code wurde an Ihre E-Mail gesendet.'
    },
    'pl': {
        clientData: 'Dane Zamawiającego', clientName: 'Nazwa Klienta', clientId: 'Nr klienta (6 cyfr)', email: 'Adres E-mail',
        diffReceiverText: 'Inny odbiorca', receiverName: 'Nazwa odbiorcy', receiverEmail: 'E-mail odbiorcy', city: 'Miejscowość (Dostawa)',
        orderDate: 'Data zamówienia:', deliveryDate: 'Przewidywana dostawa:',
        sec1: 'Pościele (Białe)', bed1: 'Poszewka na kołdrę', bed2: 'Poszewka 80x80', bed3: 'Poszewka 60x80', bed4: 'Poszewka 40x80', bed5: 'Prześcieradło', bed6: 'Prześcieradło francuskie',
        sec2: 'Ręczniki', tow1: 'Ręcznik mały', tow2: 'Ręcznik duży', tow3: 'Stopka', tow4: 'Ręcznik kąpielowy', tow5: 'Ścierka do naczyń',
        sec3: 'Obrusy', tab1: 'Serwetki 50x50', tab2: 'Obrus 80x80', tab3: 'Obrus 100x100', tab4: 'Obrus 130x130', tab5: 'Obrus 130x170', tab6: 'Obrus 130x200',
        sec4: 'Pościele kolorowe', selectColor: 'Wybierz kolor', col1: 'Żółty', col2: 'Beżowy', col3: 'Różowy', col4: 'Biało-niebieskie', col5: 'Biało-żółte',
        btnSubmit: 'Zamów z obowiązkiem zapłaty', footer: 'Wszelkie prawa zastrzeżone.',
        notes: 'Uwagi',
        errReq: 'Proszę wypełnić wymagane pola (Nazwa, Email)!', errId: 'Numer klienta musi składać się dokładnie z 6 cyfr!', errEmpty: 'Proszę wybrać przynajmniej jeden produkt!', errCode: 'Proszę wprowadzić 4-cyfrowy kod weryfikacyjny!',
        msgSending: 'Wysyłanie zamówienia...', msgSuccess: 'Sukces! Zamówienie zostało pomyślnie złożone.', msgError: 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.', errInvalidCode: 'Nieprawidłowy kod weryfikacyjny.',
        btnVerify: 'Pobierz dane i wyślij kod', verifyCode: 'Kod weryfikacyjny (4 cyfry)', verifyMsg: 'Kod został wysłany na Twój adres e-mail.'
    },
    'en': {
        clientData: 'Customer Data', clientName: 'Customer Name', clientId: 'Customer ID (6 digits)', email: 'E-mail address',
        diffReceiverText: 'Different receiver', receiverName: 'Receiver Name', receiverEmail: 'Receiver E-mail', city: 'City (Delivery)',
        orderDate: 'Order Date:', deliveryDate: 'Estimated Delivery:',
        sec1: 'Bed Linen (White)', bed1: 'Duvet cover', bed2: 'Pillowcase 80x80', bed3: 'Pillowcase 60x80', bed4: 'Pillowcase 40x80', bed5: 'Bed sheet', bed6: 'French bed sheet',
        sec2: 'Towels', tow1: 'Small towel', tow2: 'Large towel', tow3: 'Bath mat', tow4: 'Bath towel', tow5: 'Dishcloth',
        sec3: 'Tablecloths', tab1: 'Napkins 50x50', tab2: 'Tablecloth 80x80', tab3: 'Tablecloth 100x100', tab4: 'Tablecloth 130x130', tab5: 'Tablecloth 130x170', tab6: 'Tablecloth 130x200',
        sec4: 'Colored Bed Linen', selectColor: 'Select Color', col1: 'Yellow', col2: 'Beige', col3: 'Pink', col4: 'White-Blue', col5: 'White-Yellow',
        btnSubmit: 'Submit Order', footer: 'All rights reserved.',
        notes: 'Additional Notes',
        errReq: 'Please fill in Name and E-Mail!', errId: 'Customer ID must be exactly 6 digits!', errEmpty: 'Please select at least one item!', errCode: 'Please enter the 4-digit verification code!',
        msgSending: 'Sending order...', msgSuccess: 'Success! Order successfully submitted.', msgError: 'An error occurred while sending. Please try again.', errInvalidCode: 'Invalid verification code.',
        btnVerify: 'Get data & send code', verifyCode: 'Verification code (4 digits)', verifyMsg: 'Code has been sent to your email.'
    }
};

/**
 * Language Switching Logic
 */
function changeLang() {
    const lang = document.getElementById('langSwitch').value;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[lang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = dict[lang][key];
            else el.innerText = dict[lang][key];
        }
    });
    calcDeliveryDate();
}

/**
 * Toggle Receiver Data Visibility
 */
function toggleReceiver() {
    const isChecked = document.getElementById('diffReceiver').checked;
    const receiverData = document.getElementById('receiverData');
    if (isChecked) {
        receiverData.classList.remove('hidden');
        receiverData.style.opacity = 0;
        setTimeout(() => {
            receiverData.style.transition = 'opacity 0.3s ease-in-out';
            receiverData.style.opacity = 1;
        }, 10);
    } else {
        receiverData.classList.add('hidden');
    }
}

/**
 * Calculate Mecklenburg-Vorpommern Holidays
 */
function getMVHolidays(year) {
    const holidays = [
        `01-01-${year}`, // Neujahr
        `08-03-${year}`, // Frauentag (MV)
        `01-05-${year}`, // Tag der Arbeit
        `03-10-${year}`, // Tag der Deutschen Einheit
        `31-10-${year}`, // Reformationstag
        `25-12-${year}`, // 1. Weihnachtstag
        `26-12-${year}`  // 2. Weihnachtstag
    ];

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    const easter = new Date(year, month - 1, day);
    
    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    holidays.push(addDays(easter, -2)); // Karfreitag
    holidays.push(addDays(easter, 1));  // Ostermontag
    holidays.push(addDays(easter, 39)); // Christi Himmelfahrt
    holidays.push(addDays(easter, 50)); // Pfingstmontag

    return holidays;
}

function isWorkingDay(date) {
    const day = date.getDay();
    if (day === 0 || day === 6) return false; // Weekend (Sun = 0, Sat = 6)
    
    const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    const holidays = getMVHolidays(date.getFullYear());
    
    return !holidays.includes(dateStr);
}

function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    
    while (!isWorkingDay(currentDate)) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    let addedDays = 0;
    while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (isWorkingDay(currentDate)) {
            addedDays++;
        }
    }
    return currentDate;
}

/**
 * Calculate and Display Delivery Date
 */
function calcDeliveryDate() {
    const lang = document.getElementById('langSwitch').value;
    const locales = { 'de': 'de-DE', 'pl': 'pl-PL', 'en': 'en-GB' };
    const locale = locales[lang];

    const today = new Date();
    const todayEl = document.getElementById('todayDate');
    const calcEl = document.getElementById('calcDate');

    if (todayEl && calcEl) {
        todayEl.innerText = today.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const deliveryDate = addWorkingDays(today, 2); // 2 working days buffer

        calcEl.innerText = deliveryDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const yyyy = deliveryDate.getFullYear();
        const mm = String(deliveryDate.getMonth() + 1).padStart(2, '0');
        const dd = String(deliveryDate.getDate()).padStart(2, '0');
        calcEl.setAttribute('data-excel-date', `${yyyy}-${mm}-${dd}`);
    }
}

/**
 * Client ID Input Management
 */
const idBoxes = document.querySelectorAll('.client-id-box');
idBoxes.forEach((box, index) => {
    box.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 1) this.value = this.value.slice(-1);
        if (this.value.length === 1 && index < idBoxes.length - 1) idBoxes[index + 1].focus();
        checkAndFetchClient();
    });
    box.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
            idBoxes[index - 1].focus();
            idBoxes[index - 1].value = '';
            checkAndFetchClient();
        }
    });
    box.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text');
        const numbers = pastedData.replace(/[^0-9]/g, '').split('');
        let currIndex = index;
        for (let i = 0; i < numbers.length && currIndex < idBoxes.length; i++) {
            idBoxes[currIndex].value = numbers[i];
            currIndex++;
        }
        if (currIndex < idBoxes.length) idBoxes[currIndex].focus();
        else idBoxes[idBoxes.length - 1].focus();
        checkAndFetchClient();
    });
});

/**
 * Fetch client data from Google Sheets
 */
function checkAndFetchClient() {
    let clientId = "";
    idBoxes.forEach(b => clientId += b.value);

    const verifyBtn = document.getElementById('verifyBtn');
    const verificationSection = document.getElementById('verificationSection');
    
    if (clientId.length === 6) {
        verifyBtn.classList.remove('hidden');
    } else {
        verifyBtn.classList.add('hidden');
        verificationSection.classList.add('hidden');
        document.getElementById('clientName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mainCity').value = '';
        document.getElementById('verificationCode').value = '';
        idBoxes.forEach(box => box.classList.remove('bg-green-100', 'text-green-800', 'bg-blue-50', 'animate-pulse'));
    }
}

async function sendVerificationCode() {
    let clientId = "";
    idBoxes.forEach(b => clientId += b.value);
    
    if (clientId.length !== 6) return;

    const verifyBtn = document.getElementById('verifyBtn');
    const errorDiv = document.getElementById('clientError');
    const verificationSection = document.getElementById('verificationSection');
    
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('email');
    const cityInput = document.getElementById('mainCity');

    const lang = document.getElementById('langSwitch').value;
    const originalBtnText = verifyBtn.innerHTML;
    
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ...`;
    
    if (errorDiv) {
        errorDiv.textContent = "";
        errorDiv.classList.add('hidden');
    }

    try {
        const url = `${WEB_APP_URL}?action=getClient&clientId=${clientId}&sendCode=true`;
        console.log("Fetching and sending code:", url);
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            console.log("Client data received:", data);
            
            if (data && !data.error) {
                if (data.name) nameInput.value = data.name;
                if (data.email) emailInput.value = data.email;
                if (data.city) cityInput.value = data.city;

                idBoxes.forEach(box => {
                    box.classList.remove('bg-blue-50');
                    box.classList.add('bg-green-100', 'text-green-800');
                    setTimeout(() => box.classList.remove('bg-green-100', 'text-green-800'), 2000);
                });
                calcDeliveryDate();
                
                verifyBtn.classList.add('hidden');
                verificationSection.classList.remove('hidden');
                document.getElementById('verificationCode').focus();
            } else {
                console.warn("Client not found or error:", data.error);
                if (errorDiv) {
                    errorDiv.textContent = data.error || "Client not found";
                    errorDiv.classList.remove('hidden');
                }
            }
        } else {
            console.error("Server returned status:", response.status);
            if (errorDiv) {
                errorDiv.textContent = "Server error: " + response.status;
                errorDiv.classList.remove('hidden');
            }
        }
    } catch (e) {
        console.error("Fetch error details:", e);
        if (errorDiv) {
            errorDiv.textContent = "Connection error. Check console (F12).";
            errorDiv.classList.remove('hidden');
        }
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = originalBtnText;
    }
}

function getVal(id) {
    return document.getElementById(id).value || 0;
}

/**
 * Submit Order
 */
function submitOrder() {
    const lang = document.getElementById('langSwitch').value;
    const clientName = document.getElementById('clientName').value.trim();
    const email = document.getElementById('email').value.trim();
    const clientId = Array.from(idBoxes).map(box => box.value).join('');
    const verificationCode = document.getElementById('verificationCode').value.trim();
    const isDiffReceiver = document.getElementById('diffReceiver').checked;

    if (!clientName || !email) { alert(dict[lang]['errReq']); return; }
    if (clientId.length !== 6 || !/^\d{6}$/.test(clientId)) { alert(dict[lang]['errId']); return; }
    if (verificationCode.length !== 4 || !/^\d{4}$/.test(verificationCode)) { alert(dict[lang]['errCode']); return; }

    const payload = {
        apiKey: API_KEY,
        clientName: clientName,
        clientId: clientId,
        verificationCode: verificationCode,
        email: email,
        city: document.getElementById('mainCity').value,
        deliveryDate: document.getElementById('calcDate').getAttribute('data-excel-date'),
        diffReceiver: isDiffReceiver,
        receiverName: isDiffReceiver ? document.getElementById('receiverName').value : '',
        receiverEmail: isDiffReceiver ? document.getElementById('receiverEmail').value : '',
        notes: document.getElementById('notes').value,

        w_bed1: getVal('w_bed1'), w_bed2: getVal('w_bed2'), w_bed3: getVal('w_bed3'), w_bed4: getVal('w_bed4'), w_bed5: getVal('w_bed5'), w_bed6: getVal('w_bed6'),
        t_tow1: getVal('t_tow1'), t_tow2: getVal('t_tow2'), t_tow3: getVal('t_tow3'), t_tow4: getVal('t_tow4'), t_tow5: getVal('t_tow5'),
        tb_tab1: getVal('tb_tab1'), tb_tab2: getVal('tb_tab2'), tb_tab3: getVal('tb_tab3'), tb_tab4: getVal('tb_tab4'), tb_tab5: getVal('tb_tab5'), tb_tab6: getVal('tb_tab6'),
        c_color: document.getElementById('c_color').value, c_bed1: getVal('c_bed1'), c_bed2: getVal('c_bed2'), c_bed3: getVal('c_bed3')
    };

    // Validation: At least one item ordered
    const itemKeys = Object.keys(payload).filter(k => k.match(/^(w_|t_|tb_|c_bed)/));
    const hasItems = itemKeys.some(k => parseInt(payload[k]) > 0);
    if (!hasItems) { alert(dict[lang]['errEmpty']); return; }

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnClass = submitBtn.className;
    const originalBtnHTML = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-blue-500 font-pj rounded-xl cursor-not-allowed opacity-90";
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${dict[lang]['msgSending']}`;

    const resetBtn = () => {
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.className = originalBtnClass;
            submitBtn.innerHTML = originalBtnHTML;
        }, 4000);
    };

    // Step 1: Verify code via GET
    fetch(`${WEB_APP_URL}?action=verifyCode&clientId=${clientId}&code=${verificationCode}`)
    .then(async (response) => {
        if (!response.ok) throw new Error("Connection Error");
        const data = await response.json();
        if (!data.valid) {
            throw new Error(dict[lang]['errInvalidCode']);
        }
        
        // Step 2: If code is valid, proceed with POST (no-cors)
        return fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
    })
    .then((postResponse) => {
        if (!postResponse) return; // Means error was caught in previous step
        
        submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-green-500 font-pj rounded-xl";
        submitBtn.innerHTML = `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${dict[lang]['msgSuccess']}`;
        document.getElementById('orderForm').reset();
        idBoxes.forEach(box => box.value = '');
        document.getElementById('verificationSection').classList.add('hidden');
        document.getElementById('verifyBtn').classList.add('hidden');
        calcDeliveryDate();
        resetBtn();
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-red-500 font-pj rounded-xl";
        // Show specific error if provided
        const errMsg = error.message && (error.message.includes('ungültig') || error.message.includes('Invalid') || error.message.includes('Nieprawidłowy')) ? error.message : dict[lang]['msgError'];
        submitBtn.innerHTML = `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> ${errMsg}`;
        resetBtn();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    calcDeliveryDate();
    changeLang();
});
