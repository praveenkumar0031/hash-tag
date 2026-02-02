import React, { useState } from 'react';
import { setRange } from '../../api/api';
const LocationRoom=()=>{
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [localrooms, setLocalRooms] = useState([]);

  // const updateLoc=async({lng,lat})={
  //   try{
  //     const res =await setRange({lng,lat});
  //   }
      
  // }
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation}>Get My Location</button>

      {position.latitude && (
        <p>Latitude: {position.latitude}, Longitude: {position.longitude}</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};
export default LocationRoom;