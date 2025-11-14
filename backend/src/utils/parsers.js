export function parseJsonFromText(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini returned a non-JSON response.");
  }

  const jsonString = text.slice(start, end + 1);
  return JSON.parse(jsonString);
}

export function splitIntoSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/[.?!]\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => (sentence.endsWith(".") ? sentence : `${sentence}.`));
}

