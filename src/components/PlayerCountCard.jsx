export default function PlayerCountCard({ online, max, previousCount }) {
  return (
    <div>
      <div>Count: {online}</div>
      <div>Max: {max}</div>
      <div>Delta: {online - previousCount}</div>
    </div>
  );
}
