// Your public API key from OpenWeatherMap
const apiKey = 'b6907d289e10d714a6e88b30761fae22';  // This is a demo key, replace with your own

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDetails = document.getElementById('weatherDetails');
const forecastContainer = document.getElementById('forecast');
const errorContainer = document.getElementById('error');
const toggleUnitBtn = document.getElementById('toggleUnit');
const body = document.body;
const weatherIcon = document.getElementById('weatherIcon');

let unit = 'metric'; // default unit

// Function to fetch weather details
const getWeatherData = async (city) => {
  try {
    const currentWeatherResponse = await fetch(
      `https://openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
    );
    if (!currentWeatherResponse.ok) {
      throw new Error('City not found');
    }
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(
      `https://openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
    );
    const forecastData = await forecastResponse.json();

    displayWeather(currentWeatherData, forecastData);
    weatherDetails.style.display = 'block';
    errorContainer.style.display = 'none';
    updateBackground(currentWeatherData.weather[0].main);  // Change background image
  } catch (error) {
    showError(error.message);
  }
};

// Function to display current weather and forecast
const displayWeather = (currentWeatherData, forecastData) => {
  const cityName = document.getElementById('cityName');
  const description = document.getElementById('description');
  const tempValue = document.getElementById('tempValue');
  const minTemp = document.getElementById('minTemp');
  const maxTemp = document.getElementById('maxTemp');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('windSpeed');
  const windDir = document.getElementById('windDir');

  cityName.textContent = currentWeatherData.name;
  description.textContent = currentWeatherData.weather[0].description;
  tempValue.textContent = Math.round(currentWeatherData.main.temp);
  minTemp.textContent = Math.round(currentWeatherData.main.temp_min);
  maxTemp.textContent = Math.round(currentWeatherData.main.temp_max);
  humidity.textContent = currentWeatherData.main.humidity;
  windSpeed.textContent = currentWeatherData.wind.speed;
  windDir.textContent = currentWeatherData.wind.deg;

  weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`;

  forecastContainer.innerHTML = ''; // Clear the previous forecast

  // Loop through the forecast data and display it
  forecastData.list.slice(0, 5).forEach((day) => {
    const forecastDay = document.createElement('div');
    forecastDay.className = 'forecast-day';
    forecastDay.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
      <p>${Math.round(day.main.temp)}°</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(forecastDay);
  });
};

// Function to change the background based on the weather condition
const updateBackground = (weatherCondition) => {
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      body.style.backgroundImage = 'url("https://example.com/clear-sky.jpg")';
      break;
    case 'clouds':
      body.style.backgroundImage = 'url("https://example.com/cloudy.jpg")';
      break;
    case 'rain':
      body.style.backgroundImage = 'url("https://example.com/rainy.jpg")';
      break;
    case 'snow':
      body.style.backgroundImage = 'url("https://example.com/snowy.jpg")';
      break;
    default:
      body.style.backgroundImage = 'url("https://example.com/default-weather.jpg")';
      break;
  }
};

// Function to handle errors
const showError = (message) => {
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  weatherDetails.style.display = 'none';
};

// Event listener for the search button
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  } else {
    showError('Please enter a city name');
  }
});

// Event listener for the unit toggle button
toggleUnitBtn.addEventListener('click', () => {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  toggleUnitBtn.textContent = `Switch to °${unit === 'metric' ? 'F' : 'C'}`;
  
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);  // Fetch the weather data again with the new unit
  }
});
