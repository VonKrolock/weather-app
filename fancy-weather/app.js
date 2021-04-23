const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const err = document.querySelector('.err');

// Form event
form.addEventListener('submit', formSubmitted);

function formSubmitted(event) {
  event.preventDefault();
  const searchTerm = input.value;
  getRezults(searchTerm);
  threeDaysResult(searchTerm);
}

// Weather forecast for today
function getRezults(searchTerm) {

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=02c6fe1218a0aa228fcf05d15d54efbd`)
    .then((response) => response.json())
    .then((data) => {
      err.innerHTML = '';
      err.classList.remove('error');
      document.querySelector('.city').textContent = `${data.name},${data.sys.country}`;
      document.querySelector('.temp').innerHTML = `${Math.round(data.main.temp - 273)}&deg;`;
      document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(data.main.feels_like - 273)}&deg;`;
      document.querySelector('.list__item__two').innerHTML = `WIND:${data.wind.speed} m/s`;
      document.querySelector('.list__item__three').innerHTML = `HUMIDITY:${data.main.humidity}%`;
      document.querySelector('.lon').innerHTML = `Longitude: ${data.coord.lon}`;
      document.querySelector('.lat').innerHTML = `Latitude: ${data.coord.lat}`;

      // Map GeoLocation
      mapboxgl.accessToken = 'pk.eyJ1Ijoidm9ua3JvbG9jayIsImEiOiJjazl3cmNpMGgwM3hkM3FxZG16aXc3ajFnIn0.5kY34klR8aQIzmS0G7fn1Q';
      let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 10,
        center: [data.coord.lon, data.coord.lat],
      });

      // Get an Icon
      document.querySelector('.list__item__zero').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;

      // Temperature converter
      document.querySelector('.btn__fahr').addEventListener('click', () => {
        document.querySelector('.temp').innerHTML = `${Math.round(((data.main.temp - 273.15) * 1.8) + 32)}&deg;`;
        document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(((data.main.temp - 273.15) * 1.8) + 32)}&deg;`;
      });

      document.querySelector('.btn__celc').addEventListener('click', () => {
        document.querySelector('.temp').innerHTML = `${Math.round(data.main.temp - 273)}&deg;`;
        document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(data.main.feels_like - 273)}&deg;`;
      });

    })
    .catch(() => {
      err.innerHTML = 'City not Found. Try again';
      err.classList.add('error');
    });
}

// Weather forecast for three days
function threeDaysResult(searchTerm) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=02c6fe1218a0aa228fcf05d15d54efbd`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('.tempOne').innerHTML = `${Math.round(data.list[6].main.temp - 273)}&deg;`;
      document.querySelector('.tempTwo').innerHTML = `${Math.round(data.list[14].main.temp - 273)}&deg;`;
      document.querySelector('.tempThree').innerHTML = `${Math.round(data.list[22].main.temp - 273)}&deg;`;

      document.querySelector('.dayOne').innerHTML = new Date(data.list[6].dt * 1000).toLocaleString('en-us', {
        weekday: 'long',
      });
      document.querySelector('.dayTwo').innerHTML = new Date(data.list[14].dt * 1000).toLocaleString('en-us', {
        weekday: 'long',
      });
      document.querySelector('.dayThree').innerHTML = new Date(data.list[22].dt * 1000).toLocaleString('en-us', {
        weekday: 'long',
      });

      document.querySelector('.weather__icon__one').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[6].weather[0].icon}@2x.png">`;
      document.querySelector('.weather__icon__two').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[14].weather[0].icon}@2x.png">`;
      document.querySelector('.weather__icon__three').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[22].weather[0].icon}@2x.png">`;

      document.querySelector('.btn__fahr').addEventListener('click', () => {
        document.querySelector('.tempOne').innerHTML = `${Math.round(((data.list[6].main.temp - 273.15) * 1.8) + 32)}&deg;`;
        document.querySelector('.tempTwo').innerHTML = `${Math.round(((data.list[14].main.temp - 273.15) * 1.8) + 32)}&deg;`;
        document.querySelector('.tempThree').innerHTML = `${Math.round(((data.list[22].main.temp - 273.15) * 1.8) + 32)}&deg;`;
      });

      document.querySelector('.btn__celc').addEventListener('click', () => {
        document.querySelector('.tempOne').innerHTML = `${Math.round(data.list[6].main.temp - 273)}&deg;`;
        document.querySelector('.tempTwo').innerHTML = `${Math.round(data.list[14].main.temp - 273)}&deg;`;
        document.querySelector('.tempThree').innerHTML = `${Math.round(data.list[22].main.temp - 273)}&deg;`;
      });
    });
}

// Set timer
function startTime() {
  const today = new Date();
  const h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.querySelector('.clock').innerHTML = `,${h}:${m}:${s}`;
  let t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) { i = `0${i}`; }
  return i;
}

