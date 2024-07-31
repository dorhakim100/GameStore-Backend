import React from 'react'
import GoogleMapReact from 'google-map-react'

import { Button } from '@mui/material'

import { useEffect, useState } from 'react'

const AnyReactComponent = ({ text }) => (
  <div style={{ fontSize: '4em' }}>{'🎮'}</div>
)

export function GoogleMap() {
  const MY_KEY = 'AIzaSyDQ5KeQSvNw5TD8wwuU33FviQ0QXWN3G7U'
  //   const defaultProps = {
  //     center: {
  //       lat: 32.08088,
  //       lng: 34.78057,
  //     },
  // }
  const [cords, setCords] = useState({ lat: 32.08088, lng: 34.78057 })
  const zoom = 15

  //   useEffect(() => {
  //     setCords(cord)
  //   }, [cord])

  function onSetDestination(destination) {
    switch (destination) {
      case 'telAviv':
        setCords((prevCord) => (prevCord = { lat: 32.08088, lng: 34.78057 }))
        break
      case 'herzeliya':
        setCords((prevCord) => (prevCord = { lat: 32.1624, lng: 34.8447 }))
        break
      case 'jerusalem':
        setCords((prevCord) => (prevCord = { lat: 31.7683, lng: 35.2137 }))
        break

      default:
        break
    }
  }

  return (
    // Important! Always set the container height explicitly

    <div style={{ height: '50vh', width: '50vw' }}>
      <Button variant='contained' onClick={() => onSetDestination('telAviv')}>
        Tel Aviv
      </Button>
      <Button variant='contained' onClick={() => onSetDestination('herzeliya')}>
        Herzeliya
      </Button>
      <Button variant='contained' onClick={() => onSetDestination('jerusalem')}>
        Jerusalem
      </Button>
      <GoogleMapReact
        bootstrapURLKeys={{ key: MY_KEY }}
        center={cords}
        defaultZoom={zoom}
      >
        <AnyReactComponent
          lat={cords.lat || 32.08088}
          lng={cords.lng || 34.78057}
          text='My Marker'
        />
      </GoogleMapReact>
    </div>
  )
}
