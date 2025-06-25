/**
 * Weather Dashboard App
 * Features:
 * - Current weather display
 * - 5-day forecast
 * - Geolocation support
 * - Responsive design
 */

const API_KEY = '687485225c2cccbbe9012153aca07d9e'; // Replace with your OpenWeatherMap API key
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const elements = {
  cityInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),
  locationBtn: document.getElementById('location-btn'),
  currentWeather: document.getElementById('current-weather'),
  forecast: document.getElementById('forecast'),
  loading: document.getElementById('loading'),
  errorMessage: document.getElementById('error-message'),
  cityName: document.getElementById('city-name'),
  weatherIcon: document.getElementById('weather-icon'),
  temperature: document.getElementById('temperature'),
  condition: document.getElementById('condition'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  forecastContainer: document.getElementById('forecast-container')
};

// Event Listeners
elements.searchBtn.addEventListener('click', getWeatherByCity);
elements.locationBtn.addEventListener('click', getWeatherByLocation);
elements.cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeatherByCity();
});

// Load last searched city on page load
window.addEventListener('DOMContentLoaded', () => {
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    elements.cityInput.value = lastCity;
    getWeatherByCity();
  }
});
async function getApproximateLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city
    };
  } catch (error) {
    throw new Error("Could not determine your location");
  }
}

// Usage:
const location = await getApproximateLocation();
const currentData = await fetchWeatherByCoords(location.latitude, location.longitude);
/**
 * Main function to get weather by city name
 */
async function getWeatherByCity() {
  const city = elements.cityInput.value.trim();
  
  if (!city) {
    showError('Please enter a city name');
    return;
  }
  
  showLoading();
  clearError();
  
  try {
    const currentData = await fetchWeather(city);
    const forecastData = await fetchForecast(city);
    
    displayCurrentWeather(currentData);
    displayForecast(forecastData);
    
    // Save to localStorage
    localStorage.setItem('lastCity', city);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

/**
 * Get weather by user's geolocation
 */
function getWeatherByLocation() {
  showLoading();
  clearError();
  
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser');
    hideLoading();
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const currentData = await fetchWeatherByCoords(latitude, longitude);
        const forecastData = await fetchForecastByCoords(latitude, longitude);
        
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        // Update input field
        elements.cityInput.value = currentData.name;
        localStorage.setItem('lastCity', currentData.name);
      } catch (error) {
        showError(error.message);
      } finally {
        hideLoading();
      }
    },
    (error) => {
      showError('Unable to retrieve your location. Please enable location permissions.');
      hideLoading();
    }
  );
}

/**
 * Fetch current weather data by city name
 */
async function fetchWeather(city) {
  const response = await fetch(`${CURRENT_WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  return handleResponse(response);
}

/**
 * Fetch forecast data by city name
 */
async function fetchForecast(city) {
  const response = await fetch(`${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  return handleResponse(response);
}

/**
 * Fetch current weather data by coordinates
 */
async function fetchWeatherByCoords(lat, lon) {
  const response = await fetch(`${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  return handleResponse(response);
}

/**
 * Fetch forecast data by coordinates
 */
async function fetchForecastByCoords(lat, lon) {
  const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  return handleResponse(response);
}
