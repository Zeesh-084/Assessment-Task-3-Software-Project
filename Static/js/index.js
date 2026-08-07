// ==========================================
// CSRF TOKEN
// ==========================================

function getCSRFToken() {
    return document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
}
// =========================================
// OPEN / CLOSE GOALS POPUP
// ==========================================

function openGoalsPopup() {
    document.getElementById("goalsPopup").style.display = "flex";
}

function closeGoalsPopup() {
    document.getElementById("goalsPopup").style.display = "none";
    closeAddGoal();
    closeGoalEdit();
}
// ==========================================
// ADD GOAL BOX
// ==========================================

function openAddGoal() {
    document.getElementById("goalAddBox").style.display = "block";
}

function closeAddGoal() {
    document.getElementById("goalAddBox").style.display = "none";
}

// ==========================================
// ADD NEW GOAL
// ==========================================

function saveNewGoal() {

    let goal =
        document.getElementById("add_goal_text").value.trim();

    let progress =
        document.getElementById("add_goal_progress").value;

    if(goal === "") {
        alert("Please enter a goal.");
        return;
    }
    fetch("/save_goal", {
        method:"POST",
        headers: {
            "Content-Type":
            "application/x-www-form-urlencoded",
            "X-CSRFToken":
            getCSRFToken()
        },
        body:
        `goal=${encodeURIComponent(goal)}
        &progress_goal=${encodeURIComponent(progress)}`
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Could not save goal");
        }
        return response.text();
    })
    .then(()=>{
        window.location.reload();
    })
    .catch(error=>{
        console.error(error);
        alert("Error adding goal");
    });
}

// ==========================================
// EDIT GOAL
// ==========================================
function editGoal(id, goal, progress) {
    document.getElementById("edit_goal_id").value = id;
    document.getElementById("edit_goal_text").value =
        goal.trim();
    document.getElementById("edit_goal_progress").value =
        progress.trim();
    document.getElementById("goalEditBox").style.display = "block";
}


function closeGoalEdit(){
    document.getElementById("goalEditBox").style.display="none";

}

// ==========================================
// SAVE EDITED GOAL
// ==========================================

function saveGoalEdit(){

    let id =
    document.getElementById("edit_goal_id").value;

    let goal =
    document.getElementById("edit_goal_text").value.trim();

    let progress =
    document.getElementById("edit_goal_progress").value;

    if(goal===""){
        alert("Goal cannot be empty.");
        return;
    }
    fetch("/save_goal", {
        method:"POST",
        headers:{
            "Content-Type":
            "application/x-www-form-urlencoded",
            "X-CSRFToken":
            getCSRFToken()
        },
        body:
        `goals_id=${encodeURIComponent(id)}
        &goal=${encodeURIComponent(goal)}
        &progress_goal=${encodeURIComponent(progress)}`
    })
    .then(response=>{
        if(!response.ok){
            throw new Error("Could not update goal");
        }
        return response.text();
    })
    .then(()=>{
        window.location.reload();
    })
    .catch(error=>{
        console.error(error);
        alert("Error updating goal");
    });
}
// ==========================================
// UPDATE DROPDOWN PROGRESS
// ==========================================

function updateGoalProgress(id, progress){
    fetch("/save_goal", {
        method:"POST",
        headers:{
            "Content-Type":
            "application/x-www-form-urlencoded",
            "X-CSRFToken":
            getCSRFToken()
        },
        body:
        `goals_id=${encodeURIComponent(id)}
        &progress_goal=${encodeURIComponent(progress)}`
    })
    .then(response=>{
        if(!response.ok){
            throw new Error("Could not update progress");
        }
        return response.text();
    })
    .then(()=>{
        window.location.reload();
    })
    .catch(error=>{
        console.error(error);
        alert("Error updating progress");
    });
}

// ==========================================
// DELETE GOAL
// ==========================================

let deleteGoalID = null;
function confirmDeleteGoal(id){
    deleteGoalID=id;
    document.getElementById("deleteConfirm")
    .style.display="flex";
}

function closeDeleteConfirm(){
    document.getElementById("deleteConfirm")
    .style.display="none";
}

document.getElementById("deleteYes")
.onclick=function(){
    fetch(`/delete_goal/${deleteGoalID}`, {
        method:"POST",
        headers:{
            "X-CSRFToken":getCSRFToken()
        }
    })
    .then(response=>{
        if(!response.ok){
            throw new Error("Delete failed");
        }
        return response.text();
    })
    .then(()=>{
        window.location.reload();
    })
    .catch(error=>{
        console.error(error);
        alert("Could not delete goal");
    });
};

// ==========================================
// OPEN / CLOSE TASKS POPUP
// ==========================================

function openTasksPopup() {
    document.getElementById("tasksPopup").style.display = "flex";
}

function closeTasksPopup() {
    document.getElementById("tasksPopup").style.display = "none";
    closeAddTask();
    closeTaskEdit();
}

// ==========================================
// ADD TASK BOX
// ==========================================

function openAddTask() {
    document.getElementById("taskAddBox").style.display = "block";
}

function closeAddTask() {
    document.getElementById("taskAddBox").style.display = "none";
}

// ==========================================
// ADD NEW TASK
// ==========================================

