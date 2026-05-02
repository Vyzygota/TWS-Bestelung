
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxjHUlnfXgppB5hBoSRLn7hmzpddExRPXLWE46k_RAMScPXsNu61JRZ3-IpMw9W9fTf/exec";
        document.getElementById('year').innerText = new Date().getFullYear();

        // Checkbox Toggle Styling
        const cssStyle = document.createElement('style');
        cssStyle.innerHTML = `
            input:checked ~ .dot { transform: translateX(100%); }
            input:checked ~ .block { background-color: #003366; }
        `;
        document.head.appendChild(cssStyle);

        // Translations Dictionary
        const dict = {
            'de': {
                clientData: 'Bestellerdaten', clientName: 'Name des Kunden', clientId: 'Kundennummer (6 Ziffern)', email: 'E-Mail',
                diffReceiverText: 'Empfänger weicht ab', receiverName: 'Name des Empfängers', receiverEmail: 'Empfänger E-Mail', city: 'Ort (Lieferung)',
                orderDate: 'Bestelldatum:', deliveryDate: 'Voraussichtliche Lieferung:',
                sec1: 'Bettwäsche (Weiß)', bed1: 'Bettbezug', bed2: 'Kissenbezug 80x80', bed3: 'Kissenbezug 60x80', bed4: 'Kissenbezug 40x80', bed5: 'Bettlaken',
                sec2: 'Frottee / Handtücher', tow1: 'Handtuch klein', tow2: 'Handtuch groß', tow3: 'Badvorleger', tow4: 'Duschtuch / Badetuch', tow5: 'Geschirrtücher',
                sec3: 'Tischwäsche', tab1: 'Servietten 50x50', tab2: 'Tischdecke 80x80', tab3: 'Tischdecke 100x100', tab4: 'Tischdecke 130x130', tab5: 'Tischdecke 130x170', tab6: 'Tischdecke 130x200',
                sec4: 'Farbige Bettwäsche', selectColor: 'Farbe auswählen', col1: 'Gelb', col2: 'Beige', col3: 'Rosa', col4: 'Weiß-Blau', col5: 'Weiß-Gelb',
                btnSubmit: 'Kostenpflichtig bestellen', footer: 'Alle Rechte vorbehalten.',
                errReq: 'Bitte füllen Sie Name und E-Mail aus!', errId: 'Die Kundennummer muss genau 6 Ziffern enthalten!',
                msgSending: 'Bestellung wird gesendet...', msgSuccess: 'Erfolgreich gesendet! Ihre Bestellung wurde erfasst.', msgError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
            },
            'pl': {
                clientData: 'Dane Zamawiającego', clientName: 'Nazwa Klienta', clientId: 'Nr klienta (6 cyfr)', email: 'Adres E-mail',
                diffReceiverText: 'Inny odbiorca', receiverName: 'Nazwa odbiorcy', receiverEmail: 'E-mail odbiorcy', city: 'Miejscowość (Dostawa)',
                orderDate: 'Data zamówienia:', deliveryDate: 'Przewidywana dostawa:',
                sec1: 'Pościele (Białe)', bed1: 'Poszewka na kołdrę', bed2: 'Poszewka 80x80', bed3: 'Poszewka 60x80', bed4: 'Poszewka 40x80', bed5: 'Prześcieradło',
                sec2: 'Ręczniki', tow1: 'Ręcznik mały', tow2: 'Ręcznik duży', tow3: 'Stopka', tow4: 'Ręcznik kąpielowy', tow5: 'Ścierka do naczyń',
                sec3: 'Obrusy', tab1: 'Serwetki 50x50', tab2: 'Obrus 80x80', tab3: 'Obrus 100x100', tab4: 'Obrus 130x130', tab5: 'Obrus 130x170', tab6: 'Obrus 130x200',
                sec4: 'Pościele kolorowe', selectColor: 'Wybierz kolor', col1: 'Żółty', col2: 'Beżowy', col3: 'Różowy', col4: 'Biało-niebieskie', col5: 'Biało-żółte',
                btnSubmit: 'Zamów z obowiązkiem zapłaty', footer: 'Wszelkie prawa zastrzeżone.',
                errReq: 'Proszę wypełnić wymagane pola (Nazwa, Email)!', errId: 'Numer klienta musi składać się dokładnie z 6 cyfr!',
                msgSending: 'Wysyłanie zamówienia...', msgSuccess: 'Sukces! Zamówienie zostało pomyślnie złożone.', msgError: 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.'
            },
            'en': {
                clientData: 'Customer Data', clientName: 'Customer Name', clientId: 'Customer ID (6 digits)', email: 'E-mail address',
                diffReceiverText: 'Different receiver', receiverName: 'Receiver Name', receiverEmail: 'Receiver E-mail', city: 'City (Delivery)',
                orderDate: 'Order Date:', deliveryDate: 'Estimated Delivery:',
                sec1: 'Bed Linen (White)', bed1: 'Duvet cover', bed2: 'Pillowcase 80x80', bed3: 'Pillowcase 60x80', bed4: 'Pillowcase 40x80', bed5: 'Bed sheet',
                sec2: 'Towels', tow1: 'Small towel', tow2: 'Large towel', tow3: 'Bath mat', tow4: 'Bath towel', tow5: 'Dishcloth',
                sec3: 'Tablecloths', tab1: 'Napkins 50x50', tab2: 'Tablecloth 80x80', tab3: 'Tablecloth 100x100', tab4: 'Tablecloth 130x130', tab5: 'Tablecloth 130x170', tab6: 'Tablecloth 130x200',
                sec4: 'Colored Bed Linen', selectColor: 'Select Color', col1: 'Yellow', col2: 'Beige', col3: 'Pink', col4: 'White-Blue', col5: 'White-Yellow',
                btnSubmit: 'Submit Order', footer: 'All rights reserved.',
                errReq: 'Please fill in Name and E-mail!', errId: 'Customer ID must be exactly 6 digits!',
                msgSending: 'Sending order...', msgSuccess: 'Success! Order successfully submitted.', msgError: 'An error occurred while sending. Please try again.'
            }
        };

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

        function calcDeliveryDate() {
            const lang = document.getElementById('langSwitch').value;
            const locales = { 'de': 'de-DE', 'pl': 'pl-PL', 'en': 'en-GB' };
            const locale = locales[lang];

            const today = new Date();
            const todayEl = document.getElementById('todayDate');
            const calcEl = document.getElementById('calcDate');

            if (todayEl && calcEl) {
                todayEl.innerText = today.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                const deliveryDate = new Date(today);
                deliveryDate.setDate(today.getDate() + 2); // 2-day buffer

                calcEl.innerText = deliveryDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                // Excel-compatible format YYYY-MM-DD
                const yyyy = deliveryDate.getFullYear();
                const mm = String(deliveryDate.getMonth() + 1).padStart(2, '0');
                const dd = String(deliveryDate.getDate()).padStart(2, '0');
                calcEl.setAttribute('data-excel-date', `${yyyy}-${mm}-${dd}`);
            }
        }

        // Handle Client ID inputs (auto-focus next)
        const idBoxes = document.querySelectorAll('.client-id-box');
        idBoxes.forEach((box, index) => {
            // allow only numbers
            box.addEventListener('input', function () {
                this.value = this.value.replace(/[^0-9]/g, '');

                // Keep only the last typed character if more than one is typed
                if (this.value.length > 1) {
                    this.value = this.value.slice(-1);
                }

                if (this.value.length === 1 && index < idBoxes.length - 1) {
                    idBoxes[index + 1].focus();
                }
                checkAndFetchClient();
            });
            box.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    idBoxes[index - 1].focus();
                    idBoxes[index - 1].value = '';
                    checkAndFetchClient();
                }
            });
            // Handle paste
            box.addEventListener('paste', function (e) {
                e.preventDefault();
                const pastedData = (e.clipboardData || window.clipboardData).getData('text');
                const numbers = pastedData.replace(/[^0-9]/g, '').split('');

                let currIndex = index;
                for (let i = 0; i < numbers.length && currIndex < idBoxes.length; i++) {
                    idBoxes[currIndex].value = numbers[i];
                    currIndex++;
                }

                if (currIndex < idBoxes.length) {
                    idBoxes[currIndex].focus();
                } else {
                    idBoxes[idBoxes.length - 1].focus();
                }
                checkAndFetchClient();
            });
        });

        // Fetch client data from Google Sheets
        async function checkAndFetchClient() {
            let clientId = "";
            idBoxes.forEach(b => clientId += b.value);

            if (clientId.length === 6) {
                const nameInput = document.getElementById('clientName');
                const emailInput = document.getElementById('email');
                const citySelect = document.getElementById('mainCity');

                // Visual indication of loading
                idBoxes.forEach(box => {
                    box.classList.add('bg-blue-50', 'animate-pulse');
                });

                try {
                    // Try to fetch data using GET request to Web App
                    const url = `${WEB_APP_URL}?action=getClient&clientId=${clientId}`;
                    const response = await fetch(url);

                    if (response.ok) {
                        const data = await response.json();
                        if (data && !data.error) {
                            if (data.name) nameInput.value = data.name;
                            if (data.email) emailInput.value = data.email;
                            if (data.city) {
                                Array.from(citySelect.options).forEach(opt => {
                                    if (opt.value.toLowerCase() === data.city.toLowerCase() ||
                                        opt.text.toLowerCase().includes(data.city.toLowerCase())) {
                                        citySelect.value = opt.value;
                                    }
                                });
                                calcDeliveryDate();
                            }

                            // Success feedback
                            idBoxes.forEach(box => {
                                box.classList.remove('animate-pulse', 'bg-blue-50');
                                box.classList.add('bg-green-100', 'text-green-800');
                                setTimeout(() => {
                                    box.classList.remove('bg-green-100', 'text-green-800');
                                }, 2000);
                            });
                        } else {
                            // Reset state if not found
                            idBoxes.forEach(box => box.classList.remove('animate-pulse', 'bg-blue-50'));
                        }
                    } else {
                        idBoxes.forEach(box => box.classList.remove('animate-pulse', 'bg-blue-50'));
                    }
                } catch (e) {
                    console.error("Error fetching client data:", e);
                    idBoxes.forEach(box => box.classList.remove('animate-pulse', 'bg-blue-50'));
                }
            } else {
                // If ID is modified and length < 6, reset visual state
                idBoxes.forEach(box => {
                    box.classList.remove('bg-green-100', 'text-green-800', 'bg-blue-50', 'animate-pulse');
                });
            }
        }

        function getVal(id) {
            return document.getElementById(id).value || 0;
        }

        function submitOrder() {
            const lang = document.getElementById('langSwitch').value;
            const clientName = document.getElementById('clientName').value.trim();
            const email = document.getElementById('email').value.trim();
            const clientId = Array.from(idBoxes).map(box => box.value).join('');

            if (!clientName || !email) { alert(dict[lang]['errReq']); return; }
            if (clientId.length !== 6 || !/^\d{6}$/.test(clientId)) { alert(dict[lang]['errId']); return; }

            const payload = {
                clientName: clientName,
                clientId: clientId,
                email: email,
                city: document.getElementById('mainCity').value,
                deliveryDate: document.getElementById('calcDate').getAttribute('data-excel-date'),
                diffReceiver: document.getElementById('diffReceiver').checked,
                receiverName: document.getElementById('receiverName').value,
                receiverEmail: document.getElementById('receiverEmail').value,

                w_bed1: getVal('w_bed1'), w_bed2: getVal('w_bed2'), w_bed3: getVal('w_bed3'), w_bed4: getVal('w_bed4'), w_bed5: getVal('w_bed5'),
                t_tow1: getVal('t_tow1'), t_tow2: getVal('t_tow2'), t_tow3: getVal('t_tow3'), t_tow4: getVal('t_tow4'), t_tow5: getVal('t_tow5'),
                tb_tab1: getVal('tb_tab1'), tb_tab2: getVal('tb_tab2'), tb_tab3: getVal('tb_tab3'), tb_tab4: getVal('tb_tab4'), tb_tab5: getVal('tb_tab5'), tb_tab6: getVal('tb_tab6'),
                c_color: document.getElementById('c_color').value, c_bed1: getVal('c_bed1'), c_bed2: getVal('c_bed2'), c_bed3: getVal('c_bed3')
            };

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnClass = submitBtn.className;
            const originalBtnHTML = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-blue-500 font-pj rounded-xl cursor-not-allowed opacity-90";
            submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${dict[lang]['msgSending']}`;

            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-green-500 font-pj rounded-xl";
                    submitBtn.innerHTML = `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${dict[lang]['msgSuccess']}`;

                    document.getElementById('orderForm').reset();
                    idBoxes.forEach(box => box.value = '');
                    calcDeliveryDate();
                })
                .catch(error => {
                    console.error('Error:', error);
                    submitBtn.className = "group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-red-500 font-pj rounded-xl";
                    submitBtn.innerHTML = `<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> ${dict[lang]['msgError']}`;
                })
                .finally(() => {
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.className = originalBtnClass;
                        submitBtn.innerHTML = originalBtnHTML;
                    }, 4000);
                });
        }

        document.addEventListener("DOMContentLoaded", () => {
            calcDeliveryDate();
            changeLang();
        });
    