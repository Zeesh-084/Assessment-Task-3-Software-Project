let currentDate = new Date();

/* ------------------ MAIN CALENDAR RENDER ------------------ */

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

        const cellDate = new Date(year, month, day);

        const dayEvents = events.filter(e => {
            const [y, m, d] = e.event_deadline.split("-");
            const eventDate = new Date(Number(y), Number(m) - 1, Number(d));

            const repeat = (e.event_repeat || "").toLowerCase();

            // NON-REPEAT
            if (!repeat.includes("daily") && !repeat.includes("weekly")) {
                return eventDate.getTime() === cellDate.getTime();
            }

            // DAILY
            if (repeat.includes("daily")) {
                return (
                    cellDate >= eventDate &&
                    cellDate.getMonth() === currentDate.getMonth() &&
                    cellDate.getFullYear() === currentDate.getFullYear()
                );
            }

            // WEEKLY
            if (repeat.includes("weekly")) {
                return (
                    cellDate >= eventDate &&
                    cellDate.getDay() === eventDate.getDay() &&
                    cellDate.getMonth() === currentDate.getMonth() &&
                    cellDate.getFullYear() === currentDate.getFullYear()
                );
            }

            return false;
        });

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
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar(window.eventsData);
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar(window.eventsData);
}

/* ------------------ POPUPS ------------------ */

function openEventPopup() {
    document.getElementById("eventPopup").style.display = "block";
}

function closeEventPopup() {
    document.getElementById("eventPopup").style.display = "none";
}

function openEditEventPopup(eventId) {
    const event = window.eventsData.find(e => e.event_id === eventId);
    if (!event) return;

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

/* ------------------ DELETE EVENT ------------------ */

function deleteEvent() {
    const id = document.getElementById("edit_event_id").value;
    if (!id) return;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    fetch(`/delete_event/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrfToken
        },
        body: ""
    })
    .then(res => {
        if (res.ok) window.location.reload();
        else alert("Error deleting event.");
    })
    .catch(() => alert("Error deleting event."));
}

/* ------------------ INITIAL LOAD ------------------ */

window.onload = () => {
    window.eventsData = JSON.parse(document.getElementById("events-json").textContent);
    loadCalendar(window.eventsData);
};
