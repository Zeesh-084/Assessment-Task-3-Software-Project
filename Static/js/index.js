function openGoalsPopup(){
    document.getElementById("goalsPopup").style.display = "flex";
}

function closeGoalsPopup(){
    document.getElementById("goalsPopup").style.display = "none";
}

function openTasksPopup(){
    document.getElementById("tasksPopup").style.display = "flex";
}

function closeTasksPopup(){
    document.getElementById("tasksPopup").style.display = "none";
}

window.onclick = function(event){

    let goalsPopup =
        document.getElementById("goalsPopup");

    let tasksPopup =
        document.getElementById("tasksPopup");

    if(event.target === goalsPopup){
        closeGoalsPopup();
    }

    if(event.target === tasksPopup){
        closeTasksPopup();
    }
}


