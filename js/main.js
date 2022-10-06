class Forecast {
    constructor(date, temperature, windspeed, winddirection) {
        this.date = date
        this.temperature = temperature
        this.windspeed = windspeed
        this.winddirection = winddirection
    }
}

class City {
    constructor(name, latitude, longitude) {
        this.name = name
        this.latitude = latitude
        this.longitude = longitude
    }
}

let currentForecast = new Forecast()
let cities = []
cities.push(losAngeles = new City('Los Angeles', 34.05, -118.24))
cities.push(berlin = new City('Berlin', 52.5235, 13.4115))
cities.push(orange = new City('Orange', 33.7879, -117.8531))

for (let i = 0; i < cities.length; i++) {
    let cityOption = document.createElement('option')
    cityOption.innerText = cities[i].name
    document.getElementById('citySelect').appendChild(cityOption)
}

let button = document.querySelector('#refreshButton')
button.addEventListener('click', refreshDisplay)

let chosenCity = {
    name: '',
    longitude: '',
    latitude: '',
}

getFetch()
refreshDisplay()
showTime()
showDate()

function cityChoice() {
    getFetch()
}

function getCity() {
    let cityInputValue = document.querySelector('#citySelect').value
    for (let i = 0; i < cities.length; i++) {
        if (cityInputValue == cities[i].name) {
            chosenCity.name = cities[i].name
            chosenCity.longitude = cities[i].longitude
            chosenCity.latitude = cities[i].latitude
        }
    }
}

function getLongitude() {
    return chosenCity.longitude
}

function getLatitude() {
    return chosenCity.latitude
}

function getFetch() {
    getCity()

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${getLatitude()}&longitude=${getLongitude()}&hourly=temperature_2m,windspeed_10m,winddirection_10m,shortwave_radiation_instant&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,rain_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=kn&precipitation_unit=inch&timezone=America%2FLos_Angeles`)
        .then(response => response.json())
        .then(response => {
            let current = response.current_weather
            // currentForecast.date = current.time, 
            currentForecast.temperature = current.temperature, 
            currentForecast.windspeed = current.windspeed, 
            currentForecast.winddirection = current.winddirection

            localStorage.setItem('city', chosenCity.name)
            // localStorage.setItem('date', currentForecast.date)
            localStorage.setItem('temperature', currentForecast.temperature)
            localStorage.setItem('windspeed', currentForecast.windspeed)
            localStorage.setItem('winddirection', currentForecast.winddirection)

        })
        .catch(err => console.error(err));
}

function refreshDisplay() {
    document.querySelector('#nameContainer').innerText = localStorage.getItem('city')
    // document.querySelector('#dateContainer').innerText = localStorage.getItem('date')
    showDate()
    document.querySelector('#temperatureContainer').innerHTML = localStorage.getItem('temperature') + ' F'
    document.querySelector('#windspeedContainer').innerHTML = formatWindSpeed()
    document.querySelector('#winddirectionContainer').innerText = formatWindDirection()
    console.log(formatWindSpeed())
}


function formatWindSpeed() {
    let windspeed = localStorage.getItem('windspeed')
    console.log(windspeed)
    if (windspeed <= 2.5) {
        return `CALM (${windspeed} knots)`
    } else if (windspeed > 2.5 && windspeed < 10) {
        return `LIGHT BREEZE (${windspeed} knots)`
    } else if (windspeed > 10 && windspeed < 22.5) {
        return `MODERATE BREEZE (${windspeed} knots)`
    } else if (windspeed > 22.5) {
        return `STRONG BREEZE (${windspeed} knots)`
    }
}

function formatWindDirection() {
    let winddirection = localStorage.getItem('winddirection')
    if (winddirection >= 345 || winddirection <= 15) {
        return 'N'
    } else if (15 < winddirection && winddirection < 35){
        return 'N/NE'
    } else if (35 < winddirection && winddirection < 55){
        return 'NE'
    } else if (55 < winddirection && winddirection < 75){
        return 'E/NE'
    } else if (75 < winddirection && winddirection < 105){
        return 'E'
    } else if (105 < winddirection && winddirection < 125){
        return 'E/SE'
    } else if (125 < winddirection && winddirection < 145){
        return 'SE'
    } else if (145 < winddirection && winddirection < 165){
        return 'S/SE'
    } else if (165 < winddirection && winddirection < 195){
        return 'S'
    } else if (195 < winddirection && winddirection < 215){
        return 'S/SW'
    } else if (215 < winddirection && winddirection < 235){
        return 'SW'
    } else if (235 < winddirection && winddirection < 255){
        return 'W/SW'
    } else if (255 < winddirection && winddirection < 285){
        return 'W'
    } else if (285 < winddirection && winddirection < 305){
        return 'W/NW'
    } else if (305 < winddirection && winddirection < 325){
        return 'NW'
    } else if (325 < winddirection && winddirection < 345){
        return 'N/NW'
    } 
}

function showTime() { 
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let session = 'AM'

    if (hours == 0) {
        hours = 12
    }

    if (hours > 12) {
        hours = hours - 12
        session = 'PM'
    }

    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds  = (seconds  < 10) ? '0' + seconds : seconds 

    let time = hours + ':' + minutes + ':' + seconds + ' ' + session
    document.getElementById('timeContainer').innerText = time
    document.getElementById('timeContainer').textContent = time

    setTimeout(showTime, 1000)
}

function showDate () {
    let date = new Date()
    let day = date.getUTCDay() + 1
    let month = date.getUTCMonth() + 1
    let year = date.getUTCFullYear()

    let today = month + '/' + day + '/' + year
    document.getElementById('dateContainer').innerText = today
}