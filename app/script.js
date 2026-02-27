// ═══════════════════════════════════════
//  SKYCAST — Complete Weather Script
// ═══════════════════════════════════════

// ── State ──────────────────────────────
let hourFormat = 24;
let currentTheme = 'auto';
let hourlyChart = null;
let forecastData = null;
let currentWeatherData = null;
let factIndex = 0;
let localTimeInterval = null;

// ── Weather Facts ───────────────────────
const weatherFacts = [
  "Lightning strikes Earth about 100 times per second — that's 8.6 million times a day!",
  "A single hurricane can release the same energy as 10,000 nuclear bombs.",
  "The fastest wind speed ever recorded was 407 km/h during Tropical Cyclone Olivia in 1996.",
  "Antarctica is the world's largest desert, receiving less than 200mm of precipitation a year.",
  "The weight of a cloud can be over 500,000 kg — yet it floats due to tiny droplet size.",
  "Snow is not white — it's actually translucent! The reflection of light makes it appear white.",
  "The average cumulus cloud weighs about 500 tonnes.",
  "Thundersnow is real — it's a snowstorm with lightning and thunder embedded within it.",
  "The highest temperature ever recorded was 56.7°C in Furnace Creek, California in 1913.",
  "Raindrops are not teardrop-shaped. They're actually shaped like hamburger buns!",
  "A bolt of lightning is about 5 times hotter than the surface of the sun.",
  "Fog is essentially a cloud that forms at ground level.",
  "The average snowflake falls at about 5 km/h.",
  "Ball lightning is a rare phenomenon — floating orbs of light during thunderstorms.",
];

function nextFact() {
  factIndex = (factIndex + 1) % weatherFacts.length;
  const el = document.getElementById('factText');
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = weatherFacts[factIndex];
    el.style.opacity = 1;
    el.style.transition = 'opacity 0.4s';
  }, 200);
}

// ── Moon Phase ─────────────────────────
function getMoonPhase(date) {
  const phases = [
    { icon: '🌑', name: 'New Moon', detail: 'Illumination: 0%' },
    { icon: '🌒', name: 'Waxing Crescent', detail: 'Illumination: ~25%' },
    { icon: '🌓', name: 'First Quarter', detail: 'Illumination: 50%' },
    { icon: '🌔', name: 'Waxing Gibbous', detail: 'Illumination: ~75%' },
    { icon: '🌕', name: 'Full Moon', detail: 'Illumination: 100%' },
    { icon: '🌖', name: 'Waning Gibbous', detail: 'Illumination: ~75%' },
    { icon: '🌗', name: 'Last Quarter', detail: 'Illumination: 50%' },
    { icon: '🌘', name: 'Waning Crescent', detail: 'Illumination: ~25%' },
  ];
  const known = new Date(2000, 0, 6).getTime();
  const diff = date.getTime() - known;
  const days = diff / (1000 * 60 * 60 * 24);
  const cycle = 29.53;
  const phase = ((days % cycle) + cycle) % cycle;
  const idx = Math.floor((phase / cycle) * 8);
  return phases[idx % 8];
}

// ── Outfit Advisor ──────────────────────
function getOutfitAdvice(temp, weather, wind) {
  if (weather.includes('rain') || weather.includes('drizzle')) {
    return { icon: '☂️', text: 'Waterproof jacket and rain boots. Keep that umbrella handy!', badge: 'RAINY DAY' };
  } else if (weather.includes('snow')) {
    return { icon: '🧥', text: 'Heavy winter coat, gloves, scarf and waterproof boots. Layer up!', badge: 'WINTER MODE' };
  } else if (weather.includes('thunderstorm')) {
    return { icon: '⛈️', text: 'Stay indoors if possible. If going out, full waterproof gear.', badge: 'STORM ALERT' };
  } else if (temp >= 35) {
    return { icon: '👙', text: 'Light, breathable fabrics. Stay hydrated and use sunscreen SPF 50+', badge: 'HEAT MODE' };
  } else if (temp >= 25) {
    return { icon: '👕', text: 'T-shirt and shorts weather! Light layers for the evening.', badge: 'PERFECT' };
  } else if (temp >= 15) {
    return { icon: '🧣', text: 'Light jacket or hoodie. Comfortable jeans and sneakers.', badge: 'COMFY' };
  } else if (temp >= 5) {
    return { icon: '🧤', text: 'Warm jacket, layers underneath. Don\'t forget gloves if windy!', badge: 'BUNDLE UP' };
  } else {
    return { icon: '🥶', text: 'Heavy coat, thermal layers, hat, gloves and warm boots essential.', badge: 'VERY COLD' };
  }
}

