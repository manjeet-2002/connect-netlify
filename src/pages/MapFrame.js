import React from 'react'
import '../App.css';

const MapFrame = (props) => {

  
    const iframeData = document.getElementById("mapFrame");
    
    iframeData.src = `https://maps.google.com/maps?q=${props.lati},${props.longi}&hl=es;&output=embed`

  return (
    <div>
        <iframe id="mapFrame" height="400vh" width="100%" ></iframe>
    </div>
  )
}

export default MapFrame