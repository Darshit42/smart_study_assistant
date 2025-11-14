import { generateContent, isGeminiAvailable } from "./gemini.js";

function buildPrompt(topic, referenceSummary, isMathMode) {
  if (referenceSummary) {
    const jsonExample = isMathMode
      ? `{
  "summary": [
    "First key concept about the topic",
    "Second important point to remember",
    "Third essential detail or application"
  ],
  "quiz": [
    {
      "question": "What is a key aspect of this topic?",
      "options": [
        "Correct answer option",
        "Incorrect distractor option",
        "Another incorrect option",
        "Third incorrect option"
      ],
      "answer": "Correct answer option",
      "explanation": "Brief explanation of why this is correct."
    },
    {
      "question": "Another question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation for this answer."
    },
    {
      "question": "Third question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Explanation for this answer."
    }
  ],
  "studyTip": "A specific actionable learning strategy for this topic",
  "mathChallenge": {
    "question": "A quantitative problem or logic puzzle",
    "answer": "The numerical or logical answer",
    "explanation": "Step-by-step solution explanation"
  }
}`
      : `{
  "summary": [
    "First key concept about the topic",
    "Second important point to remember",
    "Third essential detail or application"
  ],
  "quiz": [
    {
      "question": "What is a key aspect of this topic?",
      "options": [
        "Correct answer option",
        "Incorrect distractor option",
        "Another incorrect option",
        "Third incorrect option"
      ],
      "answer": "Correct answer option",
      "explanation": "Brief explanation of why this is correct."
    },
    {
      "question": "Another question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation for this answer."
    },
    {
      "question": "Third question about the topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Explanation for this answer."
    }
  ],
  "studyTip": "A specific actionable learning strategy for this topic"
}`;

    return `
You are assisting a student studying the topic "${topic}".

Reference Summary:
${referenceSummary}

Please produce a JSON object with the following keys:
- "summary": array of exactly three concise bullet strings (max 25 words each).
- "quiz": array of exactly three multiple-choice questions. Each question must include:
    * "question": the question text,
    * "options": array of four answer options,
    * "answer": the correct option text (must match one of the provided options),
    * "explanation": 1-2 sentence justification.
- "studyTip": one actionable learning strategy tailored to the topic.
${
  isMathMode
    ? '- "mathChallenge": object with keys "question", "answer", "explanation" for a quantitative or logic challenge linked to the topic.'
    : '- Omit the key "mathChallenge".'
}

Expected JSON structure:
${jsonExample}

Respond with JSON only. Do not include markdown, commentary, or extra fields.`;
  } else {
    const jsonExample = isMathMode
      ? `{
  "summary": [
    "First key concept about ${topic}",
    "Second important point to remember",
    "Third essential detail or application"
  ],
  "quiz": [
    {
      "question": "What is a key aspect of ${topic}?",
      "options": [
        "Correct answer option",
        "Incorrect distractor option",
        "Another incorrect option",
        "Third incorrect option"
      ],
      "answer": "Correct answer option",
      "explanation": "Brief explanation of why this is correct."
    },
    {
      "question": "Another question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation for this answer."
    },
    {
      "question": "Third question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Explanation for this answer."
    }
  ],
  "studyTip": "A specific actionable learning strategy for ${topic}",
  "mathChallenge": {
    "question": "A quantitative problem or logic puzzle related to ${topic}",
    "answer": "The numerical or logical answer",
    "explanation": "Step-by-step solution explanation"
  }
}`
      : `{
  "summary": [
    "First key concept about ${topic}",
    "Second important point to remember",
    "Third essential detail or application"
  ],
  "quiz": [
    {
      "question": "What is a key aspect of ${topic}?",
      "options": [
        "Correct answer option",
        "Incorrect distractor option",
        "Another incorrect option",
        "Third incorrect option"
      ],
      "answer": "Correct answer option",
      "explanation": "Brief explanation of why this is correct."
    },
    {
      "question": "Another question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation for this answer."
    },
    {
      "question": "Third question about ${topic}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "explanation": "Explanation for this answer."
    }
  ],
  "studyTip": "A specific actionable learning strategy for ${topic}"
}`;

    return `
You are an expert educational assistant. A student wants to learn about: "${topic}"

Generate comprehensive, accurate study materials for this topic. Use your knowledge to create educational content.

Produce a JSON object with the following keys:
- "summary": array of exactly three concise bullet strings (max 25 words each) that explain key concepts, definitions, or important points about "${topic}".
- "quiz": array of exactly three multiple-choice questions that test understanding of "${topic}". Each question must include:
    * "question": a clear question text about "${topic}",
    * "options": array of exactly four answer options (one correct, three plausible distractors),
    * "answer": the correct option text (must exactly match one of the provided options),
    * "explanation": 1-2 sentence explanation of why the answer is correct.
- "studyTip": one specific, actionable learning strategy or study technique tailored to help students master "${topic}".
${
  isMathMode
    ? '- "mathChallenge": object with keys "question" (a quantitative problem or logic puzzle related to "${topic}"), "answer" (the numerical or logical answer), "explanation" (step-by-step solution).'
    : '- Omit the key "mathChallenge".'
}

Expected JSON structure:
${jsonExample}

Make the content educational, accurate, and directly relevant to "${topic}". Respond with JSON only. Do not include markdown code blocks, commentary, or extra fields.`;
  }
}

function normalizeAiPayload(parsed, isMathMode) {
  const summary = parsed.summary ? parsed.summary.slice(0, 3) : [];

  const quiz = parsed.quiz ? parsed.quiz.slice(0, 3).map((q) => ({
        question: q.question,
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : [],
        answer: q.answer,
        explanation: q.explanation,
      })) : [];

  return {
    summary,
    quiz,
    studyTip: parsed.studyTip || null,
    mathChallenge: isMathMode
      ? parsed.mathChallenge : null,
  };
}

export async function generateStudyContent(topic, source, mode) {
  const isMathMode = mode === "math";

  const hasNoSource = !source || !source.summary;
  
  if (hasNoSource && !isGeminiAvailable()) {
    throw new Error("Gemini API key is required to generate study materials for topics without Wikipedia content. Please configure GEMINI_API_KEY.");
  }

  const referenceSummary = source?.summary || null;
  const prompt = buildPrompt(topic, referenceSummary, isMathMode);

  try {
    const parsed = await generateContent(prompt);
    return normalizeAiPayload(parsed, isMathMode);
  } catch (error) {
    console.error("AI generation error", error);
    throw new Error(`Failed to generate study materials: ${error.message}. Please try again or check your Gemini API configuration.`);
  }
}

