import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 4000;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim() || "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const WIKI_SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
export const WIKI_SEARCH_API = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=";

export const USER_AGENT = "SmartStudyAssistant/1.0 (rev@localhost)";

