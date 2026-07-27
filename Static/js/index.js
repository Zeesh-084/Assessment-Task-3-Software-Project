const modal = document.getElementById("goalModal");

document.getElementById("editGoals").onclick = () => {

    modal.style.display = "flex";

}

window.onclick = function(e){

    if(e.target===modal){

        modal.style.display="none";

    }

}
function addGoal(){
    let container=document.getElementById("goalContainer");
    let row=document.createElement("div");
    row.className="goal-row";
    row.innerHTML=`
        <input type="text" name="goal[]">
        <select name="progress[]">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Finished</option>
        </select>
        <button>Delete</button>
    `;
    container.appendChild(row);

}