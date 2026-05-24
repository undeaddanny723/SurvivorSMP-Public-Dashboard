export default function ServerInfoCard({ version, software, motd, icon, authMode, latency, mods }) {
  return (
    <div>
      <div>Version: {version}</div>
      <div>Software: {software}</div>
      <div>MOTD: {motd}</div>
      <div>Icon: {icon}</div>
      <div>Auth Mode: {authMode}</div>
      <div>Latency: {latency}</div>
      <div>Mods: {mods}</div>
    </div>
  );
}
