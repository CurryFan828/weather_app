import cloudy from "../assets/images/cloudy.png"
import sunny from "../assets/images/sunny.png"
import rainy from "../assets/images/rainy.png"
import snowy from "../assets/images/snowy.png"
// import thunderstorm from "../assets/images/thunderstorm.png"
// import foggy from "../assets/images/foggy.png"


const WeatherApp = () => {
  return (
    <div className="container">
        <div className="weather-app">
            {/* Search Bar for the weather app */}
            <div className="search">
                <div className="search-top">
                    <i className="fa-solid fa-location-dot"></i> {/* this is a location icon */}
                    <div className="location">London</div>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Enter Location" />
                    <i className="fa-solid fa-magnifying-glass"></i> {/* this is a search icon */}
                </div>
            </div>

            {/* Weather Information */}
            <div className="weather">
                <img src={sunny} alt="Sunny" />
                <div className="weather-type">Clear</div>
                <div className="temp">28°C</div>
            </div>

            {/* Date Information */}
            <div className="weather-date">
                <p>Mon, 23 Feb</p>
            </div>

            {/* Weather Data such as humidity, wind speed, etc. */}
            <div className="weather-data">
                {/*Humidity Data*/}
                <div className="humidity">
                    <div className="data-name">Humidity</div>
                    <i className="fa-solid fa-droplet"></i> {/* this is a humidity icon */}
                    <div className="data">35%</div>
                </div>

                {/* Wind Speed Data */} 
                <div className="wind">
                    <div className="data-name">Wind</div>
                    <i className="fa-solid fa-wind"></i> {/* this is a wind icon */}
                     <div className="data">3 km/h</div>               
                </div>
            </div>
        </div>
    </div>
  )
}

export default WeatherApp