// ── Weather Story ───────────────────────
function getWeatherStory(data) {
  const temp = Math.round(data.main.temp);
  const weather = data.weather[0].main;
  const city = data.name;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  const stories = {
    Clear: `The skies over ${city} are wide open today at ${temp}°C. With ${humidity}% humidity and ${wind} m/s winds, it's a classic ${temp > 25 ? 'sun-soaked' : 'crisp'} day. Perfect conditions for outdoor adventures.`,
    Clouds: `A blanket of clouds has settled over ${city} today. At ${temp}°C with ${humidity}% humidity, the air feels ${humidity > 70 ? 'heavy and moist' : 'comfortable'}. ${wind > 5 ? 'Breezy conditions are moving the clouds along.' : 'A quiet, overcast kind of day.'}`,
    Rain: `${city} is getting a good soaking today. The temperature sits at ${temp}°C while rain falls steadily. With ${humidity}% humidity in the air, everything feels damp. ${wind > 7 ? 'Gusty winds are making it feel wilder.' : 'A cozy stay-indoors kind of day.'}`,
    Drizzle: `A fine drizzle drifts over ${city} today at ${temp}°C. The air carries ${humidity}% humidity, giving everything a fresh, petrichor scent. Ideal weather for a warm drink and a book.`,
    Thunderstorm: `⚡ Powerful thunderstorms are rolling over ${city}! The temperature stands at ${temp}°C, but the ${wind} m/s winds and heavy rain make it feel intense. Stay sheltered and watch the light show from indoors!`,
    Snow: `❄️ ${city} is wrapped in white today at ${temp}°C. Snow is falling with ${humidity}% relative humidity making it pack nicely. ${wind > 5 ? 'Drifting snow is reducing visibility — drive with care.' : 'A postcard-perfect winter scene.'}`,
    Mist: `A mysterious mist hangs over ${city} this morning at ${temp}°C. Visibility is reduced as water droplets float through the ${humidity}% humid air. The city looks like it's wrapped in a soft filter.`,
  };

  return stories[weather] || `Current conditions in ${city}: ${temp}°C, ${data.weather[0].description}. Wind at ${wind} m/s with ${humidity}% humidity.`;
}

