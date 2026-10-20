export default function TaskCard({ task }) {
  return (
    <article className="rounded-md border border-slate-700 bg-surface-card p-3 hover:brightness-110">
      <h3 className="text-sm font-medium text-slate-50">{task.title}</h3>
      {task.description && <p className="mt-1 line-clamp-2 text-sm text-slate-400">{task.description}</p>}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono">{task.type}</span>
        <span>{task.assignee}</span>
        {task.dueDate && <time dateTime={task.dueDate}>Due {task.dueDate}</time>}
      </div>
    </article>
  );
}
