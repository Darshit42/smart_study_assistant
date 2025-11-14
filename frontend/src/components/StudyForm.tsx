import type { FormEvent } from "react";
import type { StudyMode } from "../types";

type StudyFormProps = {
  topic: string;
  mode: StudyMode;
  loading: boolean;
  onTopicChange: (topic: string) => void;
  onModeChange: (mode: StudyMode) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function StudyForm({
  topic,
  mode,
  loading,
  onTopicChange,
  onModeChange,
  onSubmit,
}: StudyFormProps) {
  return (
    <form className="query-form" onSubmit={onSubmit}>
      <label className="input-group">
        <span className="label-text">Study topic</span>
        <input
          type="text"
          name="topic"
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder="e.g., Photosynthesis, World War II, Quantum Computing..."
          autoComplete="off"
          disabled={loading}
          required
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={mode === "math"}
          onChange={(event) => onModeChange(event.target.checked ? "math" : "default")}
          disabled={loading}
        />
        <span>Include problem-solving challenge (math/logic mode)</span>
      </label>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Generating..." : "Generate Study Guide"}
      </button>
    </form>
  );
}