// ── Format Time ─────────────────────────
function fmtTime(unix, tzOffset) {
  const d = new Date((unix + tzOffset) * 1000);
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  if (hourFormat === 12) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m} ${ampm}`;
  }
  return `${String(h).padStart(2, '0')}:${m}`;
}

function fmtLocalTime(tzOffset) {
  const utc = Date.now() / 1000;
  return fmtTime(utc, tzOffset);
}

// ── Wind Direction ──────────────────────
function windDegToDir(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Sun Arc Dot Position ─────────────────
function updateSunArc(sunrise, sunset, tzOffset) {
  const now = Date.now() / 1000;
  const pct = Math.min(Math.max((now - sunrise) / (sunset - sunrise), 0), 1);

  // Parametric point on the arc path: M 15 82 Q 160 -15 305 82
  const t = pct;
  const x = (1-t)*(1-t)*15 + 2*(1-t)*t*160 + t*t*305;
  const y = (1-t)*(1-t)*82 + 2*(1-t)*t*(-15) + t*t*82;

  const dot = document.getElementById('sunDot');
  if (dot) { dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); }

  const pctDisplay = Math.round(pct * 100);
  document.getElementById('dayPct').textContent = `${pctDisplay}% of daylight passed`;
}

// ── Auto Theme by Time ──────────────────
function applyAutoTheme(sunrise, sunset, tzOffset) {
  if (currentTheme !== 'auto') return;
  const now = Date.now() / 1000 + tzOffset;
  const sr = sunrise + tzOffset;
  const ss = sunset + tzOffset;
  const dawn = sr - 3600;
  const golden = ss - 3600;

  let timeOfDay;
  if (now >= dawn && now < sr) timeOfDay = 'dawn';
  else if (now >= sr && now < golden) timeOfDay = 'day';
  else if (now >= golden && now < ss) timeOfDay = 'golden';
  else timeOfDay = 'night';

  document.documentElement.setAttribute('data-time', timeOfDay);

  // Update sky layer
  const sky = document.getElementById('skyLayer');
  const gradients = {
    dawn: 'radial-gradient(ellipse at 20% 60%, rgba(249,115,22,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.08) 0%, transparent 50%)',
    day: 'radial-gradient(ellipse at 20% 40%, rgba(0,100,180,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(0,229,255,0.05) 0%, transparent 50%)',
    golden: 'radial-gradient(ellipse at 30% 50%, rgba(251,146,60,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.08) 0%, transparent 50%)',
    night: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(129,140,248,0.05) 0%, transparent 50%)',
  };
  sky.style.background = gradients[timeOfDay] || gradients.day;

  // Update time phase badge
  const phaseNames = { dawn: '🌄 DAWN', day: '☀️ DAYTIME', golden: '🌅 GOLDEN HOUR', night: '🌙 NIGHT' };
  const phaseEl = document.getElementById('timePhase');
  if (phaseEl) phaseEl.textContent = phaseNames[timeOfDay];

  return timeOfDay;
}

// ── Particle Canvas ─────────────────────
let particles = [];
let particleType = 'none';
let animId = null;

function initParticles(type) {
  particleType = type;
  particles = [];
  const canvas = document.getElementById('particleCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (type === 'rain') {
    for (let i = 0; i < 120; i++) particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 8 + Math.random() * 8,
      len: 15 + Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.25,
    });
  } else if (type === 'snow') {
    for (let i = 0; i < 80; i++) particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 1.5,
      radius: 2 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 0.8,
      opacity: 0.4 + Math.random() * 0.4,
    });
  } else if (type === 'stars') {
    for (let i = 0; i < 100; i++) particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.5 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  if (animId) cancelAnimationFrame(animId);
  if (type !== 'none') animateParticles();
}

function animateParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particleType === 'rain') {
    ctx.strokeStyle = 'rgba(130,180,255,0.4)';
    ctx.lineWidth = 1;
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 2, p.y + p.len);
      ctx.stroke();
      p.y += p.speed;
      if (p.y > canvas.height) { p.y = -p.len; p.x = Math.random() * canvas.width; }
    });
  } else if (particleType === 'snow') {
    particles.forEach(p => {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
    });
  } else if (particleType === 'stars') {
    particles.forEach(p => {
      p.pulse += 0.02;
      const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#c4b5fd';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.globalAlpha = 1;
  animId = requestAnimationFrame(animateParticles);
}

function setParticlesForWeather(weatherMain, timeOfDay) {
  if (['Rain', 'Drizzle'].includes(weatherMain)) initParticles('rain');
  else if (weatherMain === 'Snow') initParticles('snow');
  else if (timeOfDay === 'night') initParticles('stars');
  else {
    particleType = 'none';
    if (animId) cancelAnimationFrame(animId);
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ── Hour Format Toggle ──────────────────
function toggleHourFormat() {
  hourFormat = hourFormat === 24 ? 12 : 24;
  document.getElementById('hourFormatBtn').textContent = hourFormat === 24 ? '24H' : '12H';
  if (forecastData && currentWeatherData) {
    renderHourlyCards(forecastData, currentWeatherData.timezone);
    renderWeekGrid(forecastData, currentWeatherData.timezone);
    document.getElementById('sunriseTime').textContent = fmtTime(currentWeatherData.sys.sunrise, currentWeatherData.timezone);
    document.getElementById('sunsetTime').textContent = fmtTime(currentWeatherData.sys.sunset, currentWeatherData.timezone);
  }
}

// ── Theme Functions ─────────────────────
function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeMenu').classList.add('hidden');
  if (theme !== 'auto' && currentWeatherData) {
    document.getElementById('timePhase').textContent = ''; // Clear phase badge for non-auto
  }
  if (theme === 'auto' && currentWeatherData) {
    applyAutoTheme(currentWeatherData.sys.sunrise, currentWeatherData.sys.sunset, currentWeatherData.timezone);
  }
}

function toggleThemeMenu() {
  document.getElementById('themeMenu').classList.toggle('hidden');
}

// Close theme menu on outside click
document.addEventListener('click', e => {
  const sel = document.querySelector('.theme-selector');
  if (sel && !sel.contains(e.target)) {
    document.getElementById('themeMenu').classList.add('hidden');
  }
});

// ── Clock ───────────────────────────────
function updateClock() {
  const now = new Date();
  const h = hourFormat === 12
    ? ((now.getHours() % 12 || 12) + ':' + String(now.getMinutes()).padStart(2, '0') + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM'))
    : (String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'));
  document.getElementById('clockTime').textContent = h;
  document.getElementById('clockDate').textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

setInterval(updateClock, 1000);
updateClock();

// ── Chart ───────────────────────────────
function buildChart(forecastList, tzOffset) {
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  const next8 = forecastList.slice(0, 8);

  const labels = next8.map(f => fmtTime(f.dt, tzOffset));
  const temps = next8.map(f => Math.round(f.main.temp));
  const humids = next8.map(f => f.main.humidity);
  const winds = next8.map(f => parseFloat(f.wind.speed.toFixed(1)));

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00e5ff';

  if (hourlyChart) hourlyChart.destroy();

  hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temps,
        borderColor: accentColor,
        backgroundColor: accentColor + '18',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: accentColor,
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(5,10,25,0.95)',
          titleColor: accentColor,
          bodyColor: '#c0c8e0',
          borderColor: accentColor + '40',
          borderWidth: 1,
          padding: 12,
        }
      },
      scales: {
        x: {
          ticks: { color: '#7a85a3', font: { family: 'JetBrains Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: { color: '#7a85a3', font: { family: 'JetBrains Mono', size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        }
      }
    }
  });

  // Store datasets for switching
  hourlyChart._allData = { temps, humids, winds, labels };
  hourlyChart._tzOffset = tzOffset;
}

function switchChart(type) {
  if (!hourlyChart) return;
  document.querySelectorAll('.ctbtn').forEach(b => b.classList.remove('active'));
  const d = hourlyChart._allData;
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00e5ff';

  const configs = {
    temp:  { data: d.temps,  label: 'Temperature (°C)',  color: accentColor },
    humid: { data: d.humids, label: 'Humidity (%)',       color: '#60a5fa' },
    wind:  { data: d.winds,  label: 'Wind Speed (m/s)',   color: '#34d399' },
  };

  const c = configs[type];
  hourlyChart.data.datasets[0].data = c.data;
  hourlyChart.data.datasets[0].label = c.label;
  hourlyChart.data.datasets[0].borderColor = c.color;
  hourlyChart.data.datasets[0].backgroundColor = c.color + '18';
  hourlyChart.data.datasets[0].pointBackgroundColor = c.color;
  hourlyChart.update();

  document.getElementById('btn' + type.charAt(0).toUpperCase() + type.slice(1).replace('humid','Humid').replace('wind','Wind')).classList.add('active');
  document.getElementById('btnTemp').classList.toggle('active', type === 'temp');
  document.getElementById('btnHumid').classList.toggle('active', type === 'humid');
  document.getElementById('btnWind').classList.toggle('active', type === 'wind');
}

// ── Hourly Cards ────────────────────────
const weatherIconMap = {
  '01d':'☀️','01n':'🌙','02d':'⛅','02n':'🌥️','03d':'☁️','03n':'☁️',
  '04d':'☁️','04n':'☁️','09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
  '11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️',
};

function renderHourlyCards(list, tzOffset) {
  const container = document.getElementById('hourlyScroll');
  container.innerHTML = '';
  list.slice(0, 8).forEach(f => {
    const emoji = weatherIconMap[f.weather[0].icon] || '🌡️';
    const rain = f.pop ? Math.round(f.pop * 100) : 0;
    const card = document.createElement('div');
    card.className = 'h-card';
    card.innerHTML = `
      <div class="h-time">${fmtTime(f.dt, tzOffset)}</div>
      <div class="h-icon">${emoji}</div>
      <div class="h-temp">${Math.round(f.main.temp)}°</div>
      ${rain > 0 ? `<div class="h-rain">💧${rain}%</div>` : ''}
    `;
    container.appendChild(card);
  });
}

// ── 7-Day Grid ───────────────────────────
function renderWeekGrid(list, tzOffset) {
  // Group by day
  const days = {};
  list.forEach(f => {
    const d = new Date((f.dt + tzOffset) * 1000);
    const key = d.toUTCString().slice(0, 16);
    if (!days[key]) days[key] = [];
    days[key].push(f);
  });

  const container = document.getElementById('weekGrid');
  container.innerHTML = '';

  Object.entries(days).slice(0, 7).forEach(([key, items]) => {
    const temps = items.map(i => i.main.temp);
    const high = Math.max(...temps);
    const low = Math.min(...temps);
    const mid = items[Math.floor(items.length / 2)];
    const emoji = weatherIconMap[mid.weather[0].icon] || '🌡️';
    const dayName = new Date(mid.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const rain = items.reduce((a, b) => a + (b.pop || 0), 0) / items.length;

    const card = document.createElement('div');
    card.className = 'w-card';
    card.innerHTML = `
      <div class="w-day">${dayName}</div>
      <div class="w-icon">${emoji}</div>
      <div class="w-high">${Math.round(high)}°</div>
      <div class="w-low">${Math.round(low)}°</div>
      <div class="w-desc">${mid.weather[0].description}</div>
      ${rain > 0.2 ? `<div class="h-rain">💧${Math.round(rain*100)}%</div>` : ''}
    `;
    container.appendChild(card);
  });
}

// ── Quick Load ───────────────────────────
function quickLoad(city) {
  document.getElementById('cityInput').value = city;
  loadWeather();
}

// ── Main Load Function ───────────────────
async function loadWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('errorBox').classList.add('hidden');
  document.getElementById('loader').classList.remove('hidden');

  try {
    const [wRes, fRes] = await Promise.all([
      fetch(`/api/weather?city=${encodeURIComponent(city)}`),
      fetch(`/api/forecast?city=${encodeURIComponent(city)}`),
    ]);

    const wData = await wRes.json();
    const fData = await fRes.json();

    if (!wRes.ok) throw new Error(wData.error);
    if (!fRes.ok) throw new Error(fData.error);

    currentWeatherData = wData;
    forecastData = fData.list;

    document.getElementById('loader').classList.add('hidden');
    renderWeather(wData, fData.list);

  } catch (err) {
    document.getElementById('loader').classList.add('hidden');
    showError(err.message);
  }
}

// ── Render All ───────────────────────────
function renderWeather(w, fList) {
  const tz = w.timezone;

  // ── Hero
  document.getElementById('heroCity').textContent = w.name;
  document.getElementById('heroCountry').textContent = `${w.sys.country}`;
  document.getElementById('heroTemp').textContent = Math.round(w.main.temp);
  document.getElementById('heroDesc').textContent = w.weather[0].description;
  document.getElementById('heroFeels').textContent = `${Math.round(w.main.feels_like)}°C`;
  document.getElementById('tempMin').textContent = `${Math.round(w.main.temp_min)}°C`;
  document.getElementById('tempMax').textContent = `${Math.round(w.main.temp_max)}°C`;
  document.getElementById('heroIcon').src = `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`;

  // ── Stats
  document.getElementById('statHumidity').textContent = `${w.main.humidity}%`;
  document.getElementById('humidityBar').style.width = `${w.main.humidity}%`;

  document.getElementById('statWind').textContent = `${w.wind.speed} m/s`;
  const windDeg = w.wind.deg || 0;
  document.getElementById('compassNeedle').style.transform = `rotate(${windDeg}deg)`;
  document.getElementById('compassDir').textContent = windDegToDir(windDeg);

  const visPct = Math.min((w.visibility / 10000) * 100, 100);
  document.getElementById('statVisibility').textContent = `${(w.visibility / 1000).toFixed(1)} km`;
  document.getElementById('visibilityBar').style.width = `${visPct}%`;

  document.getElementById('statPressure').textContent = `${w.main.pressure} hPa`;
  const pTrend = w.main.pressure > 1013 ? '↑ High pressure' : '↓ Low pressure';
  document.getElementById('pressureTrend').textContent = pTrend;

  document.getElementById('statClouds').textContent = `${w.clouds.all}%`;
  const dots = document.getElementById('cloudDots');
  dots.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = `cloud-dot${i < Math.round(w.clouds.all / 10) ? ' active' : ''}`;
    dots.appendChild(d);
  }

  // ── Sun Track
  document.getElementById('sunriseTime').textContent = fmtTime(w.sys.sunrise, tz);
  document.getElementById('sunsetTime').textContent = fmtTime(w.sys.sunset, tz);
  updateSunArc(w.sys.sunrise, w.sys.sunset, tz);

  // ── Auto theme
  const timeOfDay = applyAutoTheme(w.sys.sunrise, w.sys.sunset, tz);

  // ── Particles
  setParticlesForWeather(w.weather[0].main, timeOfDay);

  // ── Local time (live update)
  if (localTimeInterval) clearInterval(localTimeInterval);
  const updateLocal = () => {
    document.getElementById('localTime').textContent = fmtLocalTime(tz);
  };
  updateLocal();
  localTimeInterval = setInterval(updateLocal, 1000);

  // ── Outfit Advisor
  const outfit = getOutfitAdvice(w.main.temp, w.weather[0].description.toLowerCase(), w.wind.speed);
  document.getElementById('outfitIcon').textContent = outfit.icon;
  document.getElementById('outfitText').textContent = outfit.text;
  document.getElementById('outfitBadge').textContent = outfit.badge;

  // ── Moon Phase
  const moon = getMoonPhase(new Date());
  document.getElementById('moonVisual').textContent = moon.icon;
  document.getElementById('moonName').textContent = moon.name;
  document.getElementById('moonDetail').textContent = moon.detail;

  // ── Weather Story
  document.getElementById('storyIcon').textContent = weatherIconMap[w.weather[0].icon] || '🌍';
  document.getElementById('storyText').textContent = getWeatherStory(w);

  // ── Weather Facts (random start)
  factIndex = Math.floor(Math.random() * weatherFacts.length);
  document.getElementById('factText').textContent = weatherFacts[factIndex];

  // ── Chart
  buildChart(fList, tz);

  // ── Hourly Cards
  renderHourlyCards(fList, tz);

  // ── Week Grid
  renderWeekGrid(fList, tz);

  // Show everything
  document.getElementById('mainContent').classList.remove('hidden');
}

function showError(msg) {
  document.getElementById('errorText').textContent = msg;
  document.getElementById('errorBox').classList.remove('hidden');
}

// ── Enter key ───────────────────────────
document.getElementById('cityInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') loadWeather();
});

// ── Canvas resize ────────────────────────
window.addEventListener('resize', () => {
  const canvas = document.getElementById('particleCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ═══════════════════════════════════════
//  AUTO DETECT LOCATION ON PAGE LOAD
// ═══════════════════════════════════════
window.addEventListener('load', () => {
  detectAndLoadLocation();
});

function detectAndLoadLocation() {
  // Show loader immediately
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('errorBox').classList.add('hidden');

  // Update loader text
  const loaderText = document.querySelector('.loader p');
  if (loaderText) loaderText.innerHTML = 'Detecting your location<span class="dots">...</span>';

  // Check if browser supports geolocation
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported by this browser.');
    fallbackToDefault();
    return;
  }

  // Request location with timeout
  navigator.geolocation.getCurrentPosition(
    onLocationSuccess,
    onLocationError,
    {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000  // Cache for 5 minutes
    }
  );
}

// ── Location granted ─────────────────────
async function onLocationSuccess(position) {
  const { latitude, longitude } = position.coords;

  try {
    // Update loader text
    const loaderText = document.querySelector('.loader p');
    if (loaderText) loaderText.innerHTML = 'Loading your local weather<span class="dots">...</span>';

    // Fetch current weather by coordinates
    const wRes = await fetch(`/api/weather-by-coords?lat=${latitude}&lon=${longitude}`);
    const wData = await wRes.json();

    if (!wRes.ok) throw new Error(wData.error || 'Location weather failed');

    // Set city name in search box
    document.getElementById('cityInput').value = wData.name;
    currentWeatherData = wData;

    // Fetch forecast using the city name returned
    const fRes = await fetch(`/api/forecast?city=${encodeURIComponent(wData.name)}`);
    const fData = await fRes.json();

    if (!fRes.ok) throw new Error(fData.error || 'Forecast failed');

    forecastData = fData.list;

    // Hide loader and render
    document.getElementById('loader').classList.add('hidden');
    renderWeather(wData, fData.list);

  } catch (err) {
    console.error('Location weather error:', err.message);
    document.getElementById('loader').classList.add('hidden');
    fallbackToDefault();
  }
}

// ── Location denied or error ─────────────
function onLocationError(err) {
  console.warn('Geolocation error:', err.message);
  document.getElementById('loader').classList.add('hidden');

  // Show a small non-intrusive tip instead of an error
  const errorBox = document.getElementById('errorBox');
  const errorText = document.getElementById('errorText');
  errorText.textContent = 'Location access denied. Search any city above.';
  errorBox.classList.remove('hidden');

  // Auto-hide the message after 4 seconds
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 4000);
}

// ── Fallback city if everything fails ────
function fallbackToDefault() {
  // Just show empty search — don't force Mumbai
  document.getElementById('loader').classList.add('hidden');
}