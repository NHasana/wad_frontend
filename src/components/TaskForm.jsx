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
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        status: (initialData.status || "TODO").toUpperCase(),
        priority: (initialData.priority || "MEDIUM").toUpperCase(),
        dueDate: initialData.dueDate
          ? initialData.dueDate.substring(0, 10)
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      });
    }
  }, [initialData, reset]);

  const submitForm = (data) => {
    const payload = {
      ...data,
      status: data.status.toUpperCase(),
      priority: data.priority.toUpperCase(),
      dueDate: data.dueDate || null,
    };
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
                <option value="TODO">Belum Dimulai</option>
                <option value="IN_PROGRESS">
                  Sedang Dikerjakan
                </option>
                <option value="DONE">Selesai</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioritas</label>
              <select {...register("priority")}>
                <option value="LOW">Rendah</option>
                <option value="MEDIUM">Sedang</option>
                <option value="HIGH">Tinggi</option>
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
