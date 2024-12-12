const apiKey = "6548b0d7785fa283abc16dab466327c2"; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const locationDisplay = document.getElementById("location");
const temperatureDisplay = document.getElementById("temperature");
const descriptionDisplay = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const weatherEffects = document.querySelector(".weather-effects");

// Fetch coordinates
async function getCoordinates(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    return data[0] || null;
}

// Fetch weather
async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(weatherUrl);
    return response.json();
}

// Update UI
function updateWeather(data) {
    const { name, sys, main, weather } = data;
    const weatherType = weather[0].main.toLowerCase();

    locationDisplay.textContent = `${name}, ${sys.country}`;
    temperatureDisplay.textContent = `${Math.round(main.temp)}°C`;
    descriptionDisplay.textContent = weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    document.body.className = weatherType.includes("sun")
        ? "sunny"
        : weatherType.includes("cloud")
            ? "cloudy"
            : weatherType.includes("rain")
                ? "rainy"
                : weatherType.includes("snow")
                    ? "snowy"
                    : "";
}

// Search functionality
searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city name.");

    const coordinates = await getCoordinates(city);
    if (!coordinates) return alert("City not found. Try another search.");

    const weather = await fetchWeather(coordinates.lat, coordinates.lon);
    updateWeather(weather);
});
