export type StudyQuizItem = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type MathChallenge = {
  question: string;
  answer: string;
  explanation: string;
};

export type StudyResponse = {
  topic: string;
  source: {
    title?: string;
    description?: string | null;
    url?: string | null;
    summary?: string;
    image?: string | null;
  };
  summary: string[];
  quiz: StudyQuizItem[];
  studyTip: string;
  mathChallenge?: MathChallenge | null;
};

export type StudyMode = "default" | "math";

