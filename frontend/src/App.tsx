import { type FormEvent, useCallback, useEffect, useState } from "react";
import type { StudyResponse, StudyMode } from "./types";
import { fetchStudyGuide } from "./services/api";
import { loadHistory, saveHistory } from "./utils/storage";
import Header from "./components/Header";
import StudyForm from "./components/StudyForm";
import HistoryPanel from "./components/HistoryPanel";
import LoadingCard from "./components/LoadingCard";
import ErrorCard from "./components/ErrorCard";
import Results from "./components/Results";
import "./App.css";

export default function App() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<StudyMode>("default");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [history, setHistory] = useState<string[]>(() =>
    typeof window !== "undefined" ? loadHistory() : []
  );

  const [data, setData] = useState<StudyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  const runStudyGuide = useCallback(async (inputTopic: string, targetMode: StudyMode) => {
    setLoading(true);
    setError(null);

    try {
      const payload = await fetchStudyGuide(inputTopic, targetMode);
      setData(payload);
      saveHistory(payload.topic || inputTopic);
      setHistory(loadHistory());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load study guide.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await runStudyGuide(topic, mode);
    },
    [mode, runStudyGuide, topic]
  );

  const handleHistorySelect = useCallback(
    async (previousTopic: string) => {
      setTopic(previousTopic);
      await runStudyGuide(previousTopic, mode);
    },
    [mode, runStudyGuide]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <div className="app-shell">
      <Header isDark={isDark} onToggleDarkMode={toggleDarkMode} />
      <main className="app-main">
        <StudyForm
          topic={topic}
          mode={mode}
          loading={loading}
          onTopicChange={setTopic}
          onModeChange={setMode}
          onSubmit={handleSubmit}
        />
        <HistoryPanel history={history} loading={loading} onSelectTopic={handleHistorySelect} />
        {error && <ErrorCard error={error} />}
        {loading && <LoadingCard />}
        {!loading && data && <Results data={data} />}
      </main>
    </div>
  );
}
