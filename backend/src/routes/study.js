import { fetchTopicContent } from "../services/wikipedia.js";
import { generateStudyContent } from "../services/contentGenerator.js";

export function setupStudyRoute(app) {
  app.get("/study", async (req, res) => {
    const topic = (req.query.topic || "").toString().trim();
    const mode = (req.query.mode || "").toString().toLowerCase();

    if (!topic) {
      return res.status(400).json({
        error: "parameter: topic is missing",
      });
    }

    try {
      const source = await fetchTopicContent(topic);
      const aiContent = await generateStudyContent(topic, source, mode);

      const sourceData = source;

      res.json({
        topic: sourceData.title ?? topic,
        source: sourceData,
        summary: aiContent.summary,
        quiz: aiContent.quiz,
        studyTip: aiContent.studyTip,
        mathChallenge: aiContent.mathChallenge ?? null,
      });
    } catch (error) {
      console.error("Error in /study:", error);
      res.status(error.statusCode || 500).json({
        error:
          error.message ||
          "Unexpected error while generating study materials. Please try again later.",
      });
    }
  });
}
