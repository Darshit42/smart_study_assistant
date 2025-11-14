import type { StudyResponse, StudyMode } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

export async function fetchStudyGuide(topic: string, mode: StudyMode): Promise<StudyResponse> {
  const trimmedTopic = topic.trim();
  if (!trimmedTopic) {
    throw new Error("Please enter a topic to explore.");
  }

  const params = new URLSearchParams({ topic: trimmedTopic });
  if (mode === "math") {
    params.append("mode", "math");
  }

  const response = await fetch(`${API_BASE}/study?${params.toString()}`);
  
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed with status ${response.status}.`);
  }

  return await response.json();
}

export function getApiBaseUrl(): string {
  return API_BASE;
}

