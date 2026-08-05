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