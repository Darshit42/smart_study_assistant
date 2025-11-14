type HeaderProps = {
  isDark: boolean;
  onToggleDarkMode: () => void;
};

export default function Header({ isDark, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1>Smart Study Assistant</h1>
        <p className="tagline">Generate tailored study summaries, quizzes, and tips with AI.</p>
      </div>
      <button className="mode-toggle" onClick={onToggleDarkMode} aria-label="Toggle color mode">
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}

