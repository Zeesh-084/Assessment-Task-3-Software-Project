let currentDate = new Date();

function loadCalendar(events) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("calendar-month").innerText =
        currentDate.toLocaleString("default", { month: "long", year: "numeric" });

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

        const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        const dayEvents = events.filter(e => e.event_date === dateStr);

        if (dayEvents.length > 0) {
            const dot = document.createElement("div");
            dot.classList.add("event-dot");
            cell.appendChild(dot);

            cell.title = dayEvents.map(e => e.event_detail).join("\n");
        }

        row.appendChild(cell);
    }

    body.appendChild(row);
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar(window.eventsData);
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar(window.eventsData);
}

function openEventPopup() {
    document.getElementById("eventPopup").style.display = "block";
}

function closeEventPopup() {
    document.getElementById("eventPopup").style.display = "none";
}

window.onload = () => {
    window.eventsData = JSON.parse(document.getElementById("events-json").textContent);
    loadCalendar(window.eventsData);
};

function openEditEventPopup(eventId) {
    const event = window.eventsData.find(e => e.event_id === eventId);

    document.getElementById("edit_event_id").value = event.event_id;
    document.getElementById("edit_event_detail").value = event.event_detail;
    document.getElementById("edit_event_date").value = event.event_date;
    document.getElementById("edit_event_time").value = event.event_time;
    document.getElementById("edit_event_repeat").value = event.event_repeat;
    document.getElementById("edit_event_deadline").value = event.event_deadline;

    document.getElementById("editEventPopup").style.display = "block";
}

function closeEditEventPopup() {
    document.getElementById("editEventPopup").style.display = "none";
}

function deleteEvent() {
    const id = document.getElementById("edit_event_id").value;

    fetch(`/delete_event/${id}`, {
        method: "POST"
    }).then(() => {
        window.location.reload();
    });
}
