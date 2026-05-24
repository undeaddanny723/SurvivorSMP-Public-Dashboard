export default function TopBar({ theme, onThemeToggle, serverName, isOnline }) {
  return (
    <header>
      <div>{serverName}</div>
      <div>{isOnline ? 'Online' : 'Offline'}</div>
      <button onClick={onThemeToggle}>Toggle Theme ({theme})</button>
    </header>
  );
}
