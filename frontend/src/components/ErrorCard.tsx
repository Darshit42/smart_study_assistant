type ErrorCardProps = {
  error: string;
};

export default function ErrorCard({ error }: ErrorCardProps) {
  return (
    <div className="error-card" role="alert">
      <strong>We hit a snag:</strong>
      <span>{error}</span>
    </div>
  );
}
