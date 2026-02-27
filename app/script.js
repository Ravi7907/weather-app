// ========================
//  SKYCAST — Weather App
// ========================

// Update clock every second
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('currentTime');
  const dateEl = document.getElementById('currentDate');
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
setInterval(updateClock, 1000);
updateClock();

// Quick search (city pills)
function quickSearch(city) {
  document.getElementById('cityInput').value = city;
  getWeather();
}

// Format Unix timestamp to time string
function formatTime(unix, timezone) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

// Weather mood messages
function getMoodMessage(weatherMain, temp) {
  const conditions = {
    Clear: temp > 25
      ? "☀️ Beautiful sunny day — perfect for going outside!"
      : "🌤️ Clear skies ahead. A refreshing day awaits.",
    Clouds: "☁️ Overcast but calm. A great day to stay cozy indoors.",
    Rain: "🌧️ Don't forget your umbrella today!",
    Drizzle: "🌦️ Light drizzle in the air — carry a light jacket.",
    Thunderstorm: "⛈️ Stay safe indoors — thunderstorms are active!",
    Snow: "❄️ It's snowing! Bundle up and enjoy the winter magic.",
    Mist: "🌫️ Low visibility today. Drive carefully!",
    Fog: "🌁 Foggy conditions — take it slow out there.",
    Haze: "😶‍🌫️ Hazy skies. Consider wearing a mask outdoors.",
    Smoke: "🔥 Smoky conditions detected. Stay indoors if possible.",
    Dust: "🌪️ Dusty winds are blowing. Protect your eyes!",
    Sand: "🏜️ Sandy conditions — it's a bit of a desert out there!",
    Ash: "🌋 Volcanic ash in the air. Stay safe!",
    Squall: "💨 Sudden squalls! Secure loose objects outside.",
    Tornado: "🌪️ TORNADO WARNING! Seek shelter immediately!",
  };
  return conditions[weatherMain] || "🌍 Stay aware of local weather conditions.";
}

// Dynamic background gradient based on weather
function setBackgroundMood(weatherMain, temp) {
  const body = document.querySelector('.bg-layer');
  let gradient = '';

  if (weatherMain === 'Clear') {
    gradient = temp > 25
      ? 'radial-gradient(ellipse at 30% 40%, rgba(255,140,0,0.12), transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(0,229,255,0.08), transparent 50%)'
      : 'radial-gradient(ellipse at 20% 50%, rgba(0,100,160,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.08), transparent 50%)';
  } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    gradient = 'radial-gradient(ellipse at 50% 30%, rgba(30,80,150,0.2), transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(0,50,100,0.15), transparent 50%)';
  } else if (weatherMain === 'Thunderstorm') {
    gradient = 'radial-gradient(ellipse at 50% 20%, rgba(100,0,180,0.2), transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(50,0,80,0.15), transparent 50%)';
  } else if (weatherMain === 'Snow') {
    gradient = 'radial-gradient(ellipse at 50% 30%, rgba(180,220,255,0.12), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(200,230,255,0.1), transparent 50%)';
  } else {
    gradient = 'radial-gradient(ellipse at 20% 50%, rgba(0,100,160,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.08), transparent 50%)';
  }

  body.style.background = gradient;
}

// Main weather fetch function
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const card = document.getElementById('weatherCard');
  const errorMsg = document.getElementById('errorMsg');
  const loader = document.getElementById('loader');

  // Hide previous results
  card.classList.add('hidden');
  errorMsg.classList.add('hidden');

  if (!city) {
    document.getElementById('errorText').textContent = 'Please enter a city name.';
    errorMsg.classList.remove('hidden');
    return;
  }

  // Show loader
  loader.classList.remove('hidden');

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    loader.classList.add('hidden');

    if (!response.ok) throw new Error(data.error);

    // --- Fill in all the data ---

    // City & Country
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('countryName').textContent = `📍 ${data.sys.country}`;

    // Temperature
    document.getElementById('tempValue').textContent = Math.round(data.main.temp);

    // Weather Icon & Description
    document.getElementById('weatherIcon').src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('description').textContent = data.weather[0].description;

    // Stats
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('clouds').textContent = `${data.clouds.all}%`;

    // Sunrise & Sunset
    const sunriseTime = formatTime(data.sys.sunrise, data.timezone);
    const sunsetTime = formatTime(data.sys.sunset, data.timezone);
    document.getElementById('sunrise').textContent = sunriseTime;
    document.getElementById('sunset').textContent = sunsetTime;

    // Sun progress bar
    const now = Math.floor(Date.now() / 1000);
    const totalDay = data.sys.sunset - data.sys.sunrise;
    const elapsed = now - data.sys.sunrise;
    const progressPercent = Math.min(Math.max((elapsed / totalDay) * 100, 0), 100);
    document.getElementById('sunProgress').style.width = `${progressPercent}%`;
    document.getElementById('sunDot').style.left = `${progressPercent}%`;

    // Mood banner
    const mood = getMoodMessage(data.weather[0].main, data.main.temp);
    document.getElementById('moodText').textContent = mood;

    // Background mood
    setBackgroundMood(data.weather[0].main, data.main.temp);

    // Show card with animation
    card.classList.remove('hidden');
    card.style.animation = 'none';
    card.offsetHeight; // Reflow trick to restart animation
    card.style.animation = '';

  } catch (error) {
    loader.classList.add('hidden');
    document.getElementById('errorText').textContent = `❌ ${error.message}`;
    errorMsg.classList.remove('hidden');
  }
}

// Enter key support
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') getWeather();
});