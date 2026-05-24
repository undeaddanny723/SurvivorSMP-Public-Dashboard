export default function StatCard({ label, value, subtext, sparkData }) {
  return (
    <div>
      <div>{label}</div>
      <div>{value}</div>
      <div>{subtext}</div>
      <div className="sparkline-placeholder"></div>
    </div>
  );
}
