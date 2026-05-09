function doPost(e) {
  var sheetOrders = null;
  var sheetClients = null;

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sheetOrders = ss.getSheetByName("Orders");
    sheetClients = ss.getSheetByName("Clients");

    if (!e || !e.postData) {
      return ContentService.createTextOutput("ERROR: No postData").setMimeType(ContentService.MimeType.TEXT);
    }
    // Parse incoming JSON payload from the frontend
    var params = JSON.parse(e.postData.contents);

    // API key validation
    var validKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
    if (!validKey || !params.apiKey || params.apiKey !== validKey) {
      return ContentService.createTextOutput("UNAUTHORIZED").setMimeType(ContentService.MimeType.TEXT);
    }

    // Verification Code Validation
    var cachedCode = CacheService.getScriptCache().get("VERIFY_" + params.clientId);
    if (!cachedCode || cachedCode !== params.verificationCode) {
       return ContentService.createTextOutput("INVALID_VERIFICATION_CODE").setMimeType(ContentService.MimeType.TEXT);
    }
    // Remove code from cache so it cannot be reused
    CacheService.getScriptCache().remove("VERIFY_" + params.clientId);

    // 1. Generate a unique order number (e.g., TWS-260501-XXXX)
    var d = new Date();
    var datePart = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyMMdd");
    var randomPart = Math.floor(1000 + Math.random() * 9000);
    var orderNumber = "TWS-" + datePart + "-" + randomPart;

    // 2. Lookup the "Bed Linen Style" based on Client ID from the database
    var style = "4mm"; // Default fallback if client is not found in the database
    var clientFound = false;

    if (sheetClients) {
      var clientData = sheetClients.getDataRange().getValues();
      for (var i = 0; i < clientData.length; i++) {
        // Column A (index 0) is Client ID, Column C (index 2) is Style
        if (String(clientData[i][0]) === String(params.clientId)) {
          clientFound = true;
          // If style in DB is not empty, use it. Otherwise, keep the default 4mm.
          var cellStyle = clientData[i][2].toString().trim();
          if (cellStyle !== "") {
            style = cellStyle;
          }
          break; // Stop searching once found
        }
      }

      // If client is not in the database, add them
      if (!clientFound) {
        // Appending row to Klienci_Baza: 
        // Col A: ID, Col B: Name, Col C: Style, Col D: Trasa (empty by default), Col E: Miejscowość, Col F: Email
        sheetClients.appendRow([
          params.clientId,
          params.clientName,
          style,
          "", // Trasa (Miejscowość) - zostawiamy puste dla nowego, aby nie psuć dropdownu
          params.city, // Miejscowość
          params.email // Email w kolumnie F
        ]);
      }
    }

    // 3. Prepare the row data to be inserted into the Orders sheet
    var rowData = [
      new Date(),                 // Timestamp
      orderNumber,                // Order Number
      params.clientId,            // Client ID
      params.clientName,          // Client Name
      params.email,               // Client Email
      style,                      // Bed Linen Style (Auto-detected or default 4mm)
      params.diffReceiver ? "TAK" : "NIE", // Different Receiver?
      params.receiverName,        // Receiver Name
      params.receiverEmail,       // Receiver Email
      params.city,                // Delivery City
      params.deliveryDate,        // Delivery Date

      // WHITE BED LINEN (6 items)
      params.w_bed1, params.w_bed2, params.w_bed3, params.w_bed4, params.w_bed5, params.w_bed6,
      // TOWELS (5 items)
      params.t_tow1, params.t_tow2, params.t_tow3, params.t_tow4, params.t_tow5,
      // TABLECLOTHS (6 items)
      params.tb_tab1, params.tb_tab2, params.tb_tab3, params.tb_tab4, params.tb_tab5, params.tb_tab6,
      // COLORED BED LINEN (4 items)
      params.c_color, params.c_bed1, params.c_bed2, params.c_bed3,
      // NOTES
      params.notes
    ];

    // 4. Append the new row to the sheet
    sheetOrders.appendRow(rowData);

    // 5. Generate and send Email Confirmation / Print Document
    var capacities = {
      w_bed1: 200, w_bed2: 400, w_bed3: 400, w_bed4: 1000, w_bed5: 300, w_bed6: 180,
      t_tow1: 460, t_tow2: 220, t_tow3: 330
    };
    var itemNamesDE = {
      w_bed1: "Bettbezug", w_bed2: "Kissenbezug 80x80", w_bed3: "Kissenbezug 60x80",
      w_bed4: "Kissenbezug 40x80", w_bed5: "Bettlaken", w_bed6: "Französisches Bettlaken",
      t_tow1: "Handtuch klein", t_tow2: "Handtuch groß", t_tow3: "Badvorleger",
      t_tow4: "Duschtuch", t_tow5: "Geschirrtücher",
      tb_tab1: "Servietten 50x50", tb_tab2: "Tischdecke 80x80", tb_tab3: "Tischdecke 100x100",
      tb_tab4: "Tischdecke 130x130", tb_tab5: "Tischdecke 130x170", tb_tab6: "Tischdecke 130x200",
      c_bed1: "Bettbezug (Farbe)", c_bed2: "Kissenbezug 80x80 (Farbe)", c_bed3: "Bettlaken (Farbe)"
    };
    
    var itemNamesEN = {
      w_bed1: "Duvet cover", w_bed2: "Pillowcase 80x80", w_bed3: "Pillowcase 60x80",
      w_bed4: "Pillowcase 40x80", w_bed5: "Bed sheet", w_bed6: "French bed sheet",
      t_tow1: "Small towel", t_tow2: "Large towel", t_tow3: "Bath mat",
      t_tow4: "Bath towel", t_tow5: "Tea towels",
      tb_tab1: "Napkins 50x50", tb_tab2: "Tablecloth 80x80", tb_tab3: "Tablecloth 100x100",
      tb_tab4: "Tablecloth 130x130", tb_tab5: "Tablecloth 130x170", tb_tab6: "Tablecloth 130x200",
      c_bed1: "Colored duvet cover", c_bed2: "Colored pillowcase 80x80", c_bed3: "Colored bed sheet"
    };

    var orderedItemsKeys = ['w_bed1', 'w_bed2', 'w_bed3', 'w_bed4', 'w_bed5', 'w_bed6', 't_tow1', 't_tow2', 't_tow3', 't_tow4', 't_tow5', 'tb_tab1', 'tb_tab2', 'tb_tab3', 'tb_tab4', 'tb_tab5', 'tb_tab6', 'c_bed1', 'c_bed2', 'c_bed3'];

    var itemsArr = [];
    var totalCalculatedWagons = 0;

    orderedItemsKeys.forEach(function (key) {
      var qty = parseInt(params[key] || 0);
      if (qty > 0) {
        if (capacities[key]) {
          totalCalculatedWagons += Math.ceil(qty / capacities[key]);
        }
        var colorInfo = (key.startsWith('c_') && params.c_color) ? " [" + params.c_color + "]" : "";
        itemsArr.push({ 
          nameDE: itemNamesDE[key] + colorInfo, 
          nameEN: itemNamesEN[key] + colorInfo, 
          qty: qty 
        });
      }
    });

    // Helper for 2-column table
    function generateTableHTML(items, lang) {
      var th1 = lang === 'DE' ? "Artikel" : "Artikel / Article";
      var th2 = lang === 'DE' ? "Menge" : "Menge / Qty";
      var html = "<table style='width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;'>" +
                 "<thead><tr style='background-color: #f8fafc; text-align: left;'>" +
                 "<th style='padding: 8px; border-bottom: 2px solid #cbd5e1; width: 40%;'>" + th1 + "</th>" +
                 "<th style='padding: 8px; border-bottom: 2px solid #cbd5e1; text-align:right; width: 10%;'>" + th2 + "</th>" +
                 "<th style='padding: 8px; border-bottom: 2px solid #cbd5e1; width: 40%; border-left: 10px solid white;'>" + th1 + "</th>" +
                 "<th style='padding: 8px; border-bottom: 2px solid #cbd5e1; text-align:right; width: 10%;'>" + th2 + "</th>" +
                 "</tr></thead><tbody>";
      
      for (var i = 0; i < items.length; i += 2) {
        var bg = (i/2) % 2 === 0 ? "background-color: #ffffff;" : "background-color: #f1f5f9;";
        html += "<tr style='" + bg + "'>";
        
        // Item 1
        var item1 = items[i];
        var name1 = lang === 'DE' ? item1.nameDE : item1.nameDE + "<br><span style='font-size:11px; color:#666;'>" + item1.nameEN + "</span>";
        html += "<td style='padding: 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top;'>" + name1 + "</td>" +
                "<td style='padding: 8px; border-bottom: 1px solid #e2e8f0; text-align:right; font-weight:bold; font-size: 14px; vertical-align: top;'>" + item1.qty + "</td>";
        
        // Item 2
        if (i + 1 < items.length) {
          var item2 = items[i+1];
          var name2 = lang === 'DE' ? item2.nameDE : item2.nameDE + "<br><span style='font-size:11px; color:#666;'>" + item2.nameEN + "</span>";
          html += "<td style='padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 10px solid white; vertical-align: top;'>" + name2 + "</td>" +
                  "<td style='padding: 8px; border-bottom: 1px solid #e2e8f0; text-align:right; font-weight:bold; font-size: 14px; vertical-align: top;'>" + item2.qty + "</td>";
        } else {
          html += "<td style='padding: 8px; border-bottom: 1px solid #e2e8f0; border-left: 10px solid white;'></td><td style='padding: 8px; border-bottom: 1px solid #e2e8f0;'></td>";
        }
        
        html += "</tr>";
      }
      html += "</tbody></table>";
      return html;
    }

    var totalWagons = totalCalculatedWagons * 2;
    if (totalWagons === 0 && itemsArr.length > 0) totalWagons = 2; 

    var wagonBoxesHTML = "";
    if (totalWagons > 0) {
      wagonBoxesHTML = "<div style='margin-top: 30px;'><h3 style='color:#003366; border-bottom: 1px solid #003366; padding-bottom: 5px; font-size:15px;'>Numery Wózków / Rollcontainer Nummern:</h3><div style='margin-top:10px;'>";
      for (var w = 0; w < totalWagons; w++) {
        wagonBoxesHTML += "<span style='border: 2px solid #003366; border-radius: 4px; padding: 10px 30px; margin: 5px; display:inline-block; font-weight: bold; font-size: 16px; letter-spacing: 2px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
      }
      wagonBoxesHTML += "</div></div>";
    }

    var notesHTML = "";
    if (params.notes && params.notes.trim() !== "") {
      notesHTML = "<div style='margin-top: 20px; background-color: #fffbeb; padding: 15px; border-left: 4px solid #fbbf24; border-radius: 4px;'>" +
                  "<p style='margin:0; font-weight:bold; color: #b45309; font-size: 14px;'>Uwagi / Zusätzliche Anmerkungen:</p>" +
                  "<p style='margin: 5px 0 0 0; color: #78350f; font-size: 14px; white-space: pre-wrap;'>" + params.notes + "</p>" +
                  "</div>";
    }

    // Email to Client (DE)
    var htmlBodyClient = "<div style='font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #ddd;'>" +
      "<div style='text-align:center; margin-bottom: 20px;'><img src='https://www.tws-ruegen.de/files/content/images/logo-tws.png' alt='TWS Logo' style='max-height: 80px;' /></div>" +
      "<h2 style='color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;'>Bestellbestätigung</h2>" +
      "<p style='font-size: 22px; font-weight: bold; margin-bottom: 5px; color: #003366;'>" + params.clientName + " (" + params.clientId + ")</p>" +
      "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Bestellnummer: <strong style='color: #000;'>" + orderNumber + "</strong> &nbsp;|&nbsp; Lieferdatum: <strong style='color: #000;'>" + params.deliveryDate + " - " + params.city + "</strong></p>" +
      (params.diffReceiver ? "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Empfänger: <strong style='color: #000;'>" + params.receiverName + "</strong></p>" : "") +
      "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Stil: <strong style='color: #000;'>" + style + "</strong></p>" +
      notesHTML +
      generateTableHTML(itemsArr, 'DE') +
      "<p style='margin-top: 30px; font-size: 12px; color: #666;'>Automatisch generiertes Dokument.</p>" +
      "</div>";

    // Email to Warehouse (DE / EN)
    var htmlBodyWarehouse = "<div style='font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #ddd;'>" +
      "<div style='text-align:center; margin-bottom: 20px;'><img src='https://www.tws-ruegen.de/files/content/images/logo-tws.png' alt='TWS Logo' style='max-height: 80px;' /></div>" +
      "<h2 style='color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;'>Bestellbestätigung / Order Confirmation</h2>" +
      "<p style='font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #003366;'>" + params.clientName + " (" + params.clientId + ")</p>" +
      "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Bestellnummer / Order No: <strong style='color: #000;'>" + orderNumber + "</strong> &nbsp;|&nbsp; Lieferdatum / Delivery: <strong style='color: #000;'>" + params.deliveryDate + " - " + params.city + "</strong></p>" +
      (params.diffReceiver ? "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Empfänger / Receiver: <strong style='color: #000;'>" + params.receiverName + "</strong></p>" : "") +
      "<p style='font-size: 14px; margin-bottom: 5px; color: #555;'>Stil / Style: <strong style='color: #000;'>" + style + "</strong></p>" +
      notesHTML +
      generateTableHTML(itemsArr, 'DE_EN') +
      wagonBoxesHTML +
      "<p style='margin-top: 30px; font-size: 12px; color: #666;'>Automatisch generiertes Dokument. / Automatically generated document.</p>" +
      "</div>";

    var finalReceiver = (params.diffReceiver && params.receiverName && params.receiverName.trim() !== "") ? params.receiverName : params.clientName;
    
    var emailSubjectClient = finalReceiver + " | " + params.clientId + " | " + orderNumber;
    var emailSubjectWarehouse = finalReceiver + " | " + params.clientId + " | " + orderNumber;

    var warehouseEmail = "vyzygota.corvo@gmail.com"; 

    // Send to warehouse
    GmailApp.sendEmail(warehouseEmail, emailSubjectWarehouse, "", {
      htmlBody: htmlBodyWarehouse
    });

    // Send to client
    if (params.email && params.email !== "") {
      GmailApp.sendEmail(params.email, emailSubjectClient, "", {
        htmlBody: htmlBodyClient
      });
      // FOR TESTING ONLY: Send client copy to warehouse as well
      GmailApp.sendEmail(warehouseEmail, "[KOPIA KLIENTA] " + emailSubjectClient, "", {
        htmlBody: htmlBodyClient
      });
    } else {
      // FOR TESTING ONLY: Send client copy to warehouse as well if client email missing
      GmailApp.sendEmail(warehouseEmail, "[KOPIA KLIENTA - BRAK MAILA] " + emailSubjectClient, "", {
        htmlBody: htmlBodyClient
      });
    }

    // Return success response to the frontend
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    var errorDetails = error.toString() + " | postData: " + (e && e.postData ? e.postData.contents : 'brak danych');
    if (sheetOrders) {
      sheetOrders.appendRow([new Date(), "ERROR", errorDetails]);
    } else {
      Logger.log("CRITICAL: Orders sheet not found. Error: " + errorDetails);
    }
    return ContentService.createTextOutput("ERROR").setMimeType(ContentService.MimeType.TEXT);
  }
}

