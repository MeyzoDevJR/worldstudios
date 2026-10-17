const base = () => {
  const remote = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && remote.startsWith('http://')) {
    return '/ws-api';
  }
  return remote.replace(/\/$/, '');
};

function token() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('ws_token') || '';
}

async function parse(res) {
  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) return null;
  return res.json();
}

export async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${base()}${path}`, {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Connexion au serveur impossible. Vérifie que le bot est lancé.');
  }
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.error || 'Une erreur est survenue.');
  return data;
}

export async function apiForm(path, form) {
  let res;
  try {
    res = await fetch(`${base()}${path}`, {
      method: 'POST',
      cache: 'no-store',
      headers: token() ? { Authorization: `Bearer ${token()}` } : {},
      body: form,
    });
  } catch {
    throw new Error('Connexion au serveur impossible.');
  }
  const data = await parse(res);
  if (!res.ok) throw new Error(data?.error || 'Une erreur est survenue.');
  return data;
}

export async function downloadBase() {
  let res;
  try {
    res = await fetch(`${base()}/api/me/download`, {
      cache: 'no-store',
      headers: token() ? { Authorization: `Bearer ${token()}` } : {},
    });
  } catch {
    throw new Error('Connexion au serveur impossible.');
  }
  const type = res.headers.get('content-type') || '';
  if (!res.ok) {
    const data = type.includes('application/json') ? await res.json() : null;
    throw new Error(data?.error || 'Téléchargement impossible.');
  }
  if (type.includes('application/json')) {
    const data = await res.json();
    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
      return;
    }
  }
  const blob = await res.blob();
  const match = (res.headers.get('content-disposition') || '').match(/filename="?([^"]+)"?/);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = match?.[1] || 'worldstudios-base.zip';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}

export function euro(cents) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100);
}

export function when(ts, empty = '—') {
  if (!ts) return empty;
  return new Date(ts).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}
