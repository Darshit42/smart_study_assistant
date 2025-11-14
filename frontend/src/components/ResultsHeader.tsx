import type { StudyResponse } from "../types";

type ResultsHeaderProps = {
  data: StudyResponse;
};

export default function ResultsHeader({ data }: ResultsHeaderProps) {
  const sourceLink = (() => {
    if (!data.source?.url) return null;
    try {
      const url = new URL(data.source.url);
      return { label: url.hostname.replace("www.", ""), href: url.toString() };
    } catch {
      return null;
    }
  })();

  return (
    <>
      <header className="results-header">
        <div>
          <h2>{data.topic}</h2>
          {data.source?.description && (
            <p className="results-description">{data.source.description}</p>
          )}
        </div>
        {data.source?.image && (
          <img
            className="results-image"
            src={data.source.image}
            alt={data.topic}
            loading="lazy"
          />
        )}
      </header>

      {sourceLink && (
        <p className="source-link">
          Reference:{" "}
          <a href={sourceLink.href} target="_blank" rel="noreferrer">
            {sourceLink.label}
          </a>
        </p>
      )}
    </>
  );
}

