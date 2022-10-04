refreshDisplay()

class Forecast {
    constructor(date, temperature, windspeed, winddirection) {
        this.date = date
        this.temperature = temperature
        this.windspeed = windspeed
        this.winddirection = winddirection
    }
}

let currentForecast = new Forecast()

let button = document.querySelector('#refreshButton')
button.addEventListener('click', getFetch)
button.addEventListener('click', refreshDisplay)

function getFetch() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.24&hourly=temperature_2m,windspeed_10m,winddirection_10m,shortwave_radiation_instant&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,rain_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=kn&precipitation_unit=inch&timezone=America%2FLos_Angeles')
        .then(response => response.json())
        .then(response => {
            let current = response.current_weather
            currentForecast.date = current.time, 
            currentForecast.temperature = current.temperature, 
            currentForecast.windspeed = current.windspeed, 
            currentForecast.winddirection = current.winddirection

            localStorage.setItem('date', currentForecast.date)
            localStorage.setItem('temperature', currentForecast.temperature)
            localStorage.setItem('windspeed', currentForecast.windspeed)
            localStorage.setItem('winddirection', currentForecast.winddirection)
        })
        .catch(err => console.error(err));
}

function refreshDisplay() {
    document.querySelector('#dateContainer').innerText = localStorage.getItem('date')
    document.querySelector('#temperatureContainer').innerHTML = localStorage.getItem('temperature') + ' F'
    document.querySelector('#windspeedContainer').innerHTML = localStorage.getItem('windspeed') + ' knots'
    document.querySelector('#winddirectionContainer').innerText = formatWindDirection()
}



function formatWindDirection() {
    let winddirection = localStorage.getItem('winddirection')
    console.log(winddirection)
    
    switch (winddirection) {
        case ( winddirection > 0):
            winddirection = 'NE';
            return winddirection;
        case (winddirection < 0):
            winddirection = 'SE';
            break
    } 
}