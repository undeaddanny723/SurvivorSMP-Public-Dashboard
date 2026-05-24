export default function IncidentLog({ incidents }) {
  return (
    <ul>
      {incidents?.map((incident, index) => (
        <li key={index}>{incident}</li>
      ))}
    </ul>
  );
}
