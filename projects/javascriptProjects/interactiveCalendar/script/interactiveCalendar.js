// DOM Elements
const currentMonthElement = document.getElementById("current-month");
const datesGrid = document.getElementById("dates-grid");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const body = document.body; // Reference to the body for background color

// State Variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let events = {}; // Object to hold events, populated from JSON

// Utility Functions
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
    ).padStart(2, "0")}`;
}

// Apply Seasonal Theme
function applySeasonalTheme(month) {
    const seasons = [
        { name: "Winter", colors: ["#e3f2fd", "#90caf9", "#64b5f6"] },
        { name: "Spring", colors: ["#f1f8e9", "#a5d6a7", "#66bb6a"] },
        { name: "Summer", colors: ["#fff3e0", "#ffcc80", "#ffa726"] },
        { name: "Autumn", colors: ["#efebe9", "#bcaaa4", "#8d6e63"] },
    ];

    let season;
    if (month >= 2 && month <= 4) {
        season = seasons[1]; // Spring
    } else if (month >= 5 && month <= 7) {
        season = seasons[2]; // Summer
    } else if (month >= 8 && month <= 10) {
        season = seasons[3]; // Autumn
    } else {
        season = seasons[0]; // Winter
    }

    // Apply colors
    body.style.background = `linear-gradient(to bottom, ${season.colors[0]}, ${season.colors[1]})`;
    document.querySelector(".calendar-container").style.background =
        season.colors[2];
    document.querySelector(".calendar-header").style.background =
        season.colors[1];
    document.querySelector(".calendar-header").style.color = "#ffffff";

    // Change button styles
    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach((button) => {
        button.style.background = season.colors[1];
        button.style.color = "#ffffff";
    });
}

// Render Calendar
function renderCalendar(year, month) {
    // Apply seasonal theme
    applySeasonalTheme(month);

    // Clear previous grid
    datesGrid.innerHTML = "";

    // Set the current month title
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    // Get month details
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    // Add empty grid cells for alignment
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        datesGrid.appendChild(emptyCell);
    }

    // Add date cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement("div");
        dateCell.textContent = day;
        dateCell.classList.add("date");

        // Highlight today's date
        if (
            day === currentDate.getDate() &&
            month === currentDate.getMonth() &&
            year === currentDate.getFullYear()
        ) {
            dateCell.classList.add("today");
        }

        // Add event marker if events exist
        const formattedDate = formatDate(year, month, day);
        if (events[formattedDate]) {
            const eventMarker = document.createElement("div");
            eventMarker.classList.add("event-marker");
            dateCell.appendChild(eventMarker);
        }

        // Event listener for date click
        dateCell.addEventListener("click", () => {
            handleDateClick(formattedDate);
        });

        datesGrid.appendChild(dateCell);
    }
}

// Handle Date Click
// Event Window Elements
const eventWindow = document.getElementById("event-window");
const closeWindowBtn = document.getElementById("close-window");
const eventWindowTitle = document.getElementById("event-window-title");
const eventList = document.getElementById("event-list");
const eventInput = document.getElementById("event-input");
const addEventButton = document.getElementById("add-event-btn");
const deleteEventButton = document.getElementById("delete-event-btn");
const calendarContainer = document.querySelector(".calendar-container");

// Current date reference
let selectedDate = "";

// Open Event Window
function openEventWindow(date) {
    selectedDate = date;
    eventWindowTitle.textContent = `Events for ${date}`;
    eventInput.value = "";
    populateEventList();

    // Adjust positions
    eventWindow.classList.remove("hidden");
    calendarContainer.style.transform = "translateX(-150px)";
}

// Close Event Window
closeWindowBtn.addEventListener("click", () => {
    eventWindow.classList.add("hidden");
    calendarContainer.style.transform = "translateX(0)";
});

// Populate Event List
function populateEventList() {
    eventList.innerHTML = "";
    const eventsForDate = events[selectedDate] || [];
    if (eventsForDate.length === 0) {
        eventList.innerHTML = "<p>No events</p>";
        return;
    }
    eventsForDate.forEach((event, index) => {
        const eventItem = document.createElement("p");
        eventItem.textContent = `${index + 1}. ${event}`;
        eventList.appendChild(eventItem);
    });
}

// Handle Add Event
addEventButton.addEventListener("click", () => {
    const newEvent = eventInput.value.trim();
    if (!newEvent) return;
    if (!events[selectedDate]) events[selectedDate] = [];
    events[selectedDate].push(newEvent);
    populateEventList();
    eventInput.value = "";
});

// Delete All Events
deleteEventButton.addEventListener("click", () => {
    if (confirm("Delete all events for this date?")) {
        delete events[selectedDate];
        populateEventList();
    }
});

// Handle Date Click
function handleDateClick(date) {
    openEventWindow(date);
}

// Navigation
function goToPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

function goToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

// Event Listeners
prevMonthButton.addEventListener("click", goToPreviousMonth);
nextMonthButton.addEventListener("click", goToNextMonth);

// Initialize
renderCalendar(currentYear, currentMonth);
