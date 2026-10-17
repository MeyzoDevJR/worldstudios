'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);
const ToastContext = createContext(null);
const SoundContext = createContext(null);

export function AppState({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const audioRef = useRef(null);
  const lastHover = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem('ws_sound');
    const on = stored !== '0';
    enabledRef.current = on;
    setEnabled(on);
    const saved = localStorage.getItem('ws_token');
    if (!saved) {
      setReady(true);
      return;
    }
    api('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem('ws_token'))
      .finally(() => setReady(true));
  }, []);

  function push(message, type = 'ok') {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 4200);
  }

  function getCtx() {
    if (typeof window === 'undefined') return null;
    if (!audioRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioRef.current = new Ctx();
    }
    return audioRef.current;
  }

  function play(name = 'click') {
    if (!enabledRef.current) return;
    if (name === 'hover' && performance.now() - lastHover.current < 140) return;
    if (name === 'hover') lastHover.current = performance.now();
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const tone = (freq, dur, type, gain, delay = 0) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + delay);
      amp.gain.setValueAtTime(0.0001, now + delay);
      amp.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), now + delay + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.03);
    };
    if (name === 'hover') tone(1460, 0.045, 'sine', 0.012);
    else if (name === 'success') {
      tone(523.25, 0.14, 'sine', 0.045, 0);
      tone(659.25, 0.14, 'sine', 0.04, 0.09);
      tone(783.99, 0.22, 'sine', 0.05, 0.18);
    } else if (name === 'error') {
      tone(196, 0.16, 'triangle', 0.04);
      tone(146, 0.22, 'triangle', 0.035, 0.09);
    } else if (name === 'open') {
      tone(330, 0.08, 'sine', 0.025);
      tone(660, 0.12, 'sine', 0.02, 0.06);
    } else {
      tone(740, 0.055, 'sine', 0.03);
      tone(1180, 0.04, 'triangle', 0.012, 0.02);
    }
  }

  useEffect(() => {
    const onClick = (event) => {
      const target = event.target.closest('a, button, summary, [data-sound]');
      if (!target || target.dataset.sound === 'off') return;
      play(target.dataset.sound || 'click');
    };
    const onOver = (event) => {
      const target = event.target.closest('[data-sound-hover]');
      if (!target) return;
      if (event.relatedTarget && target.contains(event.relatedTarget)) return;
      play('hover');
    };
    document.addEventListener('click', onClick);
    document.addEventListener('mouseover', onOver);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  async function login(email, password) {
    const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('ws_token', data.token);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await api('/api/auth/register', { method: 'POST', body: payload });
    localStorage.setItem('ws_token', data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('ws_token');
    setUser(null);
  }

  function toggleSound() {
    if (enabledRef.current) {
      play('click');
      enabledRef.current = false;
      setEnabled(false);
      localStorage.setItem('ws_sound', '0');
      return;
    }
    enabledRef.current = true;
    setEnabled(true);
    localStorage.setItem('ws_sound', '1');
    play('success');
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      <ToastContext.Provider value={push}>
        <SoundContext.Provider value={{ enabled, toggleSound, play }}>
          {children}
          <div className="toasts" aria-live="polite">
            {toasts.map((item) => (
              <div key={item.id} className={`toast ${item.type}`}>
                {item.message}
              </div>
            ))}
          </div>
        </SoundContext.Provider>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useToast() {
  return useContext(ToastContext);
}

export function useSound() {
  return useContext(SoundContext);
}
