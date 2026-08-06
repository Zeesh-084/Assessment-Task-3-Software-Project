const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

/* ---------------------------------------------------------
   BUILD WEEK A + WEEK B GRID FROM HTML TABLES
--------------------------------------------------------- */
function getWeekGrid(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll("tbody tr");

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periods = ["BeforeSchool", "P1", "P2", "P3", "P4", "AfterSchool"];

    const grid = {};

    days.forEach(day => {
        grid[day] = {};
    });

    rows.forEach((row, rowIndex) => {
        const period = periods[rowIndex];
        const inputs = row.querySelectorAll("input");

        inputs.forEach((input, colIndex) => {
            const day = days[colIndex];
            grid[day][period] = input.value || "";
        });
    });

    return grid;
}

/* ---------------------------------------------------------
   SUBJECT LIST FUNCTIONS
--------------------------------------------------------- */
function addSubject() {
    const tbody = document.querySelector("#subjectTable tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="subject-input"></td>
        <td><input type="text" class="teacher-input"></td>
        <td><input type="text" class="room-input"></td>
        <td><button onclick="deleteSubject(this)">Delete</button></td>
    `;

    tbody.appendChild(row);
}

function deleteSubject(button) {
    const row = button.closest("tr");
    const id = row.dataset.id;

    if (id) {
        fetch(`/delete_subject/${id}`, {
            method: "POST",
            headers: { "X-CSRFToken": csrfToken }
        })
        .then(() => row.remove())
        .catch(err => {
            console.error(err);
            alert("Error deleting subject.");
        });
    } else {
        row.remove();
    }
}

/* ---------------------------------------------------------
   SAVE TIMETABLE (GRID + SUBJECT LIST)
--------------------------------------------------------- */
function saveTimetable() {
    const subjectRows = document.querySelectorAll("#subjectTable tbody tr");

    const subjects = [];

    subjectRows.forEach(row => {
        subjects.push({
            timetable_id: row.dataset.id || null,
            subject: row.querySelector(".subject-input").value || "",
            teacher: row.querySelector(".teacher-input").value || "",
            rooms: row.querySelector(".room-input").value || ""
        });
    });

    const weekA = getWeekGrid("weekA");
    const weekB = getWeekGrid("weekB");

    const payload = {
        subjects: subjects,
        weekA: weekA,
        weekB: weekB
    };

    fetch("/save_timetable", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert("Timetable saved successfully.");
    })
    .catch(error => {
        console.error(error);
        alert("Error saving timetable.");
    });
}

/* ---------------------------------------------------------
   ON PAGE LOAD — nothing special needed
--------------------------------------------------------- */
window.onload = () => {
    console.log("Timetable page loaded.");
};
