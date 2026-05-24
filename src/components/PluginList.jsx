export default function PluginList({ plugins }) {
  return (
    <ul>
      {plugins?.map((plugin, index) => (
        <li key={index}>{plugin}</li>
      ))}
    </ul>
  );
}
