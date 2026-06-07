/**
 * Sacred Heart Youth Summer BBQ Hangout - Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form and UI elements
    const form = document.getElementById('registration-form');
    const formCard = document.getElementById('form-card');
    const successCard = document.getElementById('success-card');
    const guestsCountSelect = document.getElementById('guests-count');
    const guestsContainer = document.getElementById('guests-container');
    const progressBar = document.getElementById('progress-bar');
    const submitBtn = document.getElementById('submit-btn');
    const registerAnotherBtn = document.getElementById('register-another-btn');
    const addCalendarBtn = document.getElementById('add-calendar-btn');

    // Google Sheets Config
    // TO SET UP GOOGLE SHEETS STORAGE:
    // 1. Create a Google Sheet.
    // 2. Click Extensions > Apps Script.
    // 3. Paste the Google Apps Script code (see README.md or comments at the bottom of this file).
    // 4. Deploy as a Web App (set access to "Anyone").
    // 5. Copy the Web App URL and paste it here:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5UxebFf-_q-lcCm3CRwt2YN-fWJ9wd3rA8Uktcu71v2m-q0FcWst-dSJrt6unorSlpQ/exec'; 

    // Target Event Date for Countdown: Saturday, July 18, 2026 at 5:00 PM
    const eventDate = new Date('2026-07-18T17:00:00').getTime();

    // ==========================================
    // 1. DYNAMIC GUEST INPUT GENERATION
    // ==========================================
    guestsCountSelect.addEventListener('change', (e) => {
        const count = parseInt(e.target.value);
        guestsContainer.innerHTML = ''; // Clear previous fields

        for (let i = 1; i <= count; i++) {
            const guestCard = document.createElement('div');
            guestCard.className = 'guest-card';
            guestCard.innerHTML = `
                <h4><i class="fa-solid fa-user-plus"></i> Guest #${i} Info</h4>
                <div class="input-group">
                    <input type="text" id="guest-${i}-name" name="guest${i}Name" required placeholder=" ">
                    <label for="guest-${i}-name">Guest #${i} Full Name</label>
                    <i class="fa-solid fa-user input-icon"></i>
                    <span class="error-msg">Please enter your guest's name</span>
                </div>
                <div class="input-group" style="margin-bottom: 0;">
                    <input type="text" id="guest-${i}-dietary" name="guest${i}Dietary" placeholder=" ">
                    <label for="guest-${i}-dietary">Dietary / Allergies (Optional)</label>
                    <i class="fa-solid fa-carrot input-icon"></i>
                </div>
            `;
            guestsContainer.appendChild(guestCard);
        }

        // Add event listeners to new inputs to update progress and check validation
        attachInputListeners();
        updateFormProgress();
    });

    // ==========================================
    // 2. SMOKE PUFF MICRO-INTERACTION & LISTENERS
    // ==========================================
    function attachInputListeners() {
        const allInputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
        
        allInputs.forEach(input => {
            // Remove error class on focus/input
            input.addEventListener('input', () => {
                const group = input.closest('.input-group');
                if (group && group.classList.contains('error')) {
                    group.classList.remove('error');
                }
                updateFormProgress();
            });

            // Create gentle smoke puffs around the submit button / header when user interacts with inputs
            input.addEventListener('focus', () => {
                triggerSmokePuffs();
            });
        });
    }

    function triggerSmokePuffs() {
        // Create smoke puffs inside the submit button container or near the button
        const submitContainer = document.querySelector('.submit-container');
        if (!submitContainer) return;

        // Check if smoke container already exists, if not create it
        let smokeContainer = submitContainer.querySelector('.grill-smoke-ambient');
        if (!smokeContainer) {
            smokeContainer = document.createElement('div');
            smokeContainer.className = 'grill-smoke-ambient';
            submitContainer.appendChild(smokeContainer);
        }

        // Add 2 smoke puffs
        for (let i = 0; i < 2; i++) {
            const puff = document.createElement('span');
            puff.className = `puff puff-${Math.floor(Math.random() * 3) + 1}`;
            
            // Randomize position slightly
            puff.style.left = `${Math.random() * 80 + 10}%`;
            
            smokeContainer.appendChild(puff);
            
            // Remove after animation finishes
            setTimeout(() => {
                puff.remove();
            }, 2000);
        }
    }

    // ==========================================
    // 3. PROGRESS BAR LOGIC
    // ==========================================
    function updateFormProgress() {
        const requiredInputs = Array.from(form.querySelectorAll('[required]'));
        if (requiredInputs.length === 0) {
            progressBar.style.width = '0%';
            return;
        }

        let filledCount = 0;
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                // Check if any radio in the group is checked
                const groupName = input.name;
                const checked = form.querySelector(`input[name="${groupName}"]:checked`);
                if (checked) filledCount++;
            } else if (input.value.trim() !== '') {
                filledCount++;
            }
        });

        // Compute percentage
        const progressPercentage = Math.round((filledCount / requiredInputs.length) * 100);
        progressBar.style.width = `${progressPercentage}%`;
    }

    // ==========================================
    // 4. EVENT COUNTDOWN TIMER
    // ==========================================
    let countdownInterval;
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);

        const daysVal = document.getElementById('days');
        const hoursVal = document.getElementById('hours');
        const minutesVal = document.getElementById('minutes');
        const secondsVal = document.getElementById('seconds');

        function updateTimer() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.querySelector('.countdown-section h3').textContent = "Grill is Fired Up! 🔥";
                daysVal.textContent = '00';
                hoursVal.textContent = '00';
                minutesVal.textContent = '00';
                secondsVal.textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysVal.textContent = String(days).padStart(2, '0');
            hoursVal.textContent = String(hours).padStart(2, '0');
            minutesVal.textContent = String(minutes).padStart(2, '0');
            secondsVal.textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // ==========================================
    // 5. CALENDAR INTEGRATION
    // ==========================================
    addCalendarBtn.addEventListener('click', () => {
        const title = encodeURIComponent("Sacred Heart Youth Summer BBQ Hangout");
        const details = encodeURIComponent("Summer BBQ hangout for the Sacred Heart Youth Group. Bring your friends and appetite! 🔥🍔");
        const location = encodeURIComponent("Sacred Heart Church Garden");
        
        // Date format: YYYYMMDDTHHMMSSZ (UTC preferred, but we can do local style as well)
        // 2026-07-18 17:00:00 (5 PM) to 2026-07-18 21:00:00 (9 PM)
        const dates = "20260718T170000/20260718T210000";
        
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
        window.open(calendarUrl, '_blank');
    });

    // ==========================================
    // 6. FORM VALIDATION & SUBMISSION
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all required inputs
        const requiredInputs = form.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            const group = input.closest('.input-group');
            if (input.value.trim() === '') {
                isValid = false;
                if (group) group.classList.add('error');
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                if (group) {
                    group.classList.add('error');
                    group.querySelector('.error-msg').textContent = "Please enter a valid email address";
                }
            } else {
                if (group) group.classList.remove('error');
            }
        });

        if (!isValid) {
            // Scroll to the first error input
            const firstError = form.querySelector('.input-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Disable submit button during submit
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Firing up...';
        
        // Collect form data
        const formData = new FormData(form);
        const data = {
            timestamp: new Date().toLocaleString(),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            youthGroup: formData.get('youthGroup'),
            dietary: formData.get('dietary') || 'None',
            guestsCount: parseInt(formData.get('guestsCount') || '0'),
            comments: formData.get('comments') || 'None'
        };

        // Collect Help tasks
        const helpers = [];
        form.querySelectorAll('input[name="helperTasks"]:checked').forEach(cb => {
            helpers.push(cb.value);
        });
        data.helpers = helpers.join(', ') || 'None';

        // Collect dynamic guest data
        const guestsList = [];
        for (let i = 1; i <= data.guestsCount; i++) {
            const guestName = formData.get(`guest${i}Name`);
            const guestDietary = formData.get(`guest${i}Dietary`) || 'None';
            if (guestName) {
                guestsList.push(`${guestName} (${guestDietary})`);
            }
        }
        data.guestsList = guestsList.join(' | ') || 'None';

        console.log('Registering with data:', data);

        // Attempt submission to Google Sheet Web App
        let success = false;
        
        if (GOOGLE_SCRIPT_URL.includes('docs.google.com/spreadsheets')) {
            console.error('CRITICAL SETUP ERROR: You pasted the Google Spreadsheet URL in app.js instead of the Google Apps Script Web App URL! Please follow the README.md instructions to deploy your Apps Script as a Web App.');
            alert('Setup Guide:\n\nYou pasted the Google Spreadsheet URL instead of the Google Apps Script Web App URL.\n\nPlease follow the steps in the README.md to deploy the script in your sheet and get your Web App URL (which ends with "/exec").');
        } else if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' && GOOGLE_SCRIPT_URL.includes('/macros/s/')) {
            try {
                // Google Web Apps usually require CORS or redirect, sending JSON works great
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // standard Google script mode, ignores CORS errors and posts anyway
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                success = true;
            } catch (err) {
                console.error('Google Sheets submission failed, saving locally instead:', err);
            }
        }

        // Store backup in LocalStorage
        saveToLocalStorageBackup(data);

        // Simulate a tiny visual wait for smooth transition
        setTimeout(() => {
            triggerConfetti();
            showSuccessScreen();
        }, 800);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function saveToLocalStorageBackup(data) {
        const existing = JSON.parse(localStorage.getItem('bbq_registrations') || '[]');
        existing.push(data);
        localStorage.setItem('bbq_registrations', JSON.stringify(existing));
    }

    // ==========================================
    // 7. SUCCESS SCREEN TRANSITION
    // ==========================================
    function showSuccessScreen() {
        formCard.classList.add('hidden');
        successCard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        startCountdown();
    }

    function triggerConfetti() {
        // Confetti explosion using canvas-confetti library
        if (typeof confetti === 'function') {
            // Left cannon
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { x: 0.1, y: 0.8 },
                colors: ['#ff5e36', '#ffaa1d', '#ff703f', '#10b981', '#fff']
            });
            // Right cannon
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { x: 0.9, y: 0.8 },
                colors: ['#ff5e36', '#ffaa1d', '#ff703f', '#10b981', '#fff']
            });

            // Extra continuous sparkles
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 90,
                    spread: 80,
                    origin: { x: 0.5, y: 0.6 },
                    colors: ['#ffaa1d', '#ff703f', '#fff']
                });
            }, 300);
        }
    }

    // ==========================================
    // 8. RESET & REGISTER ANOTHER
    // ==========================================
    registerAnotherBtn.addEventListener('click', () => {
        // Reset form
        form.reset();
        guestsContainer.innerHTML = '';
        progressBar.style.width = '0%';

        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Register Now!';

        // Transition screens
        successCard.classList.add('hidden');
        formCard.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initialize listeners
    attachInputListeners();
    updateFormProgress();
});

/* =========================================================================
   GOOGLE APPS SCRIPT CODE FOR GOOGLE SHEET STORAGE (Copy & Paste in Apps Script):
   =========================================================================
   
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       
       // If sheet is empty, create headers
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
   
   ========================================================================= */
