import { useState } from 'react'


function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [cityname, setCityname] = useState('')
  const [loading, setLoading] = useState(false)
  const [weathercode, setWeathercode] = useState('')
  const handleinput = (e) => {
    setCity(e.target.value)
  }
  const handlesearch = () => {
    if (city === '') {
      alert("Please enter a city name")
    } else {
      alert(`Searching for weather in ${city}`)
    }
  }

  const getWeather = async () => {
    setLoading(true)
    setWeather(null)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();
    if (geoData.results.length === 0) {
      alert("City not found");
      setLoading(false);
      return;
    }
    const { latitude, longitude } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();

    const { temperature, windspeed, weathercode } = weatherData.current_weather;
    setWeather({ temperature, windspeed, weathercode });
    if (weathercode === 0) {
      setWeathercode('Clear Sky')
    } else if (weathercode === 1) {
      setWeathercode('Partly Cloudy')
    } else if (weathercode === 2) {
      setWeathercode('Overcast')
    } else if (weathercode === 3) {
      setWeathercode('Rain')
    } else if (weathercode === 4) {
      setWeathercode('Snow')
    }
    setCity('');
    setCityname(geoData.results[0].name);
    setLoading(false);
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-slate-900 to-slate-500">
        <h1 className="text-6xl font-mono p-2 m-4 font-bold">Weather app</h1>
        <div className="flex m-4 items-center justify-center">
          <input className=" border-2 m-4 p-2 rounded-2xl w-96 bg-transparent text-slate-900 font-mono font-bold" type="text" placeholder='Enter City Name' value={city} onChange={handleinput} />
          <button className="border-2 p-2 rounded-2xl bg-slate-900 text-white" onClick={getWeather}>Get Weather</button>        </div>

        <div className="flex flex-col items-center justify-center">
          {/* {loading && <p className="text-xl font-bold">Loading...</p>} */}
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900 mt-4"></div>
          )}

          {weather && (
            <div className="border-2 p-4 rounded-2xl m-4 text-slate-200">
              <h2 className="text-xl text-slate-900 font-bold">Weather in {cityname}</h2>
              <p>Temperature: {weather.temperature}°C</p>
              <p>Wind Speed: {weather.windspeed} km/h</p>
              <p>Weather Code: {weathercode}</p>
            </div>
          )}
        </div>
      </div>
        <footer className='flex flex-col items-center justify-center bg-slate-900 text-white'>
          <p className="text-sm font-mono font-bold">Made with ❤️ by Aditya Modani </p>
          <p className="text-sm font-mono font-bold">Data from Open Meteo API</p>
        </footer>
    </>
  )
}

export default App
