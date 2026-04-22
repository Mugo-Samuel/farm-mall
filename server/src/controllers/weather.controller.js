const https = require('https');
require('dotenv').config();

const getFarmingInsight = (temp, condition, humidity) => {
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return { icon: '🌧️', insight: 'Rain expected today. Great for planting! Hold off on manual irrigation to save water.' };
  }
  if (temp > 35) {
    return { icon: '🌡️', insight: 'High temperature alert! Ensure crops are well irrigated. Consider using shade nets.' };
  }
  if (temp < 10) {
    return { icon: '❄️', insight: 'Cold conditions detected. Protect sensitive crops from potential frost damage.' };
  }
  if (humidity > 80) {
    return { icon: '💧', insight: 'High humidity levels. Watch out for fungal diseases. Ensure good air circulation in your fields.' };
  }
  if (condition.includes('clear')) {
    return { icon: '☀️', insight: 'Clear skies! A great day for field work, spraying, and harvesting.' };
  }
  return { icon: '🌤️', insight: 'Moderate weather conditions. A good day for general farm activities.' };
};

const getWeather = (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: 'City is required.' });
  }

  if (!process.env.WEATHER_API_KEY) {
    return res.status(500).json({ message: 'Weather API key not configured.' });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const weather = JSON.parse(data);
        if (weather.cod !== 200) {
          return res.status(404).json({ message: 'City not found. Please check the name and try again.' });
        }

        const temp = Math.round(weather.main.temp);
        const condition = weather.weather[0].main.toLowerCase();
        const humidity = weather.main.humidity;
        const { icon, insight } = getFarmingInsight(temp, condition, humidity);

        return res.json({
          city: weather.name,
          country: weather.sys.country,
          temp,
          condition: weather.weather[0].description,
          humidity,
          windSpeed: weather.wind.speed,
          icon,
          insight
        });
      } catch (e) {
        return res.status(500).json({ message: 'Error parsing weather data.' });
      }
    });
  }).on('error', () => {
    return res.status(500).json({ message: 'Error fetching weather data.' });
  });
};

module.exports = { getWeather };