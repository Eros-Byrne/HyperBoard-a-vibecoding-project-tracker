import { STAGES } from '../model.js';
import TaskCard from './TaskCard.jsx';

export default function Board({ tasks, members, onOpen, onHandOff }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STAGES.map((stage) => {
        const columnTasks = tasks.filter((t) => t.status === stage.id);
        return (
          <section
            key={stage.id}
            aria-labelledby={`col-${stage.id}`}
            className="flex min-h-[16rem] flex-col rounded-lg bg-slate-900/60 p-3"
          >
            <h2 id={`col-${stage.id}`} className="mb-3 flex items-center justify-between text-base font-semibold uppercase tracking-wide text-slate-300">
              {stage.label}
              <span className="font-mono text-xs text-slate-400" aria-label={`${columnTasks.length} tasks`}>
                {columnTasks.length}
              </span>
            </h2>
            {columnTasks.length ? (
              <ul className="space-y-3">
                {columnTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} members={members} onOpen={onOpen} onHandOff={onHandOff} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-700 p-4 text-center text-sm text-slate-400">
                All clear. Ready for next steps.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
