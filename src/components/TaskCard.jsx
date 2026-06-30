export function TaskCard({ task, onEdit, onDelete }) {
  const statusConfig = {
    todo: {
      label: "Belum Dimulai",
      color: "#6b7280",
    },
    in_progress: {
      label: "Sedang Dikerjakan",
      color: "#2563eb",
    },
    done: {
      label: "Selesai",
      color: "#16a34a",
    },
  };

  const priorityConfig = {
    low: {
      label: "Rendah",
      color: "#6b7280",
    },
    medium: {
      label: "Sedang",
      color: "#d97706",
    },
    high: {
      label: "Tinggi",
      color: "#dc2626",
    },
  };

const status = (task.status || "").toLowerCase();
const priority = (task.priority || "").toLowerCase();

const s = statusConfig[status] || statusConfig.todo;
const p = priorityConfig[priority] || priorityConfig.medium;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
          >
            ✏️
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="btn-icon"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-card-footer">
        <span
          className="badge"
          style={{ backgroundColor: s.color }}
        >
          {s.label}
        </span>

        <span
          className="badge-outline"
          style={{
            borderColor: p.color,
            color: p.color,
          }}
        >
          {p.label}
        </span>

        {task.dueDate && (
          <span className="due-date">
            📅{" "}
            {new Date(task.dueDate).toLocaleDateString(
              "id-ID"
            )}
          </span>
        )}
      </div>
    </div>
  );
}