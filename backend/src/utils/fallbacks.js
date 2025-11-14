import { splitIntoSentences } from "./parsers.js";

export function defaultQuizItem() {
  return {
    question: "What is the best next step after reviewing the summary?",
    options: [
      "Test yourself on the major ideas.",
      "Forget the material immediately.",
      "Study unrelated topics instead.",
      "Skip any form of practice.",
    ],
    answer: "Test yourself on the major ideas.",
    explanation: "Active recall after studying solidifies learning.",
  };
}


export function fillSummary(items) {
  const defaults = [
    "Focus on the core definition and why it matters.",
    "Identify cause-effect relationships or key mechanisms.",
    "Connect this topic with a real-world example you can remember.",
  ];

  return defaults.map((fallback, index) => items[index] || fallback);
}

export function fillQuiz(items) {
  const defaults = [
    defaultQuizItem(),
    defaultQuizItem(),
    defaultQuizItem(),
  ];

  return defaults.map((fallback, index) => {
    const item = items[index];
    if (!item?.question || !Array.isArray(item.options) || item.options.length < 2) {
      return fallback;
    }
    return {
      question: item.question,
      options: item.options.slice(0, 4),
      answer: item.answer || item.options[0],
      explanation: item.explanation || "Review the key concept to understand why this answer fits best.",
    };
  });
}

export function buildFallbackQuiz(topic, text) {
  const sentences = splitIntoSentences(text);
  const keySentence = sentences[0] || `The topic ${topic} is important for learners.`;
  const keyword = topic.split(" ")[0];

  return [
    {
      question: `Which statement best describes ${topic}?`,
      options: [keySentence, `It is unrelated to ${keyword}.`, `It describes a fictional event.`, `It only applies to sports.`],
      answer: keySentence,
      explanation: "This choice aligns with the factual summary extracted from the source content.",
    },
    {
      question: `How can ${topic} be applied in practice?`,
      options: [
        `By considering its role discussed in the summary.`,
        "By ignoring any historical context.",
        "By misrepresenting the concept intentionally.",
        "By avoiding any connection to real-life examples.",
      ],
      answer: `By considering its role discussed in the summary.`,
      explanation: "Application requires understanding the core ideas and context of the topic.",
    },
    {
      question: `What is a key takeaway about ${topic}?`,
      options: [
        `It has noteworthy implications as mentioned in the summary.`,
        "It lacks any meaningful impact.",
        "Its origins are purely fictional.",
        "It is only relevant to entertainment media.",
      ],
      answer: `It has noteworthy implications as mentioned in the summary.`,
      explanation: "The summary highlights that the topic carries significance that learners should recognize.",
    },
  ];
}

