type StudyTipCardProps = {
  studyTip: string;
};

export default function StudyTipCard({ studyTip }: StudyTipCardProps) {
  return (
    <section className="card">
      <h3>Study Tip</h3>
      <p>{studyTip}</p>
    </section>
  );
}

