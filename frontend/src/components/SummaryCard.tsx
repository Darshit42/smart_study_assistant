type SummaryCardProps = {
  summary: string[];
};

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <section className="card">
      <h3>Key Takeaways</h3>
      <ul className="summary-list">
        {summary.map((item, index) => {
          const key = `${index}-${item.slice(0, 12)}`;
          return <li key={key}>{item}</li>;
        })}
      </ul>
    </section>
  );
}

