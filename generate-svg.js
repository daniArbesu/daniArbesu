/* eslint-disable no-param-reassign */
import 'dotenv/config';
import fs from 'fs';
import fetch from 'node-fetch';

// initial variables
const { WEATHER_API_KEY } = process.env;
const WEATHER_DOMAIN = 'https://api.openweathermap.org/data/2.5';
const CURRENT_LOCATION_CITY = 'Valencia';
const CURRENT_LOCATION_COUNTRY = 'Spain';

// To use instead of the icons
const emojis = {
  '01d': '☀️',
  '02d': '🌤',
  '03d': '🌥',
  '04d': '☁️',
  '09d': '🌧',
  '10d': '🌦',
  '11d': '⛈',
  '13d': '❄️',
  '50d': '🌫'
};

// Cheap, janky way to have variable bubble width
const dayBubbleWidths = {
  Monday: 235,
  Tuesday: 235,
  Wednesday: 260,
  Thursday: 245,
  Friday: 220,
  Saturday: 245,
  Sunday: 230
};

// Day of the week today
const today = new Date();
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

// Today's weather
const url = `${WEATHER_DOMAIN}/weather?q=${CURRENT_LOCATION_CITY}&appid=${WEATHER_API_KEY}&units=metric`;

try {
  const response = await fetch(url);
  const locationWeather = await response.json();

  if (locationWeather.cod === 200) {
    const degC = Math.round(locationWeather.main.temp_max);
    const { icon } = locationWeather.weather[0];

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        throw new Error();
      }

      data = data.replace('{city}', CURRENT_LOCATION_CITY);
      data = data.replace('{country}', CURRENT_LOCATION_COUNTRY);
      data = data.replace('{degC}', degC);
      data = data.replace('{weatherEmoji}', emojis[icon]);
      data = data.replace('{todayDay}', todayDay);
      data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay]);

      fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          throw new Error();
        }
      });
    });
  }
} catch (error) {
  throw new Error('Error fetching weather data at your location');
}
