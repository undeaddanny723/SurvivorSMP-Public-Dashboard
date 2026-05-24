export default function StatusBadge({ online, lastChecked }) {
  return (
    <span>
      {online ? 'Online' : 'Offline'} - {lastChecked}
    </span>
  );
}
