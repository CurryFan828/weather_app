import cloudy from "../assets/images/cloudy.png"
import sunny from "../assets/images/sunny.png"
import rainy from "../assets/images/rainy.png"
import snowy from "../assets/images/snowy.png"
// import thunderstorm from "../assets/images/thunderstorm.png"
// import foggy from "../assets/images/foggy.png"
import loadingGif from "../assets/images/loading.gif"
import { useState, useEffect } from "react"


const WeatherApp = () => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // My OpenWeather Key
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;

    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() =>{
        const fetchDefaultWeather = async () => {
            setLoading(true)
            const defaultLocation = "New York"
            const url = `${BASE_URL}?q=${defaultLocation}&units=metric&appid=${API_KEY}`
            const res = await fetch(url)
            const defaultData = await res.json()
            setData(defaultData)
            setLoading(false)
        }

        fetchDefaultWeather()
    }, [])

    const search = async () => {
        if(location.trim() !== ""){
            const url = `${BASE_URL}?q=${location}&units=metric&appid=${API_KEY}`        
            const res = await fetch(url)
            const searchData = await res.json()

            if(searchData.cod !== 200) {
                setData({notFound: true})
            } else{
                setData(searchData)
                setLocation('')
            }  
            setLoading(false)          
        }
    }

    const handleInputChange = (e) => {
        setLocation(e.target.value)

    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            search()
        }
    }


    const weatherImages = {
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy
    }

    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
        Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
        Snow: 'linear-gradient(to right, #aff2ff, #fff)',
        Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to right, #57d6d4, #71eeec)'
    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c, #fcd283)'

    const currentDate = new Date()
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dayOfWeek = daysOfWeek[currentDate.getDay()]
    const month = months[currentDate.getMonth()]
    const dayOfMonth = currentDate.getDate()

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`


    return (
        <div className="container" style={{backgroundImage}}>
            <div className="weather-app" 
                style={{backgroundImage: backgroundImage && backgroundImage.replace ? backgroundImage.replace("to right", "to top") : null}}
            >
                {/* Search Bar for the weather app */}
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i> {/* this is a location icon */}
                        <div className="location">{data.name}</div>
                    </div>

                    <div className="search-bar">
                        <input type="text" placeholder="Enter Location" value={location} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i> {/* this is a search icon */}
                    </div>
                </div>

                {loading ? (<img className="loader" src={loadingGif} alt="loading" />
                ) : data.notFound ? (
                    <div className="not-found">City Not Found😒</div>
                ) : (
                    <>
                        {/* Weather Information */}
                        <div className="weather">
                            <img src={weatherImage} alt="" />
                            <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                            <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°`: null}</div>
                        </div>

                        {/* Date Information */}
                        <div className="weather-date">
                            <p>{formattedDate}</p>
                        </div>

                        {/* Weather Data such as humidity, wind speed, etc. */}
                        <div className="weather-data">
                            {/*Humidity Data*/}
                            <div className="humidity">
                                <div className="data-name">Humidity</div>
                                <i className="fa-solid fa-droplet"></i> {/* this is a humidity icon */}
                                <div className="data">{data.main ? data.main.humidity : null}%</div>
                            </div>

                            {/* Wind Speed Data */} 
                            <div className="wind">
                                <div className="data-name">Wind</div>
                                <i className="fa-solid fa-wind"></i> {/* this is a wind icon */}
                                <div className="data">{data.wind ? data.wind.speed : null} km/h</div>               
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default WeatherApp