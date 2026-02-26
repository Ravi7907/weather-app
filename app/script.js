async function getWeather() {
  // Get what the user typed
  const city = document.getElementById('cityInput').value.trim();
  
  // Get references to the HTML elements
  const card = document.getElementById('weatherCard');
  const errorMsg = document.getElementById('errorMsg');

  // Hide previous results
  card.classList.add('hidden');
  errorMsg.classList.add('hidden');

  // If user typed nothing, stop
  if (!city) {
    errorMsg.textContent = '⚠️ Please enter a city name.';
    errorMsg.classList.remove('hidden');
    return;
  }

  try {
    // Call our backend server's API
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    // If error from server
    if (!response.ok) {
      throw new Error(data.error);
    }

    // Fill in the weather card with data
    document.getElementById('cityName').textContent = 
      `${data.name}, ${data.sys.country}`;
    
    document.getElementById('weatherIcon').src = 
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    document.getElementById('temp').textContent = 
      `${Math.round(data.main.temp)}°C`;
    
    document.getElementById('description').textContent = 
      data.weather[0].description;
    
    document.getElementById('humidity').textContent = 
      `💧 Humidity: ${data.main.humidity}%`;
    
    document.getElementById('wind').textContent = 
      `💨 Wind: ${data.wind.speed} m/s`;
    
    document.getElementById('feelsLike').textContent = 
      `🌡️ Feels like: ${Math.round(data.main.feels_like)}°C`;

    // Show the card
    card.classList.remove('hidden');

  } catch (error) {
    // Show error message
    errorMsg.textContent = `❌ ${error.message}`;
    errorMsg.classList.remove('hidden');
  }
}

// Allow pressing Enter key to search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') getWeather();
});