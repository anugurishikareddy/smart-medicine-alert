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


    if(name === "" || age === "") {

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



    if(
        name === "" ||
        dosage === "" ||
        time === "" ||
        startDate === "" ||
        endDate === ""
    ){

        alert("Please fill all medicine details");
        return;

    }



    fetch(
        "http://127.0.0.1:5000/add_medicine",
        {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },


        body:JSON.stringify({

            name:name,

            dosage:dosage,

            time:time,

            status:"Pending"

        })

    })



    .then(response => response.json())


    .then(data => {


        alert(data.message);


        loadMedicinesFromBackend();


        clearInputs();


    })


    .catch(error=>{


        console.log(error);


        alert("Backend connection failed");


    });


}



// ---------------- LOAD FROM BACKEND ----------------


function loadMedicinesFromBackend(){


    fetch(
        "http://127.0.0.1:5000/medicines"
    )


    .then(response=>response.json())


    .then(data=>{


        medicines = data;


        displayMedicines();


        updateDashboard();


    })


    .catch(error=>{


        console.log(error);


    });


}
// ---------------- DISPLAY MEDICINES ----------------

function displayMedicines() {

    let list =
    document.getElementById("medicineList");


    if(!list) return;


    let search =
    document.getElementById("searchMedicine")
    .value
    .toLowerCase();


    list.innerHTML = "";


    let filtered =
    medicines.filter(function(medicine){

        return medicine.name
        .toLowerCase()
        .includes(search);

    });



    if(filtered.length === 0){

        list.innerHTML =
        "<p>No medicines found.</p>";

        return;

    }



    filtered.forEach(function(medicine){


        list.innerHTML += `

        <div class="medicine">

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
            <b>Status:</b>
            ${medicine.status || "Pending"}
            </p>


            <button onclick="markTaken(${medicine.id})">
            ✅ Medicine Taken
            </button>


            <button onclick="editMedicine(${medicine.id})">
            ✏️ Edit
            </button>


            <button onclick="deleteMedicine(${medicine.id})">
            🗑️ Delete
            </button>


        </div>

        `;


    });


}



// ---------------- MARK TAKEN ----------------
// ---------------- MARK TAKEN ----------------

function markTaken(id) {

    let medicine = medicines.find(
        m => Number(m.id) === Number(id)
    );


    fetch("http://127.0.0.1:5000/mark_taken/" + id, {
        method: "PUT"
    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);


        if(medicine){

            fetch("http://127.0.0.1:5000/add_history", {

                method: "POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    name: medicine.name,

                    dosage: medicine.dosage,

                    time: medicine.time,

                    status: "Taken",

                    date: new Date().toLocaleString()

                })

            })

            .then(response => response.json())

            .then(historyData => {

                console.log(historyData.message);

                loadHistoryFromBackend();

            });

        }


        loadMedicinesFromBackend();

        loadHistoryFromBackend();


    })


    .catch(error => {

        console.log(error);

    });

}


// ---------------- DELETE MEDICINE ----------------

function deleteMedicine(id) {

    if(!confirm("Delete this medicine?")){
        return;
    }


    fetch("http://127.0.0.1:5000/delete_medicine/" + id, {

        method: "DELETE"

    })


    .then(response => response.json())


    .then(data => {

        alert(data.message);

        loadMedicinesFromBackend();

    })


    .catch(error => {

        console.log(error);

        alert("Delete failed");

    });

}

// ---------------- EDIT MEDICINE ----------------

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
        "Enter time:",
        medicine.time
    );

    if (newTime === null) return;



    fetch(`http://127.0.0.1:5000/update_medicine/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name: newName,

            dosage: newDosage,

            time: newTime

        })

    })


    .then(response => response.json())


    .then(data => {

        alert(data.message);

        loadMedicinesFromBackend();

    })


    .catch(error => {

        console.log(error);

        alert("Update failed");

    });

}

// ---------------- LOAD HISTORY FROM BACKEND ----------------

function loadHistoryFromBackend(){

    fetch("http://127.0.0.1:5000/history")

    .then(response => response.json())

    .then(data => {

        history = data;

        displayHistory();

    })

    .catch(error => {

        console.log(error);

    });

}

// ---------------- HISTORY ----------------

function displayHistory(){

    let list =
    document.getElementById("historyList");


    if(!list) return;


    list.innerHTML="";


    if(history.length===0){

        list.innerHTML =
        "<p>No history available.</p>";

        return;

    }



    history.slice().reverse()
    .forEach(function(item){


        list.innerHTML += `

        <div class="medicine">

        💊 <b>${item.name}</b>

        <p>
        Dosage: ${item.dosage}
        </p>

        <p>
        Time: ${item.time}
        </p>

        <p>
        Status: ${item.status}
        </p>

        <p>
        Date: ${item.date}
        </p>

        </div>

        `;


    });


}



// ---------------- DASHBOARD ----------------


function updateDashboard(){


    let total =
    document.getElementById("totalMedicines");


    let taken =
    document.getElementById("takenMedicines");


    let pending =
    document.getElementById("pendingMedicines");



    if(total)
    total.innerText =
    medicines.length;



    let takenCount =
    medicines.filter(
        m=>m.status==="Taken"
    ).length;



    if(taken)
    taken.innerText =
    takenCount;



    if(pending)
    pending.innerText =
    medicines.length-takenCount;



}



// ---------------- CLEAR INPUTS ----------------


function clearInputs(){


    document.getElementById(
        "medicineName"
    ).value="";


    document.getElementById(
        "dosage"
    ).value="";


    document.getElementById(
        "medicineTime"
    ).value="";


    document.getElementById(
        "startDate"
    ).value="";


    document.getElementById(
        "endDate"
    ).value="";


}




// ---------------- DARK MODE ----------------


function toggleDarkMode(){

    document.body.classList.toggle(
        "dark"
    );

}




// ---------------- EMERGENCY CONTACT ----------------


function saveEmergencyContact(){


    let name =
    document.getElementById(
        "emergencyName"
    ).value;


    let phone =
    document.getElementById(
        "emergencyPhone"
    ).value;



    localStorage.setItem(
        "emergencyName",
        name
    );


    localStorage.setItem(
        "emergencyPhone",
        phone
    );


    alert(
        "Emergency contact saved successfully ✅"
    );


}




// ---------------- LOAD DATA ----------------


// ---------------- LOAD DATA ----------------

function loadData(){

    displayMedicines();

    loadHistoryFromBackend();

    updateDashboard();

}


// ---------------- START ----------------

loadData();

loadMedicinesFromBackend();


setInterval(
    function(){

        loadMedicinesFromBackend();

    },
    10000
);
// ---------------- CLEAR HISTORY ----------------

function clearHistory(){

    if(!confirm("Clear all history?")){
        return;
    }

    history = [];

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    displayHistory();

    alert("History cleared successfully!");
}