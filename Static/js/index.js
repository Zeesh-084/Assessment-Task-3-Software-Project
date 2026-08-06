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
const calendarBody = document.getElementById("calendar-body");
const calendarMonth = document.getElementById("calendar-month");

let currentDate = new Date();

function loadCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    calendarMonth.innerText = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }

        const cell = document.createElement("td");
        cell.innerText = day;
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar();
}

window.onload = loadCalendar;


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
