const csrfToken =
    document.querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

function calculateRow(element)
{
    const row = element.closest("tr");

    const term1 = parseFloat(row.cells[1].querySelector("input").value) || 0;
    const term2 = parseFloat(row.cells[2].querySelector("input").value) || 0;
    const term3 = parseFloat(row.cells[4].querySelector("input").value) || 0;
    const term4 = parseFloat(row.cells[5].querySelector("input").value) || 0;
    
    // Calculate average (only count marks that exist)
    const marks = [term1, term2, term3, term4].filter(m => m > 0);

    let average = 0;
    if (marks.length > 0)
    {
        average = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
    }

    row.querySelector(".average").innerText = average;
}

function saveGrades()
{
    const rows = document.querySelectorAll("#gradeTable tbody tr");

    const grades = [];

    rows.forEach(row =>
    {
        grades.push({
            grades_id: row.dataset.id || null,
            subject: row.cells[0].querySelector("input").value || "Untitled",

            term_1: row.cells[1].querySelector("input").value || 0,
            term_2: row.cells[2].querySelector("input").value || 0,

            semester_1: row.querySelector(".semester1").value|| " ", 
            term_3: row.cells[4].querySelector("input").value || 0,
            term_4: row.cells[5].querySelector("input").value || 0,

            semester_2: row.querySelector(".semester2").value|| " ",
            average: Math.round(parseFloat(row.querySelector(".average").innerText) || 0)


        });
    });
    fetch("/save_grades", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(grades)
    })
    .then(response => response.json())
    .then(data =>
    {
        alert("Grades saved successfully.");
    })
    .catch(error =>
    {
        console.error(error);
        alert("Error saving grades.");
    });
}

function addSubject() {
    const tbody = document.querySelector("#gradeTable tbody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" class="subject-input"></td>

        <td><input type="number" class="grade-input" oninput="calculateRow(this)"></td>
        <td><input type="number" class="grade-input" oninput="calculateRow(this)"></td>

        <td><input type="text" class="semester1" value="-"></td>

        <td><input type="number" class="grade-input" oninput="calculateRow(this)"></td>
        <td><input type="number" class="grade-input" oninput="calculateRow(this)"></td>

        <td><input type="text" class="semester2" value="-"></td>

        <td class="average">0</td>

        <td><button onclick="deleteRow(this)">Delete</button></td>
    `;

    tbody.appendChild(row);
}


function deleteRow(button) {
    const row = button.closest("tr");

    const id = row.dataset.id;

    if (id) {
        fetch(`/delete_grade/${id}`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
                }
            })
        .then(() => {
            row.remove();
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting grade.");
        });
    } 
    else {
        // If row is newly added and not saved yet → just remove it
        row.remove();
    }
}

window.onload = () => {
    document.querySelectorAll("#gradeTable tbody tr").forEach(row => {
        const inputs = row.querySelectorAll("input");
        inputs.forEach(input => calculateRow(input));
    });
};
