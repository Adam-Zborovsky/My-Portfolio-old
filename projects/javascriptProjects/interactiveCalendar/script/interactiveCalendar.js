const currentMonthElement = document.getElementById("current-month");
const datesGrid = document.getElementById("dates-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const eventWindow = document.getElementById("event-window");
const closeWindow = document.getElementById("close-window");
const calendarContainer = document.getElementById("calendar-container");
const eventWindowTitle = document.getElementById("event-window-title");
const eventList = document.getElementById("event-list");
const eventInput = document.getElementById("event-input");
const addEventButton = document.getElementById("add-event-btn");
const deleteEventButton = document.getElementById("delete-event-btn");

let currentDate = new Date();
let events = {}; // Stores events

// Seasonal Colors
function applySeasonalColors(month) {
    const root = document.documentElement;

    if ([11, 0, 1].includes(month)) {
        root.style.setProperty("--bg-color", "#cce7ff");
        root.style.setProperty("--calendar-color", "#4a6fa5");
        root.style.setProperty("--hover-color", "#5a7ea5");
        root.style.setProperty("--hover-effect", "#3e5880");
    } else if ([2, 3, 4].includes(month)) {
        root.style.setProperty("--bg-color", "#d4f0c2");
        root.style.setProperty("--calendar-color", "#6ca870");
        root.style.setProperty("--hover-color", "#81c784");
        root.style.setProperty("--hover-effect", "#558b2f");
    } else if ([5, 6, 7].includes(month)) {
        root.style.setProperty("--bg-color", "#ffe8a1");
        root.style.setProperty("--calendar-color", "#ffc107");
        root.style.setProperty("--hover-color", "#ffca28");
        root.style.setProperty("--hover-effect", "#ffa000");
    } else {
        root.style.setProperty("--bg-color", "#f0c987");
        root.style.setProperty("--calendar-color", "#d35400");
        root.style.setProperty("--hover-color", "#e67e22");
        root.style.setProperty("--hover-effect", "#a04000");
    }
}

// Render Calendar
function renderCalendar(date) {
    datesGrid.innerHTML = "";
    currentMonthElement.textContent = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const totalDays = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    for (let i = 0; i < firstDay; i++) {
        datesGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDays; day++) {
        const dateCell = document.createElement("div");
        dateCell.textContent = day;
        dateCell.classList.add("date");

        const today = new Date(); // Fetch today's date dynamically

        if (
            day === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            dateCell.classList.add("today");
        }

        dateCell.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent this click from triggering the background close
            openEventWindow(date.getFullYear(), date.getMonth(), day);
        });
        datesGrid.appendChild(dateCell);
    }

    applySeasonalColors(date.getMonth());
}

// Open Event Window
function openEventWindow(year, month, day) {
    closeEventWindow(); // Close the window before reopening
    const formattedDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
    )}-${String(day).padStart(2, "0")}`;
    eventWindow.classList.remove("hidden");
    eventWindowTitle.textContent = `Events: ${formattedDate}`;
    populateEventList(formattedDate);
    addEventButton.onclick = () => addEvent(formattedDate);
    deleteEventButton.onclick = () => deleteEvents(formattedDate);
}

// Close Event Window
function closeEventWindow() {
    eventWindow.classList.add("hidden");
    eventList.innerHTML = ""; // Clear the list when closing
}

// Populate Event List
function populateEventList(date) {
    eventList.innerHTML = ""; // Clear old list
    const eventArray = events[date] || [];
    if (eventArray.length === 0) {
        eventList.innerHTML =
            "<p style = 'color:var(--bg-color)'>No events for this date.</p>";
    } else {
        eventArray.forEach((event, index) => {
            const listItem = document.createElement("p");
            listItem.style.color = "var(--bg-color)";
            listItem.textContent = `${index + 1}. ${event}`;
            eventList.appendChild(listItem);
        });
    }
}

// Add Event
function addEvent(date) {
    const newEvent = eventInput.value.trim();
    if (newEvent) {
        if (!events[date]) events[date] = [];
        events[date].push(newEvent);
        eventInput.value = ""; // Clear input
        populateEventList(date);
        console.log("Updated Events:", JSON.stringify(events, null, 2));
    }
}

// Delete All Events
function deleteEvents(date) {
    if (confirm("Are you sure you want to delete all events for this date?")) {
        delete events[date];
        populateEventList(date);
        console.log("Updated Events:", JSON.stringify(events, null, 2));
    }
}

// Close the event window when clicking outside it or on the background
document.addEventListener("click", (e) => {
    const isClickInsideWindow =
        eventWindow.contains(e.target) || calendarContainer.contains(e.target);
    if (!isClickInsideWindow) {
        closeEventWindow();
    }
});

// Close window when the close button is clicked
closeWindow.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent background click close
    closeEventWindow();
});

// Navigation Buttons
prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate);
}

// Initial Render
renderCalendar(currentDate);