// Handle GET requests to fetch data and optionally send verification code
function doGet(e) {
  if (e.parameter.action === "getClient" && e.parameter.clientId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "Clients"; 
    var sheetClients = ss.getSheetByName(sheetName);

    if (!sheetClients) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Sheet '" + sheetName + "' not found." })).setMimeType(ContentService.MimeType.JSON);
    }

    var clientData = sheetClients.getDataRange().getValues();
    var targetId = String(e.parameter.clientId).trim();

    for (var i = 0; i < clientData.length; i++) {
      var currentId = String(clientData[i][0]).trim();
      if (currentId === targetId) {
        var clientInfo = {
          id: clientData[i][0],
          name: clientData[i][1] || "",
          style: clientData[i][2] || "",
          email: clientData[i][5] || "",
          city: clientData[i][4] || clientData[i][3] || ""
        };

        // Verification logic
        if (e.parameter.sendCode === "true") {
           var clientEmail = clientInfo.email;
           if (!clientEmail || clientEmail.trim() === "") {
               return ContentService.createTextOutput(JSON.stringify({ error: "Brak adresu email dla tego klienta." })).setMimeType(ContentService.MimeType.JSON);
           }
           
           // Check if blocked before sending a new code
           var isBlocked = CacheService.getScriptCache().get("BLOCKED_" + targetId);
           if (isBlocked) {
               return ContentService.createTextOutput(JSON.stringify({ error: "Konto zablokowane ze względu na zbyt wiele błędnych prób. Spróbuj ponownie za 30 minut." })).setMimeType(ContentService.MimeType.JSON);
           }
           
           // Generate 4-digit code
           var code = Math.floor(1000 + Math.random() * 9000).toString();
           
           // Store in cache for 15 minutes (900 seconds), also reset attempts
           CacheService.getScriptCache().put("VERIFY_" + targetId, code, 900);
           CacheService.getScriptCache().remove("ATTEMPTS_" + targetId);
           
           // Send HTML Email
           var subject = "TWS Rügen - Verifizierungscode / Kod weryfikacyjny";
           var htmlBody = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;'>" +
             "<div style='text-align:center; margin-bottom: 20px;'>" +
               "<img src='https://www.tws-ruegen.de/files/content/images/logo-tws.png' alt='TWS Logo' style='max-height: 80px;' />" +
             "</div>" +
             "<h2 style='color: #003366; text-align: center; margin-bottom: 20px;'>Ihr Verifizierungscode / Twój kod weryfikacyjny</h2>" +
             "<p style='font-size: 15px; color: #555; text-align: center;'>" +
               "Bitte geben Sie den folgenden Code in das Bestellformular ein.<br>" +
               "<span style='font-size: 13px;'>Proszę wprowadzić poniższy kod w formularzu zamówienia.</span>" +
             "</p>" +
             "<div style='text-align: center; margin: 30px 0;'>" +
               "<div style='display: inline-block; background-color: #f1f5f9; border: 2px dashed #003366; padding: 15px 40px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #003366; border-radius: 8px;'>" +
                 code +
               "</div>" +
               "<p style='font-size: 12px; color: #666; margin-top: 10px;'><em>Tipp: Sie können den Code oben einfach markieren und kopieren. / Wskazówka: Możesz łatwo zaznaczyć i skopiować powyższy kod.</em></p>" +
             "</div>" +
             "<div style='background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; font-size: 13px; margin-top: 20px; text-align: center;'>" +
               "<strong>Achtung / Uwaga:</strong><br>" +
               "Bei 3 falschen Eingaben wird das Konto für 30 Minuten gesperrt.<br>" +
               "<span style='font-size: 12px;'>Po 3 błędnych próbach wprowadzenia, możliwość zamówienia zostanie zablokowana na 30 minut.</span>" +
             "</div>" +
             "<p style='margin-top: 30px; font-size: 12px; color: #666; text-align: center;'>Dieser Code ist 15 Minuten lang gültig.</p>" +
           "</div>";

           try {
             GmailApp.sendEmail(clientEmail, subject, "", { htmlBody: htmlBody });
           } catch (err) {
             return ContentService.createTextOutput(JSON.stringify({ error: "Nie udało się wysłać emaila z kodem." })).setMimeType(ContentService.MimeType.JSON);
           }
        }

        return ContentService.createTextOutput(JSON.stringify(clientInfo)).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ error: "Client ID '" + targetId + "' not found." })).setMimeType(ContentService.MimeType.JSON);
  }

  // Verify verification code via GET before POSTing
  if (e.parameter.action === "verifyCode" && e.parameter.clientId && e.parameter.code) {
    var cache = CacheService.getScriptCache();
    var clientId = e.parameter.clientId;
    
    // Check if blocked
    var isBlocked = cache.get("BLOCKED_" + clientId);
    if (isBlocked) {
      return ContentService.createTextOutput(JSON.stringify({ valid: false, blocked: true })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var cachedCode = cache.get("VERIFY_" + clientId);
    
    if (cachedCode && cachedCode === String(e.parameter.code).trim()) {
      cache.remove("ATTEMPTS_" + clientId); // Reset attempts on success
      return ContentService.createTextOutput(JSON.stringify({ valid: true })).setMimeType(ContentService.MimeType.JSON);
    } else {
      // Increment attempts
      var attempts = parseInt(cache.get("ATTEMPTS_" + clientId) || "0", 10) + 1;
      cache.put("ATTEMPTS_" + clientId, attempts.toString(), 900); // store for 15 mins
      
      if (attempts >= 3) {
        // Block for 30 minutes (1800 seconds)
        cache.put("BLOCKED_" + clientId, "true", 1800);
        cache.remove("VERIFY_" + clientId); // Remove code
        return ContentService.createTextOutput(JSON.stringify({ valid: false, blocked: true })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ valid: false, attemptsLeft: 3 - attempts })).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // SETUP: odczyt formuł z Raport_Ekspedycja, usunąć po użyciu
  if (e.parameter.action === "readFormulas" && e.parameter.token === "7df71599148e6f7075a09ddbbb11c585") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Raport_Ekspedycja");
    var formulas = sheet.getRange(1, 1, 5, sheet.getLastColumn()).getFormulas();
    return ContentService.createTextOutput(JSON.stringify(formulas)).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("TWS Bestelung Backend - GET OK").setMimeType(ContentService.MimeType.TEXT);
}

