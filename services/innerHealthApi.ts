import axios from "axios";

const BASE_URL = "https://rm98036.administradorlinux.com.br:8443/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

async function handle<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (error: any) {
    console.error("API ERROR:", error?.response?.data || error.message);
    throw error;
  }
}

/* ============================================================
   TIPAGENS
============================================================ */

export interface DailyResponse {
  total: number;
  items: any[];
}

export interface WeekResponse {
  week: string;
  total: number;
  items: any[];
}

/* ============================================================
   MEDITATION (ROTAS CORRETAS)
============================================================ */

export const MeditationAPI = {
  getToday: async () => handle(api.get("/meditation/today")),
  getWeek: async () => handle(api.get("/meditation/week")),
  create: async (minutes: number) =>
    handle(api.post("/meditation", { minutes })),
  update: async (id: number, minutes: number) =>
    handle(api.put(`/meditation/${id}`, { minutes })),
  remove: async (id: number) =>
    handle(api.delete(`/meditation/${id}`)),
};

/* ============================================================
   PHYSICAL ACTIVITY
============================================================ */

export const PhysicalActivityAPI = {
  getToday: async () => handle(api.get("/physical-activity/today")),
  getWeek: async () => handle(api.get("/physical-activity/week")),
  create: async (minutes: number) =>
    handle(api.post("/physical-activity", { minutes })),
  update: async (id: number, minutes: number) =>
    handle(api.put(`/physical-activity/${id}`, { minutes })),
  remove: async (id: number) =>
    handle(api.delete(`/physical-activity/${id}`)),
};

/* ============================================================
   SLEEP
============================================================ */

export const SleepAPI = {
  getToday: async () => handle(api.get("/sleep/today")),
  getWeek: async () => handle(api.get("/sleep/week")),
  create: async (hours: number) => handle(api.post("/sleep", { hours })),
  update: async (id: number, hours: number) =>
    handle(api.put(`/sleep/${id}`, { hours })),
  remove: async (id: number) => handle(api.delete(`/sleep/${id}`)),
};

/* ============================================================
   SUNLIGHT
============================================================ */

export const SunlightAPI = {
  getToday: async () => handle(api.get("/sunlight/today")),
  getWeek: async () => handle(api.get("/sunlight/week")),
  create: async (minutes: number) =>
    handle(api.post("/sunlight", { minutes })),
  update: async (id: number, minutes: number) =>
    handle(api.put(`/sunlight/${id}`, { minutes })),
  remove: async (id: number) => handle(api.delete(`/sunlight/${id}`)),
};

/* ============================================================
   WATER
============================================================ */

export const WaterAPI = {
  getToday: async () => handle(api.get("/water/today")),
  getWeek: async () => handle(api.get("/water/week")),
  create: async (ml: number) => handle(api.post("/water", { ml })),
  update: async (id: number, ml: number) =>
    handle(api.put(`/water/${id}`, { ml })),
  remove: async (id: number) => handle(api.delete(`/water/${id}`)),
};

/* ============================================================
   TASKS
============================================================ */

export const TaskAPI = {
  getToday: async () => handle(api.get("/tasks/today")),
  getAll: async () => handle(api.get("/tasks")),
  create: async (name: string) => handle(api.post("/tasks", { name })),
  update: async (id: number, data: any) =>
    handle(api.put(`/tasks/${id}`, data)),
  remove: async (id: number) => handle(api.delete(`/tasks/${id}`)),
};

/* ============================================================
   USER PROFILE
============================================================ */

export const UserProfileAPI = {
  get: async () => handle(api.get("/profile")),
  update: async (data: any) => handle(api.put("/profile", data)),
};

/* ============================================================
   HOME
============================================================ */

export const HomeAPI = {
  overview: async () => handle(api.get("/home")),
};
