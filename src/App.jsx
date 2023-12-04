import React, { useState, useEffect } from 'react'
import Forecast from './Forecast'
import WeatherNow from './WeatherNow'
import MapComponent from './Maps'

function App() {
  const apikey = '5H5xBZhwwfzX079Wmgzi2AYfDki2vH9v1yFFS5_9rC0'
  return (
    <div className="App">
      <WeatherNow />
      {/* <MapComponent /> */}
      {/* <Forecast apikey={apikey} /> */}
    </div>
  )
}

export default App