// Window event onload
function init() {
  startTime();
  const body = document.querySelector('body');
  body.style.backgroundImage = 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("https://source.unsplash.com/random/?weather")';

  document.querySelector('.btn__refresh').addEventListener('click', () => {
    body.style.backgroundImage = 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("https://source.unsplash.com/random/?weather forecast")';
  });

  // Get Geolocation
  const key = 'https://ipinfo.io/json?token=97854c5d7c7c71';
  fetch(key)
    .then((response) => response.json())
    .then((datas) => {
      document.querySelector('.city').textContent = `${datas.city},${datas.country}`;

      // Get info about the city from geolocation
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${datas.city}&appid=02c6fe1218a0aa228fcf05d15d54efbd`)
        .then((response) => response.json())
        .then((data) => {
          document.querySelector('.date').textContent = new Date().toLocaleDateString();
          document.querySelector('.temp').innerHTML = `${Math.round(data.main.temp - 273)}&deg;`;
          document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(data.main.feels_like - 273)}&deg;`;
          document.querySelector('.list__item__two').innerHTML = `WIND:${data.wind.speed} m/s`;
          document.querySelector('.list__item__three').innerHTML = `HUMIDITY:${data.main.humidity}%`;
          document.querySelector('.lon').innerHTML = `Longitude: ${data.coord.lon}`;
          document.querySelector('.lat').innerHTML = `Latitude: ${data.coord.lat}`;

          mapboxgl.accessToken = 'pk.eyJ1Ijoidm9ua3JvbG9jayIsImEiOiJjazl3cmNpMGgwM3hkM3FxZG16aXc3ajFnIn0.5kY34klR8aQIzmS0G7fn1Q';
          let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: 10,
            center: [data.coord.lon, data.coord.lat],
          });

          document.querySelector('.list__item__zero').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`;

          document.querySelector('.btn__fahr').addEventListener('click', () => {
            document.querySelector('.temp').innerHTML = `${Math.round(((data.main.temp - 273.15) * 1.8) + 32)}&deg;`;
            document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(((data.main.temp - 273.15) * 1.8) + 32)}&deg;`;
          });

          document.querySelector('.btn__celc').addEventListener('click', () => {
            document.querySelector('.temp').innerHTML = `${Math.round(data.main.temp - 273)}&deg;`;
            document.querySelector('.list__item__one').innerHTML = `FEELS LIKE:${Math.round(data.main.feels_like - 273)}&deg;`;
          });
        });

      // Get information about the city from geolocation for the next three days
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${datas.city}&appid=02c6fe1218a0aa228fcf05d15d54efbd`)
        .then((response) => response.json())
        .then((data) => {
          document.querySelector('.tempOne').innerHTML = `${Math.round(data.list[6].main.temp - 273)}&deg;`;
          document.querySelector('.tempTwo').innerHTML = `${Math.round(data.list[14].main.temp - 273)}&deg;`;
          document.querySelector('.tempThree').innerHTML = `${Math.round(data.list[22].main.temp - 273)}&deg;`;

          document.querySelector('.dayOne').innerHTML = new Date(data.list[6].dt * 1000).toLocaleString('en-us', {
            weekday: 'long',
          });
          document.querySelector('.dayTwo').innerHTML = new Date(data.list[14].dt * 1000).toLocaleString('en-us', {
            weekday: 'long',
          });
          document.querySelector('.dayThree').innerHTML = new Date(data.list[22].dt * 1000).toLocaleString('en-us', {
            weekday: 'long',
          });

          document.querySelector('.weather__icon__one').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[6].weather[0].icon}@2x.png">`;
          document.querySelector('.weather__icon__two').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[14].weather[0].icon}@2x.png">`;
          document.querySelector('.weather__icon__three').innerHTML = `<img src = "https://openweathermap.org/img/wn/${data.list[22].weather[0].icon}@2x.png">`;

          document.querySelector('.btn__fahr').addEventListener('click', () => {
            document.querySelector('.tempOne').innerHTML = `${Math.round(((data.list[6].main.temp - 273.15) * 1.8) + 32)}&deg;`;
            document.querySelector('.tempTwo').innerHTML = `${Math.round(((data.list[14].main.temp - 273.15) * 1.8) + 32)}&deg;`;
            document.querySelector('.tempThree').innerHTML = `${Math.round(((data.list[22].main.temp - 273.15) * 1.8) + 32)}&deg;`;
          });

          document.querySelector('.btn__celc').addEventListener('click', () => {
            document.querySelector('.tempOne').innerHTML = `${Math.round(data.list[6].main.temp - 273)}&deg;`;
            document.querySelector('.tempTwo').innerHTML = `${Math.round(data.list[14].main.temp - 273)}&deg;`;
            document.querySelector('.tempThree').innerHTML = `${Math.round(data.list[22].main.temp - 273)}&deg;`;
          });
        });
    });
}
window.onload = init;
