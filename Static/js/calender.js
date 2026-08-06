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

        // Check if event exists on this day
        const dateStr = `${year}-${month + 1}-${day}`;
        const event = events.find(e => e.event_date === dateStr);

        if (event) {
            const dot = document.createElement("div");
            dot.classList.add("event-dot");
            cell.appendChild(dot);

            cell.title = event.event_detail;
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
