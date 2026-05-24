export default function LocationCard({ country, countryCode, city, region, isp, timezone, lat, lon }) {
  return (
    <div>
      <div>Country: {country} ({countryCode})</div>
      <div>City: {city}</div>
      <div>Region: {region}</div>
      <div>ISP: {isp}</div>
      <div>Timezone: {timezone}</div>
      <div>Latitude: {lat}</div>
      <div>Longitude: {lon}</div>
    </div>
  );
}
