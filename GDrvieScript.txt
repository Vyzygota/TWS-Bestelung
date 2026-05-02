function doPost(e) {
  // Get references to the Google Sheets tabs
  var sheetOrders = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Wszystkie_Zamowienia");
  var sheetClients = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Klienci_Baza");
  
  try {
    // Parse incoming JSON payload from the frontend
    var params = JSON.parse(e.postData.contents);
    
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
      for (var i = 1; i < clientData.length; i++) {
        // Column A (index 0) is Client ID, Column C (index 2) is Style
        if (String(clientData[i][0]) === String(params.clientId)) {
          clientFound = true;
          // If style in DB is not empty, use it. Otherwise, keep the default 4mm.
          if(clientData[i][2] !== "") {
            style = clientData[i][2];
          }
          break; // Stop searching once found
        }
      }

      // If client is not in the database, add them
      if (!clientFound) {
        // Appending row to Klienci_Baza: [ID, Name, Style, Email, City]
        sheetClients.appendRow([
          params.clientId, 
          params.clientName, 
          style, 
          params.email, 
          params.city
        ]);
      }
    }

    // 3. Prepare the row data to be inserted into the Orders sheet
    var rowData =[
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
      
      // WHITE BED LINEN (5 items)
      params.w_bed1, params.w_bed2, params.w_bed3, params.w_bed4, params.w_bed5,
      // TOWELS (5 items)
      params.t_tow1, params.t_tow2, params.t_tow3, params.t_tow4, params.t_tow5,
      // TABLECLOTHS (6 items)
      params.tb_tab1, params.tb_tab2, params.tb_tab3, params.tb_tab4, params.tb_tab5, params.tb_tab6,
      // COLORED BED LINEN (4 items)
      params.c_color, params.c_bed1, params.c_bed2, params.c_bed3
    ];
    
    // 4. Append the new row to the sheet
    sheetOrders.appendRow(rowData);
    
    // Return success response to the frontend
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    // Log the error in the sheet for debugging purposes
    sheetOrders.appendRow([new Date(), "ERROR", error.toString(), JSON.stringify(e)]);
    return ContentService.createTextOutput("ERROR").setMimeType(ContentService.MimeType.TEXT);
  }
}

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

// Handle GET requests to fetch data (e.g. Client Info)
function doGet(e) {
  // Always set CORS headers in the response if possible (GAS handles this mostly via redirect)
  
  if (e.parameter.action === "getClient" && e.parameter.clientId) {
    var sheetClients = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Klienci_Baza");
    
    if (sheetClients) {
      var clientData = sheetClients.getDataRange().getValues();
      // Assuming headers in row 1, data starts from row 2 (index 1)
      for (var i = 1; i < clientData.length; i++) {
        // Col A (0): ID, Col B (1): Name, Col C (2): Style, Col D (3): Email, Col E (4): City
        if (String(clientData[i][0]) === String(e.parameter.clientId)) {
          var clientInfo = {
            id: clientData[i][0],
            name: clientData[i][1] || "",
            style: clientData[i][2] || "",
            email: clientData[i][3] || "",
            city: clientData[i][4] || ""
          };
          
          return ContentService.createTextOutput(JSON.stringify(clientInfo))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // If not found
    return ContentService.createTextOutput(JSON.stringify({error: "Client not found"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput("TWS Bestelung Backend - GET OK").setMimeType(ContentService.MimeType.TEXT);
}