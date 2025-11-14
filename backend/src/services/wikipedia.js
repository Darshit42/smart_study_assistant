import axios from "axios";
import { WIKI_SUMMARY_API, WIKI_SEARCH_API, USER_AGENT } from "../config.js";
import { createHttpError } from "../utils/errors.js";

export function shapeSourcePayload(data) {
  const textSummary =
    data.extract ||
    data.description ||
    "No summary available. Please refine your search query.";

  return {
    title: data.title,
    description: data.description || null,
    url: data.content_urls?.desktop?.page || data.content_urls?.mobile?.page || null,
    summary: textSummary,
    image: data.thumbnail?.source || null,
  };
}

async function findClosestTopic(topic) {
  try {
    const { data } = await axios.get(`${WIKI_SEARCH_API}${encodeURIComponent(topic)}`, {
      headers: { "User-Agent": USER_AGENT },
    });

    const [_, suggestions, descriptions, links] = data;

    if (Array.isArray(suggestions) && suggestions.length > 0) {
      return suggestions[0];
    }

    if (Array.isArray(descriptions) && descriptions.length > 0) {
      return descriptions[0];
    }

    if (Array.isArray(links) && links.length > 0) {
      const url = links[0];
      if (typeof url === "string") {
        const parts = url.split("/");
        return decodeURIComponent(parts[parts.length - 1] ?? topic);
      }
    }

    return null;
  } catch (error) {
    console.error("Wikipedia search fallback error", error);
    return null;
  }
}

export async function fetchTopicContent(topic, depth = 0) {
  if (depth > 2) {
    console.log(`Wikipedia fetch reached max depth for topic: ${topic}`);
    return null;
  }

  const encodedTopic = encodeURIComponent(topic);

  try {
    const { data } = await axios.get(`${WIKI_SUMMARY_API}${encodedTopic}`, {
      headers: { "User-Agent": USER_AGENT },
    });

    return shapeSourcePayload(data);
  } catch (summaryError) {
    if (summaryError.response?.status === 404) {
      const fallbackTitle = await findClosestTopic(topic);
      if (!fallbackTitle || fallbackTitle === topic) {
        console.log(`No Wikipedia content found for topic: ${topic}, using Gemini directly`);
        return null;
      }

      return fetchTopicContent(fallbackTitle, depth + 1);
    }

    console.log(`Wikipedia fetch error for topic: ${topic}, using Gemini directly`, summaryError.message);
    return null;
  }
}

