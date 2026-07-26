let medicines =
    JSON.parse(localStorage.getItem("medicines")) || [];

let history =
    JSON.parse(localStorage.getItem("history")) || [];


// ---------------- PROFILE ----------------

function saveProfile() {

    let name =
        document.getElementById("patientName").value;

    let age =
        document.getElementById("patientAge").value;

    if (name === "" || age === "") {

        alert("Please enter patient details");

        return;
    }

    localStorage.setItem(
        "patientName",
        name
    );

    localStorage.setItem(
        "patientAge",
        age
    );

    document.getElementById(
        "profileMessage"
    ).innerText =
        "Profile saved successfully ✅";
}


// ---------------- ADD MEDICINE ----------------

function addMedicine() {

    let name =
        document.getElementById("medicineName").value;

    let dosage =
        document.getElementById("dosage").value;

    let time =
        document.getElementById("medicineTime").value;

    let period =
        document.getElementById("medicinePeriod").value;

    let startDate =
        document.getElementById("startDate").value;

    let endDate =
        document.getElementById("endDate").value;


    if (
        name === "" ||
        dosage === "" ||
        time === "" ||
        startDate === "" ||
        endDate === ""
    ) {

        alert("Please fill all medicine details");

        return;
    }


    let medicine = {

        id: Date.now(),

        name: name,

        dosage: dosage,

        time: time,

        period: period,

        startDate: startDate,

        endDate: endDate,

        taken: false,

        lastTaken: ""

    };


    medicines.push(medicine);


    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );


    clearInputs();

    displayMedicines();

    updateDashboard();

    alert("Medicine added successfully 💊");
}


// ---------------- DISPLAY ----------------

function displayMedicines() {

    let list =
        document.getElementById("medicineList");

    let search =
        document.getElementById("searchMedicine")
        .value
        .toLowerCase();


    list.innerHTML = "";


    let filtered =
        medicines.filter(function(medicine) {

            return medicine.name
                .toLowerCase()
                .includes(search);

        });


    if (filtered.length === 0) {

        list.innerHTML =
            "<p>No medicines found.</p>";

        return;
    }


    filtered.forEach(function(medicine) {

        let status =
            medicine.taken
                ? "taken"
                : "pending";


        list.innerHTML += `

            <div class="medicine ${status}">

                <h3>
                    💊 ${medicine.name}
                </h3>

                <p>
                    <b>Dosage:</b>
                    ${medicine.dosage}
                </p>

                <p>
                    <b>Time:</b>
                    ⏰ ${medicine.time}
                </p>

                <p>
                    <b>Period:</b>
                    ${medicine.period}
                </p>

                <p>
                    <b>From:</b>
                    ${medicine.startDate}
                </p>

                <p>
                    <b>To:</b>
                    ${medicine.endDate}
                </p>

                <p>
                    Status:
                    ${medicine.taken
                        ? "✅ Taken"
                        : "⏳ Pending"}
                </p>

                <button
                    onclick="markTaken(${medicine.id})">

                    ✅ Medicine Taken

                </button>
                <button
    onclick="editMedicine(${medicine.id})">

    ✏️ Edit

</button>

                <button
                    class="delete-btn"
                    onclick="deleteMedicine(${medicine.id})">

                    🗑️ Delete

                </button>

            </div>
        `;

    });

}


// ---------------- MARK TAKEN ----------------

function markTaken(id) {

    let medicine =
        medicines.find(
            m => m.id === id
        );


    if (!medicine) return;


    medicine.taken = true;

    medicine.lastTaken =
        new Date().toLocaleString();


    history.push({

        name: medicine.name,

        dosage: medicine.dosage,

        time: medicine.time,

        status: "Taken",

        date: new Date().toLocaleString()

    });


    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );


    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );


    displayMedicines();

    displayHistory();

    updateDashboard();

    alert("Medicine marked as taken ✅");
}


// ---------------- DELETE ----------------

function deleteMedicine(id) {

    if (
        !confirm(
            "Delete this medicine?"
        )
    ) {
        return;
    }


    medicines =
        medicines.filter(
            medicine =>
                medicine.id !== id
        );


    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );


    displayMedicines();

    updateDashboard();
}


// ---------------- HISTORY ----------------

function displayHistory() {

    let list =
        document.getElementById("historyList");

    list.innerHTML = "";


    if (history.length === 0) {

        list.innerHTML =
            "<p>No history available.</p>";

        return;
    }


    history
        .slice()
        .reverse()
        .forEach(function(item) {

            list.innerHTML += `

                <div class="medicine">

                    💊 <b>${item.name}</b>

                    <p>
                        Dosage:
                        ${item.dosage}
                    </p>

                    <p>
                        Time:
                        ${item.time}
                    </p>

                    <p>
                        Status:
                        ✅ ${item.status}
                    </p>

                    <p>
                        Date:
                        ${item.date}
                    </p>

                </div>

            `;

        });
}


// ---------------- DASHBOARD ----------------

