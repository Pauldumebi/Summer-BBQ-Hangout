# Sacred Heart Youth Summer BBQ Hangout Registration Website

A simple, fun, responsive, and animated single-page registration website built for the Sacred Heart Church Youth Summer BBQ hangout.

## Features
- **Modern Summer Aesthetics**: Custom warm gradients, glassmorphism cards, and Google Fonts.
- **Micro-animations**: Ambient floating clouds, a glowing/pulsing sunset, interactive form focuses, and grill-themed smoke puff animations.
- **Dynamic Guest Lists**: Selecting the number of guests instantly spawns customized sub-forms for each guest (collecting their names and dietary restrictions).
- **Google Sheets Integration**: Instantly saves registrations to a live Google Spreadsheet (via Google Apps Script Web App).
- **Playful Success Screen**: Celebrates registrations with a confetti blast, an animated BBQ character illustration, a countdown timer to the BBQ, and a "Add to Google Calendar" link.
- **Offline Fallback**: Submissions are automatically backed up in the user's browser `LocalStorage` so you never lose registration data even if the network fails.

---

## How to Set Up Google Sheets Storage (Option A)

To save the registrations directly to a Google Sheet in real-time, follow these 5 easy steps:

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Name your spreadsheet (e.g., `Youth Summer BBQ Registrations 2026`).

### Step 2: Open Google Apps Script Editor
1. In the Google Sheets menu, click on **Extensions** -> **Apps Script**.
2. Delete any code in the editor and replace it with the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If sheet is empty, write headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Full Name", 
        "Email", 
        "Youth Group Category", 
        "Dietary Restrictions", 
        "Guests Count", 
        "Guests List (Name & Dietary)", 
        "Helping Category", 
        "Comments/Suggestions"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.fullName,
      data.email,
      data.youthGroup,
      data.dietary,
      data.guestsCount,
      data.guestsList,
      data.helpers,
      data.comments
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({result: "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy the Script as a Web App
1. Click the **Deploy** button in the top right, and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the options:
   - **Description**: `BBQ Registration API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** (This is crucial so the form can send data to it).
4. Click **Deploy**.
5. You might be asked to authorize permissions. Click **Authorize Access**, choose your Google account, click **Advanced** (at the bottom), click **Go to Untitled project (unsafe)**, and select **Allow**.

### Step 4: Copy the Web App URL
1. Once deployed, copy the **Web App URL** provided under the deployment details (it ends in `/exec`).

### Step 5: Update the Website Code
1. Open the project file [app.js](file:///Users/pauldumebi/Desktop/Sacred%20Heart/app.js) in your text editor.
2. Locate line **17**:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your copied Google Web App URL, save the file, and you are done!

---

## Local Run & Development

To test the page locally on your computer:
1. Since the project uses standard static files (`index.html`, `style.css`, `app.js`), you can open `index.html` directly in your browser.
2. For the best experience (including relative path image loading and mock submit requests), run it using a local development server.
   * If you have Node.js installed, run:
     ```bash
     npx serve .
     ```
   * Or if you use VS Code, use the **Live Server** extension.
