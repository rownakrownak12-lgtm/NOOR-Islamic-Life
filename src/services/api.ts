import { Speaker, Imam, Khutbah, Dua, Reminder, AppSettings } from '../types/islamic';
import { initialSpeakers, initialImams, initialKhutbahs, initialDuas, initialReminders, initialSettings } from '../data/initialData';

const TOKEN_KEY = 'noor_admin_token';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Speakers
export async function fetchSpeakers(): Promise<Speaker[]> {
  try {
    const res = await fetch('/api/speakers');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback:', err);
    const cached = localStorage.getItem('noor_speakers');
    return cached ? JSON.parse(cached) : initialSpeakers;
  }
}

export async function createSpeaker(data: Omit<Speaker, 'id'>): Promise<Speaker> {
  const res = await fetch('/api/speakers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create speaker');
  return res.json();
}

export async function updateSpeaker(id: string, data: Partial<Speaker>): Promise<Speaker> {
  const res = await fetch(`/api/speakers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update speaker');
  return res.json();
}

export async function deleteSpeaker(id: string): Promise<void> {
  const res = await fetch(`/api/speakers/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete speaker');
}

// Imams
export async function fetchImams(): Promise<Imam[]> {
  try {
    const res = await fetch('/api/imams');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    const cached = localStorage.getItem('noor_imams');
    return cached ? JSON.parse(cached) : initialImams;
  }
}

export async function createImam(data: Omit<Imam, 'id'>): Promise<Imam> {
  const res = await fetch('/api/imams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create imam');
  return res.json();
}

export async function updateImam(id: string, data: Partial<Imam>): Promise<Imam> {
  const res = await fetch(`/api/imams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update imam');
  return res.json();
}

export async function deleteImam(id: string): Promise<void> {
  const res = await fetch(`/api/imams/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete imam');
}

// Khutbahs
export async function fetchKhutbahs(): Promise<Khutbah[]> {
  try {
    const res = await fetch('/api/khutbahs');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    const cached = localStorage.getItem('noor_khutbahs');
    return cached ? JSON.parse(cached) : initialKhutbahs;
  }
}

export async function createKhutbah(data: Omit<Khutbah, 'id'>): Promise<Khutbah> {
  const res = await fetch('/api/khutbahs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create khutbah');
  return res.json();
}

export async function updateKhutbah(id: string, data: Partial<Khutbah>): Promise<Khutbah> {
  const res = await fetch(`/api/khutbahs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update khutbah');
  return res.json();
}

export async function deleteKhutbah(id: string): Promise<void> {
  const res = await fetch(`/api/khutbahs/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete khutbah');
}

// Duas
export async function fetchDuas(): Promise<Dua[]> {
  try {
    const res = await fetch('/api/duas');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    const cached = localStorage.getItem('noor_duas');
    return cached ? JSON.parse(cached) : initialDuas;
  }
}

export async function createDua(data: Omit<Dua, 'id'>): Promise<Dua> {
  const res = await fetch('/api/duas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create dua');
  return res.json();
}

export async function updateDua(id: string, data: Partial<Dua>): Promise<Dua> {
  const res = await fetch(`/api/duas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update dua');
  return res.json();
}

export async function deleteDua(id: string): Promise<void> {
  const res = await fetch(`/api/duas/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete dua');
}

// Reminders
export async function fetchReminders(): Promise<Reminder[]> {
  try {
    const res = await fetch('/api/reminders');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    const cached = localStorage.getItem('noor_reminders');
    return cached ? JSON.parse(cached) : initialReminders;
  }
}

export async function createReminder(data: Omit<Reminder, 'id'>): Promise<Reminder> {
  const res = await fetch('/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create reminder');
  return res.json();
}

export async function updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
  const res = await fetch(`/api/reminders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update reminder');
  return res.json();
}

export async function deleteReminder(id: string): Promise<void> {
  const res = await fetch(`/api/reminders/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete reminder');
}

// Settings
export async function fetchSettings(): Promise<AppSettings> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    const cached = localStorage.getItem('noor_settings');
    return cached ? JSON.parse(cached) : initialSettings;
  }
}

export async function updateSettings(data: Partial<AppSettings>): Promise<{ success: boolean; settings: AppSettings }> {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

// Stats
export async function fetchStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// Auth
export async function loginAdmin(password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  return data;
}

export async function checkAdminAuth(): Promise<boolean> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.authenticated;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem(TOKEN_KEY);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to change password');
  return data;
}
