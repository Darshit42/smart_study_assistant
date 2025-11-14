import type { StudyQuizItem } from "../types";

type QuizCardProps = {
  quiz: StudyQuizItem[];
};

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <section className="card">
      <h3>Practice Quiz</h3>
      <ol className="quiz-list">
        {quiz.map((item, index) => (
          <li key={`quiz-${index}-${item.question.slice(0, 20)}`} className="quiz-item">
            <p className="quiz-question">{item.question}</p>
            <ul className="quiz-options">
              {item.options.map((option, optIndex) => (
                <li key={`option-${index}-${optIndex}`}>{option}</li>
              ))}
            </ul>
            <details className="quiz-answer">
              <summary>Reveal answer</summary>
              <p>
                <strong>Correct:</strong> {item.answer}
              </p>
              <p>{item.explanation}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}

