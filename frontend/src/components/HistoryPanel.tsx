type HistoryPanelProps = {
  history: string[];
  loading: boolean;
  onSelectTopic: (topic: string) => void;
};

export default function HistoryPanel({ history, loading, onSelectTopic }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <aside className="history-panel">
      <h2>Recent topics</h2>
      <div className="history-tags">
        {history.map((entry) => (
          <button
            key={entry}
            className="history-tag"
            onClick={() => onSelectTopic(entry)}
            disabled={loading}
          >
            {entry}
          </button>
        ))}
      </div>
    </aside>
  );
}

