const search_field = document.querySelector(".search-field");
const weather_icon = document.querySelector(".weather-icon");
const weather_city = document.querySelector(".city");
const date_time = document.querySelector(".date-time");
const forecast = document.querySelector(".forecast");
const temp_curr = document.querySelector(".temp-text");
const min_text = document.querySelector(".min-text");
const max_text = document.querySelector(".max-text");

const drpdown = document.querySelector(".dropdown");

// Right side details
const feels = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind_html = document.getElementById("wind");
const pm25 = document.getElementById("pm2.5");

const weatherCodes = {
    0: "Clear",
    1: "few clouds",
    2: "few clouds",
    3: "few clouds",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    56: "Freezing Drizzle",
    57: "Freezing Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Rain",
    66: "Freezing Rain",
    67: "Freezing Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    77: "Snow showers",
    80: "showers",
    81: "showers",
    82: "showers",
    85: "Snow showers",
    86: "Snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm"
};  

const getDateTime = (dt) => {
    const curDate = new Date(dt);
    console.log(curDate);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
  
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    console.log(formatter);
    return formatter.format(curDate);
};

const getCountryName = (code) => {
    return new Intl.DisplayNames([code], { type: "region" }).of(code);
};

let lat = 28.61389;
let lon = 77.23117;
let limit = 5;
let timeoutId;
let API_key = ""; //Enter your api key

drpdown.addEventListener("click", async (event) => {
    const elem = event.target;
    drpdown.innerHTML = "";
    lat = elem.getAttribute('lat');
    lon = elem.getAttribute('lon');
    weather_city.innerHTML = elem.innerHTML;
    await getWeatherData();
    await getAQI();
});

const getLocations = async (placeId) => {
    if (placeId === "") {
        drpdown.innerHTML = "";
        return;
    }
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(placeId)}&limit=5`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_key,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        drpdown.innerHTML = "";

        if (result.data.length === 0) {
            clearTimeout(timeoutId);
            const place = document.createElement("div");
            place.innerHTML = "no matches found..........";
            timeoutId = setTimeout(() => {
                drpdown.innerHTML = "";
            }, 2000);
            drpdown.append(place);
            return;
        }
        clearTimeout(timeoutId);
        result.data.forEach(city => {
            const place = document.createElement("div");
            place.innerHTML = `${city.city}, ${city.region}, ${city.country}`;
            place.setAttribute('lat', city.latitude);
            place.setAttribute('lon', city.longitude);
            drpdown.append(place);
        });
    }
    catch (error) {
        drpdown.innerHTML = "";
        console.error('Error fetching data:', error);
        const place = document.createElement("div");
        place.innerHTML = "API key not working";
        setTimeout(() => {
            drpdown.innerHTML = "";
        }, 2000);
        drpdown.append(place);
    }
};

// Search bar
const type = (value) => {
    getLocations(value);
};
search_field.addEventListener("input", (event) => {
    const value = event.target.value;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        type(value);
    }, 500);
});

const getWeatherData = async () => {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,precipitation,relative_humidity_2m,apparent_temperature,rain,wind_speed_10m,surface_pressure,weather_code&timezone=auto`;
    try {
        const res = await fetch(weatherUrl);
        const data = await res.json();
        console.log(data);

        const {current, daily} = data;

        // left side
        date_time.innerHTML = getDateTime(new Date(current.time).getTime());
        temp_curr.innerHTML = `${current.temperature_2m}&degC`;
        min_text.innerHTML = `${daily.temperature_2m_min[0]}&degC`;
        max_text.innerHTML = `${daily.temperature_2m_max[0]}&degC`;
        weather_icon.src = `Icons/${weatherCodes[current.weather_code]}.svg`;
        forecast.innerHTML = `${weatherCodes[current.weather_code]}`

        //right side
        feels.innerHTML = `${current.apparent_temperature}&degC`;
        humidity.innerHTML = `${current.relative_humidity_2m} %`;
        pressure.innerHTML = `${current.surface_pressure} hPa`;
        wind_html.innerHTML = `${current.wind_speed_10m} km/h`;
        pm25.innerHTML = ``;
    }
    catch (error) {
        console.log(error);
    }
};

const getAQI = async () => {
    const AQIUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5`;
    try {
        const res = await fetch(AQIUrl);
        const data = await res.json();
        console.log(data);

        const {current} = data;
        pm25.innerHTML = `${current.pm2_5}`;
    }
    catch (error) {
        console.log(error);
    }
};
  
window.addEventListener("load", async () => {
        await getWeatherData();
        await getAQI();
    }
);

// API Key functionality
const api_key_user = document.querySelector("#api_key");
const submit_api = document.querySelector(".entry button");

submit_api.addEventListener("click", async () => {
    API_key = api_key_user.value;
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(3519923)}&limit=5`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_key,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        api_key_user.value = "Success";
    } catch (error) {
        api_key_user.value = `Error: ${error.message}`;
        console.error("Fetch error:", error);
    }
});