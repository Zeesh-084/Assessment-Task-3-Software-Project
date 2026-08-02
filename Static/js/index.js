function openGoalsPopup(){
    document.getElementById("goalsPopup").style.display = "flex";
}

function closeGoalsPopup(){
    document.getElementById("goalsPopup").style.display = "none";
    cancelGoalEdit();
    cancelGoalAdd();
}

function openTasksPopup(){
    document.getElementById("tasksPopup").style.display = "flex";
}

function closeTasksPopup(){
    document.getElementById("tasksPopup").style.display = "none";
    cancelTaskEdit();
    cancelTaskAdd();
}

function editGoal(id, goal, progress_goal) {
    document.getElementById("edit_goal_id").value = id;
    document.getElementById("edit_goal_goal").value = goal;
    document.getElementById("edit_goal_progress_goal").value = progress_goal;

    document.getElementById("goalEditBox").style.display = "block";
}

function closeGoalEdit() {
    document.getElementById("goalEditBox").style.display = "none";
}

function saveGoalEdit() {
    const id = document.getElementById("edit_goal_id").value;
    const goal = document.getElementById("edit_goal_goal").value;
    const progress_goal = document.getElementById("edit_goal_progress_goal").value;

    fetch(`/save_goal`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goal_id=${id}&goal=${goal}&progress_goal=${progress_goal}`
    }).then(() => {
        window.location.reload();
    });
}

function openAddGoal() {
    document.getElementById("goalAddBox").style.display = "block";
}

function closeAddGoal() {
    document.getElementById("goalAddBox").style.display = "none";
}

function saveNewGoal() {
    const goal = document.getElementById("add_goal_goal").value;
    const progress_goal = document.getElementById("add_goal_progress_goal").value;

    fetch("/save_goal", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goal=${goal}&progress_goal=${progress_goal}`
    }).then(() => {
        window.location.reload();
    });
}

function updateGoalProgress(id, progress_goal) {
    fetch("/save_goal", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goal_id=${id}&progress_goal=${progress_goal}`
    }).then(() => {
        window.location.reload();
    });
}

let deleteGoalId = null;

function confirmDeleteGoal(id) {
    deleteGoalId = id;
    document.getElementById("deleteConfirm").style.display = "flex";
}

function closeDeleteConfirm() {
    document.getElementById("deleteConfirm").style.display = "none";
}

document.getElementById("deleteYes").onclick = function () {
    window.location.href = `/delete_goal/${deleteGoalId}`;
};

function editTask(id, task, progress_task) {
    document.getElementById("edit_task_id").value = id;
    document.getElementById("edit_task_task").value = task;
    document.getElementById("edit_task_progress_task").value = progress_task;
    document.getElementById("taskEditBox").style.display = "block";
}

function closeTaskEdit() {
    document.getElementById("taskEditBox").style.display = "none";
}

function saveTaskEdit() {
    const id = document.getElementById("edit_task_id").value;
    const task = document.getElementById("edit_task_task").value;
    const progress_task = document.getElementById("edit_task_progress_task").value;
    fetch(`/save_task`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `task_id=${id}&task=${task}&progress_task=${progress_task}`
    }).then(() => {
        window.location.reload();
    });
}

function openAddTask() {
    document.getElementById("taskAddBox").style.display = "block";
}
function closeAddTask() {
    document.getElementById("taskAddBox").style.display = "none";
}

function saveNewTask() {
    const task = document.getElementById("add_task_task").value;
    const progress_task = document.getElementById("add_task_progress_task").value;
    fetch("/save_task", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `task=${task}&progress_task=${progress_task}`
    }).then(() => {
        window.location.reload();
    });
}

function updateTaskProgress(id, progress_task) {
    fetch("/save_task", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `task_id=${id}&progress_task=${progress_task}`
    }).then(() => {
        window.location.reload();
    });
}

let deleteTaskId = null;

function confirmDeleteTask(id) {
    deleteTaskId = id;
    document.getElementById("deleteConfirm").style.display = "flex";
}

document.getElementById("deleteYes").onclick = function () {
    window.location.href = `/delete_task/${deleteTaskId}`;
}