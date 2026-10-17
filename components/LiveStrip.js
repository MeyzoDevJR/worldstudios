'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function LiveStrip() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    Promise.all([api('/api/health'), api('/api/public/config').catch(() => null)])
      .then(([health, config]) => setInfo({ ...config, health }))
      .catch(() => setInfo(null));
  }, []);

  return (
    <div className="live">
      <span className={info?.health?.ok ? 'dot on' : 'dot'} />
      <span>
        {info?.health?.ok ? 'Bot relié · clé créée sur le bot' : 'Bot injoignable'}
        {info?.version ? ` · base v${info.version.version}` : ''}
      </span>
    </div>
  );
}
