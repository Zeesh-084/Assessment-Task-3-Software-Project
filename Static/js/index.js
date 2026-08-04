// ===============================
// POPUP OPEN / CLOSE
// ===============================

function openGoalsPopup() {
    document.getElementById("goalsPopup").style.display = "flex";
}

function closeGoalsPopup() {
    document.getElementById("goalsPopup").style.display = "none";
    closeAddGoal();
    closeGoalEdit();
}


// ===============================
// ADD GOAL
// ===============================

function openAddGoal() {
    document.getElementById("goalAddBox").style.display = "block";
}

function closeAddGoal() {
    document.getElementById("goalAddBox").style.display = "none";
}

function saveNewGoal() {
    const goal = document.getElementById("add_goal_text").value;
    const progress = document.getElementById("add_goal_progress").value;

    fetch("/save_goal", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goal=${goal}&progress_goal=${progress}`
    })
    .then(response => response.text())
    .then(goals_id => {

        // Add to homepage
        document.getElementById("goals-list").innerHTML += `
            <li data-id="${goals_id}">
                <span class="goal-text">${goal}</span>
                <span class="progress">${progress}</span>
            </li>
        `;

        // Add to popup
        document.getElementById("goals-popup-list").innerHTML += `
            <li class="popup-item" data-id="${goals_id}">
                <span class="goal-text">${goal}</span>
                <select onchange="updateGoalProgress('${goals_id}', this.value)">
                    <option ${progress === "Not Started" ? "selected" : ""}>Not Started</option>
                    <option ${progress === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${progress === "Completed" ? "selected" : ""}>Completed</option>
                </select>
                <button onclick="editGoal('${goals_id}', '${goal}', '${progress}')">Edit</button>
                <button onclick="confirmDeleteGoal('${goals_id}')">Delete</button>
            </li>
        `;

        closeAddGoal();
    });
}


// ===============================
// EDIT GOAL
// ===============================

function editGoal(goals_id, goal, progress) {
    document.getElementById("edit_goal_id").value = goals_id;
    document.getElementById("edit_goal_text").value = goal;
    document.getElementById("edit_goal_progress").value = progress;

    document.getElementById("goalEditBox").style.display = "block";
}

function closeGoalEdit() {
    document.getElementById("goalEditBox").style.display = "none";
}

function saveGoalEdit() {
    const id = document.getElementById("edit_goal_id").value;
    const goal = document.getElementById("edit_goal_text").value;
    const progress = document.getElementById("edit_goal_progress").value;

    fetch("/save_goal", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goals_id=${id}&goal=${goal}&progress_goal=${progress}`
    }).then(() => {

        // Update homepage
        const homeItem = document.querySelector(`li[data-id="${id}"]`);
        homeItem.querySelector(".goal-text").innerText = goal;
        homeItem.querySelector(".progress").innerText = progress;

        // Update popup
        const popupItem = document.querySelector(`#goals-popup-list li[data-id="${id}"]`);
        popupItem.querySelector(".goal-text").innerText = goal;
        popupItem.querySelector("select").value = progress;

        closeGoalEdit();
    });
}


// ===============================
// UPDATE PROGRESS
// ===============================

function updateGoalProgress(goals_id, progress) {
    fetch("/save_goal", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `goals_id=${goals_id}&progress_goal=${progress}`
    }).then(() => {
        const homeItem = document.querySelector(`li[data-id="${goals_id}"]`);
        homeItem.querySelector(".progress").innerText = progress;
    });
}


// ===============================
// DELETE GOAL
// ===============================

let deleteGoalId = null;

function confirmDeleteGoal(goals_id) {
    deleteGoalId = goals_id;
    document.getElementById("deleteConfirm").style.display = "flex";
}

function closeDeleteConfirm() {
    document.getElementById("deleteConfirm").style.display = "none";
}

document.getElementById("deleteYes").onclick = function () {
    fetch(`/delete_goal/${deleteGoalId}`)
        .then(() => {
            document.querySelector(`li[data-id="${deleteGoalId}"]`).remove();
            document.querySelector(`#goals-popup-list li[data-id="${deleteGoalId}"]`).remove();
            closeDeleteConfirm();
        });
};
