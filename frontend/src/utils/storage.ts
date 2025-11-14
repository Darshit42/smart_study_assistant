const HISTORY_KEY = "smart-study-history";
const MAX_HISTORY = 6;

export function loadHistory(): string[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

export function saveHistory(topic: string) {
  const cleaned = topic.trim();
  if (!cleaned) return;
  const existing = loadHistory().filter((entry) => entry.toLowerCase() !== cleaned.toLowerCase());
  const updated = [cleaned, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

