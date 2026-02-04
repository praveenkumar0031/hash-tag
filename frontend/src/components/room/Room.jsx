import React from 'react'
import { getLocalRooms } from '../../api/api'
import { useState } from 'react';
const Room = () => {
    const [rooms,setRooms]=useSatate();
    const updated={
        lng:77,
        lat:11,
        diatance:1
    }
    const getroom= getLocalRooms(updated);
    console.log(getroom)
  return (

    <div>Room</div>
  )
}

export default Room