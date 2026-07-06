import api from "../lib/axios";

export const taskService = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/api/v1/tasks", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/api/v1/tasks/${id}`);
    return data.data;
  },

  create: async (taskData) => {
    const { data } = await api.post("/api/v1/tasks", taskData);
    return data.data;
  },

  update: async (id, taskData) => {
    const { data } = await api.patch(`/api/v1/tasks/${id}`, taskData);
    return data.data;
  },

  remove: async (id) => {
    await api.delete(`/api/v1/tasks/${id}`);
  },
};