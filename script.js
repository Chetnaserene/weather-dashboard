/**
 * script.js
 * Handles user input, fetching data from OpenWeatherMap API, and updating the UI.
 */

const API_KEY = 'YOUR_API_KEY'; // TODO: Replace with your OpenWeatherMap API key
const ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('search-btn').addEventListener('click', getWeatherOnClick);

/**
 * Main entry: get weather when button is clicked
 */
function getWeatherOnClick() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }
  fetchWeather(city);
}

/**
 * Fetch weather data from API, update UI accordingly
 * @param {string} city
 */
async function fetchWeather(city) {
  try {
    const url = `${ENDPOINT}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.cod === '404') {
      handleError('City not found. Please try again.');
      return;
    }

    updateUI(data);
    localStorage.setItem('lastCity', city);
  } catch (err) {
    console.error(err);
    handleError('Unable to fetch data. Check your internet or try again later.');
  }
}

/**
 * Display retrieved weather data on the page
 * @param {object} data - JSON object from API
 */
function updateUI(data) {
  document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
  document.getElementById('condition').textContent = `Condition: ${data.weather[0].description}`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = `Wind: ${data.wind.speed} km/h`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  document.getElementById('weather-info').classList.remove('hidden');
}

/**
 * Show error alert and hide weather info section
 * @param {string} msg - error message
 */
function handleError(msg) {
  alert(msg);
  document.getElementById('weather-info').classList.add('hidden');
}

/**
 * Auto-load last searched city when the page loads
 */
window.addEventListener('DOMContentLoaded', () => {
  const last = localStorage.getItem('lastCity');
  if (last) fetchWeather(last);
});
