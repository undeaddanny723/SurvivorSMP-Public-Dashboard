export default function PluginList({ plugins }) {
  return (
    <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
      {plugins?.map((plugin, index) => (
        <li
          key={index}
          className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-xs font-semibold tracking-wide transition-colors"
        >
          {plugin}
        </li>
      ))}
    </ul>
  );
}
