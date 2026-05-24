export default function Sidebar({ activePage, onNavigate }) {
  return (
    <nav>
      <button onClick={() => onNavigate('Overview')}>Overview</button>
      <button onClick={() => onNavigate('Players')}>Players</button>
      <button onClick={() => onNavigate('Analytics')}>Analytics</button>
      <button onClick={() => onNavigate('ServerInfo')}>ServerInfo</button>
    </nav>
  );
}
