import type { StudyResponse } from "../types";
import ResultsHeader from "./ResultsHeader";
import SummaryCard from "./SummaryCard";
import QuizCard from "./QuizCard";
import StudyTipCard from "./StudyTipCard";
import MathChallengeCard from "./MathChallengeCard";

type ResultsProps = {
  data: StudyResponse;
};

export default function Results({ data }: ResultsProps) {
  return (
    <section className="results">
      <ResultsHeader data={data} />
      <SummaryCard summary={data.summary} />
      <QuizCard quiz={data.quiz} />
      <StudyTipCard studyTip={data.studyTip} />
      {data.mathChallenge && <MathChallengeCard mathChallenge={data.mathChallenge} />}
    </section>
  );
}

