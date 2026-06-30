import { useForm } from "react-hook-form";
import { useEffect } from "react";

export function TaskForm({
  onSubmit,
  onCancel,
  initialData = null,
}) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        status: (initialData.status || "todo").toLowerCase(),
        priority: (initialData.priority || "medium").toLowerCase(),
        dueDate: initialData.dueDate
          ? initialData.dueDate.substring(0, 10)
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    }
  }, [initialData, reset]);

  const submitForm = (data) => {
    const payload = {
      ...data,
      status: data.status.toLowerCase(),
      priority: data.priority.toLowerCase(),
      dueDate: data.dueDate || null,
    };

    console.log("DATA DIKIRIM:", payload);

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{isEdit ? "Edit Task" : "Buat Task Baru"}</h2>

        <form onSubmit={handleSubmit(submitForm)}>
          <div className="form-group">
            <label>Judul *</label>
            <input
              {...register("title", {
                required: "Judul wajib diisi",
              })}
            />
            {errors.title && (
              <span className="error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select {...register("status")}>
                <option value="todo">Belum Dimulai</option>
                <option value="in_progress">
                  Sedang Dikerjakan
                </option>
                <option value="done">Selesai</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioritas</label>
              <select {...register("priority")}>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tenggat Waktu</label>
            <input
              type="date"
              {...register("dueDate")}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Buat Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}