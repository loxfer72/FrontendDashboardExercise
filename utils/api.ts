import { API_BASE } from "./constants";

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

export const api = {
  getTools: () =>
    fetchAPI<Tool[]>("/tools"),
  getRecentTools: () =>
    fetchAPI<Tool[]>("/tools?_sort=updated_at&_order=desc"),
  getToolsByStatus: (status: string) =>
    fetchAPI<Tool[]>(`/tools?status=${status}`),
  getDepartments: () =>
    fetchAPI<Department[]>("/departments"),
  getAnalytics: async (): Promise<Analytics> => {
    const data = await fetchAPI<Analytics | Analytics[]>("/analytics");
    return Array.isArray(data) ? data[0] : data;
  },
  getUsers: (params = "") =>
    fetchAPI<User[]>(`/users${params}`),
};

// Import types inline pour éviter un import circular
import type { Tool, Department, User, Analytics } from "@/types";