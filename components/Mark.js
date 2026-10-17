export function Mark({ className = 'mark' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="ws-blade" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#f7fff9" />
          <stop offset="42%" stopColor="#b9ffd8" />
          <stop offset="100%" stopColor="#3ee6a2" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ws-blade)" strokeWidth="11" strokeLinecap="round">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path key={deg} d="M62 16 A30 30 0 0 1 88 44" transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}
