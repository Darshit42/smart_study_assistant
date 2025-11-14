import { useState } from "react";
import type { MathChallenge } from "../types";

type MathChallengeCardProps = {
  mathChallenge: MathChallenge;
};

function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^(the answer is|answer:|answer is|is)\s*/i, "")
    .replace(/[.,;:!?]+$/g, "") 
    .trim();
}

function extractNumber(text: string): number | null {
  const match = text.match(/-?\d+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
}

function compareAnswers(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  if (normalizedUser === normalizedCorrect) return true;
  
  const userNum = extractNumber(normalizedUser);
  const correctNum = extractNumber(normalizedCorrect);
  
  if (userNum !== null && correctNum !== null) {
    return Math.abs(userNum - correctNum) < 0.0001;
  }
  
  const userWords = normalizedUser.split(/\s+/).filter(w => w.length > 0);
  const correctWords = normalizedCorrect.split(/\s+/).filter(w => w.length > 0);
  
  if (userWords.length > 0 && correctWords.length > 0) {
    const userNumeric = userWords.find(w => /^-?\d+\.?\d*$/.test(w));
    const correctNumeric = correctWords.find(w => /^-?\d+\.?\d*$/.test(w));
    
    if (userNumeric && correctNumeric) {
      return Math.abs(parseFloat(userNumeric) - parseFloat(correctNumeric)) < 0.0001;
    }
    
    if (userNumeric && correctNumeric && userNumeric === correctNumeric) {
      return true;
    }
  }
  
  if (normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect)) {
    if (userNum !== null && correctNum !== null) {
      return Math.abs(userNum - correctNum) < 0.0001;
    }
  }
  
  return false;
}

export default function MathChallengeCard({ mathChallenge }: MathChallengeCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    
    const correct = compareAnswers(userAnswer, mathChallenge.answer);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <section className="card">
      <h3>Challenge Problem</h3>
      <p className="math-question">{mathChallenge.question}</p>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="math-challenge-form">
          <label className="math-answer-input-group">
            <span>Your answer:</span>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="math-answer-input"
            />
          </label>
          <button type="submit" className="math-submit-btn">
            Submit Answer
          </button>
        </form>
      ) : (
        <div className="math-result">
          <div className={`math-feedback ${isCorrect ? "correct" : "incorrect"}`}>
            <strong>{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</strong>
          </div>
          <div className="math-solution">
            <p>
              <strong>Correct Answer:</strong> {mathChallenge.answer}
            </p>
            <p>{mathChallenge.explanation}</p>
          </div>
          <button onClick={handleReset} className="math-reset-btn">
            Try Again
          </button>
        </div>
      )}
    </section>
  );
}

