/* =========================================================
   FINSECURE AI
   FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   BACKEND
========================================================= */

const API_BASE_URL = "http://localhost:8080";


/* =========================================================
   APPLICATION STATE
========================================================= */

let currentUser = null;

let statistics = {
    analyzed: 0,
    fraud: 0,
    safe: 0
};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FinSecure AI JavaScript loaded successfully.");

    initializeNavigation();

    initializeAuthentication();

    initializeDashboard();

    initializeUPIDetection();

    initializeQRDetection();

    checkExistingSession();

});


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo(0, 0);
}


/* =========================================================
   LANDING PAGE NAVIGATION
========================================================= */

function initializeNavigation() {

    const showLogin = document.getElementById("showLogin");
    const showRegister = document.getElementById("showRegister");

    const heroLogin = document.getElementById("heroLogin");
    const heroRegister = document.getElementById("heroRegister");

    if (showLogin) {
        showLogin.addEventListener("click", () => {
            showPage("loginPage");
        });
    }

    if (heroLogin) {
        heroLogin.addEventListener("click", () => {
            showPage("loginPage");
        });
    }

    if (showRegister) {
        showRegister.addEventListener("click", () => {
            showPage("registerPage");
        });
    }

    if (heroRegister) {
        heroRegister.addEventListener("click", () => {
            showPage("registerPage");
        });
    }


    const loginBack = document.getElementById("loginBack");

    if (loginBack) {
        loginBack.addEventListener("click", () => {
            showPage("landingPage");
        });
    }


    const registerBack = document.getElementById("registerBack");

    if (registerBack) {
        registerBack.addEventListener("click", () => {
            showPage("landingPage");
        });
    }


    const loginToRegister =
        document.getElementById("loginToRegister");

    if (loginToRegister) {
        loginToRegister.addEventListener("click", () => {
            clearMessages();
            showPage("registerPage");
        });
    }


    const registerToLogin =
        document.getElementById("registerToLogin");

    if (registerToLogin) {
        registerToLogin.addEventListener("click", () => {
            clearMessages();
            showPage("loginPage");
        });
    }

}


/* =========================================================
   AUTHENTICATION
========================================================= */

function initializeAuthentication() {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");


    /* LOGIN */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    /* REGISTER */

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleRegistration
        );

    }


    /* PASSWORD TOGGLES */

    initializePasswordToggle(
        "loginPasswordToggle",
        "loginPassword"
    );

    initializePasswordToggle(
        "registerPasswordToggle",
        "registerPassword"
    );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function initializePasswordToggle(
    buttonId,
    inputId
) {

    const button =
        document.getElementById(buttonId);

    const input =
        document.getElementById(inputId);

    if (!button || !input) {
        return;
    }

    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁";

        }

    });

}


/* =========================================================
   REGISTER
========================================================= */

