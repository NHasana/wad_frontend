import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";

export function useRealTimeTasks(setTasks) {
  const { socket } = useSocket();
  const { addToast } = useNotif();

  useEffect(() => {
    if (!socket) return;

    // ================= CREATE =================
    socket.on("task:created", ({ task }) => {
      setTasks((prev) => {
        const exists = prev.some((t) => t.id === task.id);
        if (exists) return prev;
        return [task, ...prev];
      });

      addToast({
        type: "SUCCESS",
        title: "Task Baru",
        message: `"${task.title}" berhasil ditambahkan`,
      });
    });

    // ================= UPDATE =================
    socket.on("task:updated", ({ task }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? task : t))
      );

      addToast({
        type: "INFO",
        title: "Task Diperbarui",
        message: `"${task.title}" telah diperbarui`,
      });
    });

    // ================= DELETE =================
    socket.on("task:deleted", ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      addToast({
        type: "WARNING",
        title: "Task Dihapus",
        message: "Satu task telah dihapus",
      });
    });

    // ================= PERSONAL NOTIFICATION =================
    socket.on("notification", (notif) => {
      addToast({
        type: notif.type,
        title: notif.title,
        message: notif.message,
      });
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("notification");
    };
  }, [socket, setTasks, addToast]);
}