function saveNewTask() {

    let task = document.getElementById("add_task_text").value.trim();
    let progress = document.getElementById("add_task_progress").value;

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    fetch("/save_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken()
        },
        body:
            `task=${encodeURIComponent(task)}&progress_task=${encodeURIComponent(progress)}`
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not save task");
            }
            return response.text();
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert("Error adding task");
        });
}

// ==========================================
// EDIT TASK
// ==========================================

function editTask(id, task, progress) {
    document.getElementById("edit_task_id").value = id;
    document.getElementById("edit_task_text").value = task.trim();
    document.getElementById("edit_task_progress").value = progress.trim();
    document.getElementById("taskEditBox").style.display = "block";
}

function closeTaskEdit() {
    document.getElementById("taskEditBox").style.display = "none";
}

// ==========================================
// SAVE EDITED TASK
// ==========================================

function saveTaskEdit() {

    let id = document.getElementById("edit_task_id").value;
    let task = document.getElementById("edit_task_text").value.trim();
    let progress = document.getElementById("edit_task_progress").value;

    if (task === "") {
        alert("Task cannot be empty.");
        return;
    }

    fetch("/save_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken()
        },
        body:
            `tasks_id=${encodeURIComponent(id)}&task=${encodeURIComponent(task)}&progress_task=${encodeURIComponent(progress)}`
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not update task");
            }
            return response.text();
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert("Error updating task");
        });
}

// ==========================================
// UPDATE DROPDOWN PROGRESS
// ==========================================

function updateTaskProgress(id, progress) {

    fetch("/save_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken()
        },
        body:
            `tasks_id=${encodeURIComponent(id)}&progress_task=${encodeURIComponent(progress)}`
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not update progress");
            }
            return response.text();
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert("Error updating progress");
        });
}

// ==========================================
// DELETE TASK
// ==========================================

let deleteTaskID = null;

function confirmDeleteTask(id) {
    deleteTaskID = id;
    document.getElementById("deleteTaskConfirm").style.display = "flex";
}

function closeDeleteTaskConfirm() {
    document.getElementById("deleteTaskConfirm").style.display = "none";
}

document.getElementById("deleteTaskYes").onclick = function () {

    fetch(`/delete_task/${deleteTaskID}`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken()
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Delete failed");
            }
            return response.text();
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error(error);
            alert("Could not delete task");
        });
};


// calender for homepage
let homeCalDate = new Date();

/* ------------------ RENDER HOMEPAGE CALENDAR ------------------ */

function loadHomeCalendar(events) {
    const year = homeCalDate.getFullYear();
    const month = homeCalDate.getMonth();

    document.getElementById("calendar-month").innerText =
        homeCalDate.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const body = document.getElementById("calendar-body");
    body.innerHTML = "";

    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= daysInMonth; day++) {

        if (row.children.length === 7) {
            body.appendChild(row);
            row = document.createElement("tr");
        }

        const cell = document.createElement("td");
        cell.innerText = day;

        const cellDate = new Date(year, month, day);

        const dayEvents = events.filter(e => eventMatchesDate(e, cellDate));

        if (dayEvents.length > 0) {
            dayEvents.forEach(ev => {
                const dot = document.createElement("div");
                dot.classList.add("event-dot");

                dot.onclick = () => openHomeCalendarEdit(ev.event_id);

                cell.appendChild(dot);
            });
        }

        row.appendChild(cell);
    }

    body.appendChild(row);
}

/* ------------------ EVENT MATCHING ------------------ */

function eventMatchesDate(event, cellDate) {
    const [y, m, d] = event.event_date.split("-");
    const eventDate = new Date(Number(y), Number(m) - 1, Number(d));

    const repeat = (event.event_repeat || "").toLowerCase();

    if (repeat.includes("daily")) {
        return cellDate >= eventDate;
    }

    if (repeat.includes("weekly")) {
        return cellDate.getDay() === eventDate.getDay();
    }

    if (repeat.includes("monthly")) {
        return cellDate.getDate() === eventDate.getDate();
    }

    return cellDate.getTime() === eventDate.getTime();
}

/* ------------------ MONTH NAV ------------------ */

function prevMonth() {
    homeCalDate.setMonth(homeCalDate.getMonth() - 1);
    loadHomeCalendar(window.homeEvents);
}

function nextMonth() {
    homeCalDate.setMonth(homeCalDate.getMonth() + 1);
    loadHomeCalendar(window.homeEvents);
}

/* ------------------ EDIT POPUP ------------------ */

function openHomeCalendarEdit(id) {
    const ev = window.homeEvents.find(e => e.event_id === id);
    if (!ev) return;

    document.getElementById("edit_event_id").value = ev.event_id;
    document.getElementById("edit_event_detail").value = ev.event_detail;
    document.getElementById("edit_event_date").value = ev.event_date;
    document.getElementById("edit_event_time").value = ev.event_time;
    document.getElementById("edit_event_repeat").value = ev.event_repeat;
    document.getElementById("edit_event_deadline").value = ev.event_deadline;

    document.getElementById("editEventPopup").style.display = "block";
}

function closeHomeCalendarEdit() {
    document.getElementById("editEventPopup").style.display = "none";
}

/* ------------------ INITIAL LOAD ------------------ */

window.onload = () => {
    const eventsJson = document.getElementById("events-json")?.textContent;
    window.homeEvents = JSON.parse(eventsJson || "[]");
    loadHomeCalendar(window.homeEvents);
};



//schedule
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