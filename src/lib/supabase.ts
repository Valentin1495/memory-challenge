import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getGuestId(): string {
  const stored = localStorage.getItem('guestId');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('guestId', newId);
  return newId;
}

export function getNickname(): string | null {
  return localStorage.getItem('nickname');
}

export function setNickname(nickname: string): void {
  localStorage.setItem('nickname', nickname);
}