function updateDashboard() {

    document.getElementById(
        "totalMedicines"
    ).innerText =
        medicines.length;


    document.getElementById(
        "todayMedicines"
    ).innerText =
        medicines.length;


    let taken =
        medicines.filter(
            medicine =>
                medicine.taken
        ).length;


    document.getElementById(
        "takenMedicines"
    ).innerText =
        taken;


    document.getElementById(
        "pendingMedicines"
    ).innerText =
        medicines.length - taken;
}


// ---------------- CLEAR INPUTS ----------------

function clearInputs() {

    document.getElementById(
        "medicineName"
    ).value = "";

    document.getElementById(
        "dosage"
    ).value = "";

    document.getElementById(
        "medicineTime"
    ).value = "";

    document.getElementById(
        "startDate"
    ).value = "";

    document.getElementById(
        "endDate"
    ).value = "";
}


// ---------------- REMINDER ----------------

let notifiedMedicines = {};


function checkMedicine() {

    let now = new Date();


    let currentTime =

        String(now.getHours())
            .padStart(2, "0")

        + ":" +

        String(now.getMinutes())
            .padStart(2, "0");


    medicines.forEach(function(medicine) {

        let key =
            medicine.id +
            "-" +
            currentTime;


        if (
            medicine.time === currentTime &&
            !notifiedMedicines[key]
        ) {

            showReminder(medicine);

            notifiedMedicines[key] = true;

        }

    });

}


// ---------------- REMINDER MESSAGE ----------------

function showReminder(medicine) {

    let message =
        "💊 Medicine Reminder!\n\n" +
        medicine.name +
        "\n\nDosage: " +
        medicine.dosage;


    alert(message);


    speakReminder(
        medicine.name
    );


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "💊 Medicine Reminder",
            {
                body:
                    medicine.name +
                    " - " +
                    medicine.dosage
            }
        );

    }


    let audio =
        document.getElementById(
            "alertSound"
        );

    audio.play().catch(
        () => {}
    );
}


// ---------------- VOICE ----------------

function speakReminder(name) {

    if (
        "speechSynthesis" in window
    ) {

        let speech =
            new SpeechSynthesisUtterance(

                "Medicine reminder. " +
                "It is time to take " +
                name

            );


        speech.rate = 0.9;

        speechSynthesis.speak(
            speech
        );

    }
}


// ---------------- NOTIFICATION ----------------

function requestNotification() {

    if (
        "Notification" in window
    ) {

        Notification.requestPermission();

    }

}


// ---------------- DARK MODE ----------------

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );

}


// ---------------- EMERGENCY ----------------

function saveEmergencyContact() {

    let name =
        document.getElementById(
            "emergencyName"
        ).value;

    let phone =
        document.getElementById(
            "emergencyPhone"
        ).value;


    if (
        name === "" ||
        phone === ""
    ) {

        alert(
            "Enter emergency contact details"
        );

        return;
    }


    localStorage.setItem(
        "emergencyName",
        name
    );

    localStorage.setItem(
        "emergencyPhone",
        phone
    );


    displayEmergencyContact();
}


function displayEmergencyContact() {

    let name =
        localStorage.getItem(
            "emergencyName"
        );

    let phone =
        localStorage.getItem(
            "emergencyPhone"
        );


    if (name && phone) {

        document.getElementById(
            "emergencyDisplay"
        ).innerHTML = `

            <p>
                🚨 <b>${name}</b>
            </p>

            <p>
                📞 ${phone}
            </p>

        `;

    }

}


// ---------------- LOAD DATA ----------------

function loadData() {

    let name =
        localStorage.getItem(
            "patientName"
        );

    let age =
        localStorage.getItem(
            "patientAge"
        );


    if (name) {

        document.getElementById(
            "patientName"
        ).value = name;

    }


    if (age) {

        document.getElementById(
            "patientAge"
        ).value = age;

    }


    displayMedicines();

    displayHistory();

    displayEmergencyContact();

    updateDashboard();

}


// ---------------- START ----------------

loadData();


// Check every second

setInterval(
    checkMedicine,
    1000
);


// Ask notification permission

requestNotification();
function savepoint(){
    alert("profile saved successfully!");
}
function savecontact(){
    alert("Emergency contact saved successfully!");
}
function markMedicineAsTaken(medicineName) {
    history.push({
        medicine: medicineName,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
function editMedicine(id) {

    let medicine = medicines.find(
        m => m.id === id
    );

    if (!medicine) return;

    let newName = prompt(
        "Enter medicine name:",
        medicine.name
    );

    if (newName === null) return;

    let newDosage = prompt(
        "Enter dosage:",
        medicine.dosage
    );

    if (newDosage === null) return;

    let newTime = prompt(
        "Enter time (HH:MM):",
        medicine.time
    );

    if (newTime === null) return;

    medicine.name = newName;
    medicine.dosage = newDosage;
    medicine.time = newTime;

    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );

    displayMedicines();
    updateDashboard();

    alert("Medicine updated successfully ✅");
}
function clearHistory() {

    if (!confirm("Clear all medicine history?")) {
        return;
    }

    history = [];

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();

    alert("Medicine history cleared successfully ✅");
}