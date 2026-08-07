/* ------------------ LOAD SCHEDULE GRID ------------------ */

function loadSchedule(tasks) {
    const cells = document.querySelectorAll(".schedule-cell");

    cells.forEach(cell => {
        const day = cell.dataset.day;
        const time = cell.dataset.time;

        const time24 = convertTo24(time);

        const matches = tasks.filter(t =>
            t.schedule_day === day &&
            t.schedule_time_start === time24
        );

        if (matches.length > 0) {
            matches.forEach(task => {
                const box = document.createElement("div");
                box.classList.add("task-box");
                box.style.background = task.schedule_colour;
                box.innerText = task.schedule_detail;

                box.onclick = () => openEditSchedulePopup(task.schedule_id);

                const rows = getDurationRows(task.schedule_time_start, task.schedule_time_end);
                box.style.height = `${rows * 60}px`;

                cell.appendChild(box);
            });
        }
    });
}

/* ------------------ TIME CONVERSION ------------------ */

function convertTo24(timeStr) {
    const map = {
        "8AM": "08:00",
        "9AM": "09:00",
        "10AM": "10:00",
        "11AM": "11:00",
        "12PM": "12:00",
        "1PM": "13:00",
        "2PM": "14:00",
        "3PM": "15:00",
        "4PM": "16:00",
        "5PM": "17:00",
        "6PM": "18:00",
        "7PM": "19:00",
        "8PM": "20:00",
        "9PM": "21:00",
        "10PM": "22:00",
        "11PM": "23:00",
        "12AM": "00:00"
    };
    return map[timeStr];
}

/* ------------------ ADD TASK POPUP ------------------ */

function openSchedulePopup() {
    document.getElementById("schedulePopup").style.display = "block";
}

function closeSchedulePopup() {
    document.getElementById("schedulePopup").style.display = "none";
}

/* ------------------ EDIT TASK POPUP ------------------ */

function openEditSchedulePopup(id) {
    const task = window.scheduleData.find(t => t.schedule_id === id);
    if (!task) return;

    document.getElementById("edit_schedule_id").value = task.schedule_id;
    document.getElementById("edit_schedule_detail").value = task.schedule_detail;
    document.getElementById("edit_schedule_day").value = task.schedule_day;
    document.getElementById("edit_schedule_start").value = task.schedule_time_start;
    document.getElementById("edit_schedule_end").value = task.schedule_time_end;
    document.getElementById("edit_schedule_colour").value = task.schedule_colour;
    document.getElementById("edit_schedule_description").value = task.schedule_detail;

    document.getElementById("editSchedulePopup").style.display = "block";
}

function closeEditSchedulePopup() {
    document.getElementById("editSchedulePopup").style.display = "none";
}

/* ------------------ DELETE TASK ------------------ */

function deleteScheduleTask() {
    const id = document.getElementById("edit_schedule_id").value;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    fetch(`/delete_schedule/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrfToken
        },
        body: ""
    })
    .then(res => {
        if (res.ok) {
            window.location.reload();
        } else {
            alert("Error deleting task.");
        }
    })
    .catch(() => alert("Error deleting task."));
}

/* ------------------ INITIAL LOAD ------------------ */

window.onload = () => {
    const scheduleJson = document.getElementById("schedule-json")?.textContent;
    window.scheduleData = JSON.parse(scheduleJson || "[]");
    loadSchedule(window.scheduleData);
};

/* ------------------ MULTI-HOUR CALC ------------------ */

function getDurationRows(start, end) {
    const startHour = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);
    return endHour - startHour;
}