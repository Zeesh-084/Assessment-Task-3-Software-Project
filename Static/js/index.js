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
let homeDate = new Date();

/* ------------------ RENDER HOMEPAGE CALENDAR ------------------ */

function loadHomeCalendar(events) {
    const year = homeDate.getFullYear();
    const month = homeDate.getMonth();

    document.getElementById("calendar-month").innerText =
        homeDate.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const body = document.getElementById("calendar-body");
    body.innerHTML = "";

    let row = document.createElement("tr");

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
    }

    // Loop through days
    for (let day = 1; day <= daysInMonth; day++) {

        if (row.children.length === 7) {
            body.appendChild(row);
            row = document.createElement("tr");
        }

        const cell = document.createElement("td");
        cell.innerText = day;

        const cellDate = new Date(year, month, day);

        // Find events for this day (using DEADLINE)
        const dayEvents = events.filter(e => {
            const [y, m, d] = e.event_deadline.split("-");
            const eventDate = new Date(Number(y), Number(m) - 1, Number(d));

            const repeat = (e.event_repeat || "").toLowerCase();

            // NON-REPEAT
            if (!repeat.includes("daily") && !repeat.includes("weekly")) {
                return eventDate.getTime() === cellDate.getTime();
            }

            // DAILY REPEAT
            if (repeat.includes("daily")) {
                return (
                    cellDate >= eventDate &&
                    cellDate.getMonth() === homeDate.getMonth() &&
                    cellDate.getFullYear() === homeDate.getFullYear()
                );
            }

            // WEEKLY REPEAT
            if (repeat.includes("weekly")) {
                return (
                    cellDate >= eventDate &&
                    cellDate.getDay() === eventDate.getDay() &&
                    cellDate.getMonth() === homeDate.getMonth() &&
                    cellDate.getFullYear() === homeDate.getFullYear()
                );
            }

            return false;
        });

        // Add dots + tooltip
        if (dayEvents.length > 0) {
            dayEvents.forEach(ev => {
                const dot = document.createElement("div");
                dot.classList.add("event-dot");

                const repeat = (ev.event_repeat || "").toLowerCase();
                if (repeat.includes("daily")) dot.classList.add("event-dot-daily");
                if (repeat.includes("weekly")) dot.classList.add("event-dot-weekly");

                cell.appendChild(dot);
            });

            cell.title = dayEvents.map(ev =>
                `${ev.event_detail}
Date: ${ev.event_date}
Time: ${ev.event_time}
Repeat: ${ev.event_repeat}
Deadline: ${ev.event_deadline}`
            ).join("\n\n");
        }

        row.appendChild(cell);
    }

    body.appendChild(row);
}

/* ------------------ MONTH NAVIGATION ------------------ */

function prevMonth() {
    homeDate.setMonth(homeDate.getMonth() - 1);
    loadHomeCalendar(window.homeEvents);
}

function nextMonth() {
    homeDate.setMonth(homeDate.getMonth() + 1);
    loadHomeCalendar(window.homeEvents);
}

/* ------------------ ADD EVENT POPUP ------------------ */

function openEventPopup() {
    document.getElementById("eventPopup").style.display = "block";
}

function closeEventPopup() {
    document.getElementById("eventPopup").style.display = "none";
}

/* ------------------ INITIAL LOAD ------------------ */

window.onload = () => {
    const eventsJson = document.getElementById("events-json").textContent;
    window.homeEvents = JSON.parse(eventsJson);
    loadHomeCalendar(window.homeEvents);
};



//schedule
function addScheduleTask() {
    const tbody = document.getElementById("schedule-body");

    const row = document.createElement("tr");

    row.innerHTML = `
        <th>New</th>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
        <td><input type="text" class="schedule-input"></td>
    `;

    tbody.appendChild(row);
}
