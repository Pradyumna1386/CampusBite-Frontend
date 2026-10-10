/*
 * Demo authentication for CampusBite (academic project, NOT production security).
 *
 * - The active session is kept in sessionStorage, so it belongs to the current
 *   browser tab only. Each tab keeps its own session: logging in as admin in
 *   one tab does not replace a student session in another tab, and closing the
 *   tab ends its session. Refreshing a tab restores that tab's session.
 * - Only email, name and role are stored in sessionStorage. Passwords are
 *   never persisted to sessionStorage.
 * - Registered student accounts are still kept in localStorage, so a freshly
 *   registered account remains usable after a refresh or a browser restart
 *   even though the session itself does not.
 * - onSessionChange lets in-app state (the cart) re-key itself whenever the
 *   current session changes, without polling sessionStorage.
 */
const USERS_KEY = 'campusbite_users';
const SESSION_KEY = 'campusbite_session';

const demo = [
  { email: 'admin@campusbite.com', password: 'admin123', name: 'Canteen Admin', role: 'ADMIN' },
  { email: 'student@campusbite.com', password: 'student123', name: 'Demo Student', role: 'STUDENT' }
];

/* ---------------- registered students (localStorage) ---------------- */
export function users() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (err) {
    return [];
  }
}

export function register(name, email, password) {
  if ([...demo, ...users()].some((x) => x.email === email)) {
    throw new Error('Email already registered.');
  }
  const list = users();
  list.push({ name, email, password, role: 'STUDENT' });
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

/* ---------------- active session (sessionStorage, per tab) ---------------- */
export function login(email, password) {
  const user = [...demo, ...users()].find((x) => x.email === email && x.password === password);
  if (!user) throw new Error('Invalid email or password.');
  const session = { email: user.email, name: user.name, role: user.role };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notify();
  return session;
}

export function currentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch (err) {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  notify();
}

/* ---------------- small change notifier for in-app listeners ---------------- */
const listeners = new Set();

export function onSessionChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      /* a single bad listener must never break the others */
    }
  });
}