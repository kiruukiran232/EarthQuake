import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const EarthquakeMap = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        setEarthquakes(response.data.features);
      } catch (error) {
        setError('Failed to fetch earthquake data');
      } finally {
        setLoading(false);
      }
    };
    fetchEarthquakes();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {earthquakes.map((quake) => {
        const { id, properties, geometry } = quake;
        const { mag, place } = properties;
        const [lng, lat] = geometry.coordinates;

        return (
          <Marker key={id} position={[lat, lng]}>
            <Popup>
              <strong>Magnitude: {mag}</strong><br />
              Location: {place}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
export default EarthquakeMap;