async function handleRegistration(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName")
            .value
            .trim();

    const email =
        document.getElementById("registerEmail")
            .value
            .trim();

    const password =
        document.getElementById("registerPassword")
            .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
            .value;

    const message =
        document.getElementById("registerMessage");

    const button =
        document.getElementById("registerBtn");


    /* Validation */

    if (!name || !email || !password || !confirmPassword) {

        showMessage(
            message,
            "Please fill in all fields.",
            "error"
        );

        return;
    }


    if (password.length < 6) {

        showMessage(
            message,
            "Password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    if (password !== confirmPassword) {

        showMessage(
            message,
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* Disable button */

    button.disabled = true;
    button.textContent = "Creating Account...";


    try {

        console.log("Sending registration request...");


        const response = await fetch(
            `${API_BASE_URL}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    fullName: name,

                    email: email,

                    password: password

                })
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        console.log(
            "Registration response:",
            response.status,
            data
        );


        if (response.ok) {

            showMessage(
                message,
                "✓ Account created successfully! Redirecting to login...",
                "success"
            );


            document
                .getElementById("registerForm")
                .reset();


            setTimeout(() => {

                showPage("loginPage");

                const loginEmail =
                    document.getElementById("loginEmail");

                if (loginEmail) {
                    loginEmail.value = email;
                }

                showMessage(
                    document.getElementById("loginMessage"),
                    "Account created successfully. Please login.",
                    "success"
                );

            }, 1500);


        } else {

            const errorMessage =
                data.message ||
                data.error ||
                "Account creation failed.";

            showMessage(
                message,
                errorMessage,
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        showMessage(
            message,
            "Unable to connect to the FinSecure AI server. Make sure Spring Boot is running on port 8080.",
            "error"
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Create Account →";

    }

}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")
            .value
            .trim();

    const password =
        document.getElementById("loginPassword")
            .value;

    const message =
        document.getElementById("loginMessage");

    const button =
        document.getElementById("loginBtn");


    if (!email || !password) {

        showMessage(
            message,
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    button.disabled = true;
    button.textContent = "Logging in...";


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        console.log(
            "Login response:",
            response.status,
            data
        );


        if (response.ok) {

            if (!data.token) {

                throw new Error(
                    "Login succeeded but JWT token was not received."
                );

            }


            /* Store JWT */

            localStorage.setItem(
                "finsecure_token",
                data.token
            );


            /* Store user information */

            currentUser = {
                email: email,
                fullName:
                    data.fullName ||
                    data.name ||
                    email.split("@")[0]
            };


            localStorage.setItem(
                "finsecure_user",
                JSON.stringify(currentUser)
            );


            showMessage(
                message,
                "✓ Login successful. Opening dashboard...",
                "success"
            );


            setTimeout(() => {

                openDashboard();

            }, 700);


        } else {

            const errorMessage =
                data.message ||
                data.error ||
                "Invalid email or password.";

            showMessage(
                message,
                errorMessage,
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showMessage(
            message,
            "Unable to connect to the FinSecure AI server.",
            "error"
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Login Securely →";

    }

}


/* =========================================================
   SESSION
========================================================= */

function checkExistingSession() {

    const token =
        localStorage.getItem(
            "finsecure_token"
        );

    const savedUser =
        localStorage.getItem(
            "finsecure_user"
        );


    if (token && savedUser) {

        try {

            currentUser =
                JSON.parse(savedUser);

        } catch {

            currentUser = null;

        }

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

function initializeDashboard() {

    document
        .querySelectorAll(".sidebar-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const service =
                        button.dataset.service;

                    switchSection(service);

                }
            );

        });


    document
        .querySelectorAll("[data-service-card]")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const service =
                        card.dataset.serviceCard;

                    switchSection(service);

                }
            );

        });


    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }

}


/* =========================================================
   OPEN DASHBOARD
========================================================= */

function openDashboard() {

    updateUserInformation();

    updateStatistics();

    showPage("dashboardPage");

    switchSection("dashboard");

}


/* =========================================================
   SWITCH DASHBOARD SECTION
========================================================= */

function switchSection(section) {

    const sectionMap = {

        dashboard: "dashboardSection",

        upi: "upiSection",

        qr: "qrSection",

        analytics: "analyticsSection",

        alerts: "alertsSection"

    };


    const targetId =
        sectionMap[section];


    if (!targetId) {
        return;
    }


    document
        .querySelectorAll(".dashboard-section")
        .forEach(element => {

            element.classList.remove("active");

        });


    const target =
        document.getElementById(targetId);

    if (target) {
        target.classList.add("active");
    }


    document
        .querySelectorAll(".sidebar-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    const activeButton =
        document.querySelector(
            `.sidebar-item[data-service="${section}"]`
        );


    if (activeButton) {
        activeButton.classList.add("active");
    }

}


/* =========================================================
   USER INFORMATION
========================================================= */

function updateUserInformation() {

    if (!currentUser) {
        return;
    }


    const name =
        currentUser.fullName ||
        currentUser.email.split("@")[0];

    const email =
        currentUser.email;


    const sidebarName =
        document.getElementById(
            "sidebarUserName"
        );

    const sidebarEmail =
        document.getElementById(
            "sidebarUserEmail"
        );

    const initial =
        document.getElementById(
            "userInitial"
        );


    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (sidebarEmail) {
        sidebarEmail.textContent = email;
    }

    if (initial) {
        initial.textContent =
            name.charAt(0).toUpperCase();
    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "finsecure_token"
    );

    localStorage.removeItem(
        "finsecure_user"
    );


    currentUser = null;


    document
        .getElementById("loginForm")
        ?.reset();


    clearMessages();


    showPage("landingPage");

}


/* =========================================================
   UPI FRAUD DETECTION
========================================================= */

function initializeUPIDetection() {

    const upiForm =
        document.getElementById("upiForm");


    if (!upiForm) {
        return;
    }


    upiForm.addEventListener(
        "submit",
        handleUPIAnalysis
    );

}


/* =========================================================
   UPI ANALYSIS
========================================================= */

async function handleUPIAnalysis(event) {

    event.preventDefault();


    const token =
        localStorage.getItem(
            "finsecure_token"
        );


    if (!token) {

        alert(
            "Your session has expired. Please login again."
        );

        showPage("loginPage");

        return;
    }


    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );

    const type =
        document.getElementById(
            "transactionType"
        ).value;

    const oldbalanceOrg =
        Number(
            document.getElementById(
                "oldbalanceOrg"
            ).value
        );

    const newbalanceOrig =
        Number(
            document.getElementById(
                "newbalanceOrig"
            ).value
        );

    const oldbalanceDest =
        Number(
            document.getElementById(
                "oldbalanceDest"
            ).value
        );

    const newbalanceDest =
        Number(
            document.getElementById(
                "newbalanceDest"
            ).value
        );


    const button =
        document.getElementById(
            "upiAnalyzeBtn"
        );

    const result =
        document.getElementById(
            "upiResult"
        );


    button.disabled = true;

    button.textContent =
        "⏳ Analyzing Transaction...";


    result.innerHTML = `

        <div class="result-placeholder">

            <div class="result-icon">
                🔍
            </div>

            <h2>AI Analysis in Progress</h2>

            <p>
                FinSecure AI is evaluating the transaction
                against the fraud detection model.
            </p>

        </div>

    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/fraud/predict`,
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    amount:
                        amount,

                    type:
                        type,

                    oldbalanceOrg:
                        oldbalanceOrg,

                    newbalanceOrig:
                        newbalanceOrig,

                    oldbalanceDest:
                        oldbalanceDest,

                    newbalanceDest:
                        newbalanceDest

                })
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        console.log(
            "Fraud prediction response:",
            response.status,
            data
        );


        if (response.status === 401) {

            logout();

            alert(
                "Your session has expired. Please login again."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Fraud analysis failed."
            );

        }


        displayFraudResult(data);


    } catch (error) {

        console.error(
            "Fraud detection error:",
            error
        );


        result.innerHTML = `

            <div class="result-placeholder">

                <div class="result-icon">
                    ⚠
                </div>

                <h2>Analysis Failed</h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    } finally {

        button.disabled = false;

        button.textContent =
            "🔍 Analyze Transaction";

    }

}


/* =========================================================
   DISPLAY FRAUD RESULT
========================================================= */

function displayFraudResult(data) {

    /*
       Backend response expected:

       {
          prediction: {
              fraud_probability,
              risk_score,
              risk_level,
              decision,
              is_fraud
          }
       }
    */


    const prediction =
        data.prediction || data;


    const probability =
        Number(
            prediction.fraud_probability || 0
        );


    const riskScore =
        Number(
            prediction.risk_score || 0
        );


    const riskLevel =
        prediction.risk_level ||
        "UNKNOWN";


    const decision =
        prediction.decision ||
        "UNKNOWN";


    const isFraud =
        prediction.is_fraud === true ||
        decision.toUpperCase() === "FRAUD";


    const result =
        document.getElementById(
            "upiResult"
        );


    if (isFraud) {

        statistics.fraud++;

    } else {

        statistics.safe++;

    }

    statistics.analyzed++;


    updateStatistics();


    const badgeClass =
        isFraud
            ? "fraud"
            : "safe";


    const badgeText =
        isFraud
            ? "⚠ FRAUD DETECTED"
            : "✓ TRANSACTION SAFE";


    result.innerHTML = `

        <div class="result-content">

            <span class="result-badge ${badgeClass}">
                ${badgeText}
            </span>

            <h2>
                ${escapeHTML(decision)}
            </h2>

            <div class="risk-score">
                ${riskScore.toFixed(2)}
            </div>

            <div class="risk-label">
                RISK SCORE
            </div>

            <div class="result-details">

                <div class="result-detail">

                    <span>
                        FRAUD PROBABILITY
                    </span>

                    <strong>
                        ${(probability * 100).toFixed(2)}%
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        RISK LEVEL
                    </span>

                    <strong>
                        ${escapeHTML(riskLevel)}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        DECISION
                    </span>

                    <strong>
                        ${escapeHTML(decision)}
                    </strong>

                </div>


                <div class="result-detail">

                    <span>
                        MODEL STATUS
                    </span>

                    <strong>
                        AI ANALYZED
                    </strong>

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   QR DETECTION
========================================================= */

function initializeQRDetection() {

    const chooseButton =
        document.getElementById(
            "chooseQrBtn"
        );

    const fileInput =
        document.getElementById(
            "qrFile"
        );


    if (!chooseButton || !fileInput) {
        return;
    }


    chooseButton.addEventListener(
        "click",
        () => {
            fileInput.click();
        }
    );


    fileInput.addEventListener(
        "change",
        handleQRFile
    );

}


/* =========================================================
   QR FILE PREVIEW
========================================================= */

function handleQRFile(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const fileName =
        document.getElementById(
            "qrFileName"
        );


    const preview =
        document.getElementById(
            "qrPreview"
        );


    const image =
        document.getElementById(
            "qrImagePreview"
        );


    const qrResult =
        document.getElementById(
            "qrResult"
        );


    fileName.textContent =
        `Selected: ${file.name}`;


    const reader =
        new FileReader();


    reader.onload = function(e) {

        image.src =
            e.target.result;

        preview.style.display =
            "block";


        /*
           QR backend endpoint has not been
           specified in the current backend details.

           Therefore this displays the selected
           QR image and keeps the module ready
           for the QR API.
        */

        qrResult.innerHTML = `

            <div class="result-card">

                <div class="result-placeholder">

                    <div class="result-icon">
                        ✓
                    </div>

                    <h2>
                        QR Image Loaded
                    </h2>

                    <p>
                        The QR image has been successfully
                        selected. Connect your QR detection
                        Spring Boot endpoint here when the
                        backend module is ready.
                    </p>

                </div>

            </div>

        `;

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const analyzed =
        document.getElementById(
            "transactionsAnalyzed"
        );

    const fraud =
        document.getElementById(
            "fraudDetected"
        );

    const safe =
        document.getElementById(
            "safeTransactions"
        );


    if (analyzed) {
        analyzed.textContent =
            statistics.analyzed;
    }

    if (fraud) {
        fraud.textContent =
            statistics.fraud;
    }

    if (safe) {
        safe.textContent =
            statistics.safe;
    }

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        "form-message";


    if (type === "success") {

        element.classList.add(
            "success-message"
        );

    }

    if (type === "error") {

        element.classList.add(
            "error-message"
        );

    }

    if (type === "info") {

        element.classList.add(
            "info-message"
        );

    }

}


/* =========================================================
   CLEAR MESSAGES
========================================================= */

function clearMessages() {

    const loginMessage =
        document.getElementById(
            "loginMessage"
        );

    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    if (loginMessage) {
        loginMessage.textContent = "";
    }

    if (registerMessage) {
        registerMessage.textContent = "";
    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}