import cloudy from "../assets/images/cloudy.png";
import sunny from "../assets/images/sunny.png";
import rainy from "../assets/images/rainy.png";
import snowy from "../assets/images/snowy.png";
import loadingGif from "../assets/images/loading.gif";
import { useState, useEffect, useRef } from "react";

const WeatherApp = () => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;

    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [lastLocation, setLastLocation] = useState('New York');
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState({ name: 'New York', state: '', country: 'US' });

    const searchRef = useRef(null);

    // Fetch weather whenever unit or lastLocation changes
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            const url = `${BASE_URL}?q=${encodeURIComponent(lastLocation)}&units=${unit}&appid=${API_KEY}`;
            try {
                const res = await fetch(url);
                const weatherData = await res.json();
                setData(weatherData);
            } catch (err) {
                console.error(err);
                setData({ notFound: true });
            }
            setLoading(false);
        };
        fetchWeather();
    }, [unit, lastLocation]);

    // Close city suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setCitySuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce helper
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch city suggestions
    const fetchCitySuggestions = async (query) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery === "") {
            setCitySuggestions([]);
            return;
        }

        try {
            const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(trimmedQuery)}&limit=5&appid=${API_KEY}`;
            const geoRes = await fetch(geoURL);
            const geoData = await geoRes.json();
            setCitySuggestions(geoData.length > 0 ? geoData : []);
        } catch (err) {
            console.error(err);
            setCitySuggestions([]);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchCitySuggestions, 300);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        debouncedFetchSuggestions(value);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            if (citySuggestions.length > 0) {
                selectCity(citySuggestions[0]);
            } else {
                setData({ notFound: true });
            }
        }
    };

    const selectCity = async (city) => {
        setCitySuggestions([]);
        setLocation('');
        setLoading(true);

        try {
            const weatherURL = `${BASE_URL}?lat=${city.lat}&lon=${city.lon}&units=${unit}&appid=${API_KEY}`;
            const res = await fetch(weatherURL);
            const weatherData = await res.json();

            if (weatherData.cod !== 200) {
                setData({ notFound: true });
            } else {
                setData(weatherData);
                setLastLocation(`${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`);
                setSelectedCity(city); // <-- save selected city for top display
            }
        } catch (err) {
            console.error(err);
            setData({ notFound: true });
        }

        setLoading(false);
    };

    const toggleUnit = (selectedUnit) => {
        if (selectedUnit !== unit) setUnit(selectedUnit);
    };

    const weatherImages = { Clear: sunny, Clouds: cloudy, Rain: rainy, Snow: snowy, Haze: cloudy, Mist: cloudy };
    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
        Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
        Snow: 'linear-gradient(to right, #aff2ff, #fff)',
        Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to right, #57d6d4, #71eeec)'
    };
    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c, #fcd283)';

    const currentDate = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${daysOfWeek[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;

    return (
        <div className="container" style={{backgroundImage}}>
            <div className="weather-app" style={{backgroundImage: backgroundImage && backgroundImage.replace ? backgroundImage.replace("to right", "to top") : null}}>

                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">
                            {selectedCity.name}{selectedCity.state ? `, ${selectedCity.state}` : `, ${selectedCity.country}`}
                        </div>
                    </div>

                    <div className="search-bar" style={{ position: "relative" }} ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <i className="fa-solid fa-magnifying-glass" onClick={() => {
                            if(citySuggestions.length > 0) selectCity(citySuggestions[0]);
                        }}></i>

                        {citySuggestions.length > 0 && (
                            <div className="city-suggestions">
                                {citySuggestions.map((city, index) => (
                                    <div
                                        key={index}
                                        className="city-suggestion"
                                        onClick={() => selectCity(city)}
                                    >
                                        {city.name}{city.state ? `, ${city.state}` : ''} ({city.country})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="loader-container">
                        <img className="loader" src={loadingGif} alt="loading" />
                    </div>
                ) : data.notFound ? (
                    <div className="not-found">City Not Found😒</div>
                ) : (
                    <>
                        <div className="weather">
                            {weatherImage && <img src={weatherImage} alt={data.weather ? data.weather[0].main : ""} />}
                            <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                            <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                        </div>

                        <div className="weather-date">
                            <p>{formattedDate}</p>
                            <div className="unit-toggle-container">
                                <button className={`unit-option ${unit === "metric" ? "active" : ""}`} onClick={() => toggleUnit("metric")}>°C</button>
                                <span className="unit-divider">|</span>
                                <button className={`unit-option ${unit === "imperial" ? "active" : ""}`} onClick={() => toggleUnit("imperial")}>°F</button>
                            </div>
                        </div>

                        <div className="weather-data">
                            <div className="humidity">
                                <div className="data-name">Humidity</div>
                                <i className="fa-solid fa-droplet"></i>
                                <div className="data">{data.main ? data.main.humidity : null}%</div>
                            </div>

                            <div className="wind">
                                <div className="data-name">Wind</div>
                                <i className="fa-solid fa-wind"></i>
                                <div className="data">{data.wind ? `${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}` : null}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;