import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  _count?: { events: number };
}

export interface Speaker {
  id: number;
  name: string;
  biodata: string;
  email: string;
  photoUrl?: string;
  _count?: { events: number };
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: number;
  category: Category;
  pembicaraId: number;
  pembicara: Speaker;
  maxParticipants: number;
}

export interface Student {
  nim: string;
  name: string;
  major: string;
  class: string;
  generation: string;
  email?: string;
  photoUrl?: string;
  birthPlaceDate?: string;
}

export interface Pengurus {
  id: number;
  nama: string;
  jabatan: string;
  photoUrl?: string;
}


export type ViewType = 'landing' | 'dashboard' | 'biodata' | 'categories' | 'speakers' | 'events' | 'pengurus' | 'login';
export type TabType = 'beranda' | 'competition' | 'seminar' | 'workshop' | 'talkshow';

interface AppState {
  auth: Student | null;
  categories: Category[];
  speakers: Speaker[];
  events: Event[];
  pengurus: Pengurus[];
  currentView: ViewType;
  landingTab: TabType;
  loading: boolean;
  error: string | null;
  
  // Auth Actions
  // Auth Actions
  login: (identifier: string, username?: string) => { success: boolean, message?: string };
  register: (nim: string, name: string, email: string, username: string) => { success: boolean, message?: string };
  logout: () => void;
  setView: (view: ViewType) => void;
  setLandingTab: (tab: TabType) => void;
  updateProfile: (profileData: Partial<Student>) => void;
  
  // Category Actions
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, description?: string) => Promise<boolean>;
  updateCategory: (id: number, name: string, description?: string) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  
  // Speaker Actions
  fetchSpeakers: () => Promise<void>;
  createSpeaker: (name: string, biodata: string, email: string, photoUrl?: string) => Promise<boolean>;
  updateSpeaker: (id: number, name: string, biodata: string, email: string, photoUrl?: string) => Promise<boolean>;
  deleteSpeaker: (id: number) => Promise<boolean>;

  // Event Actions
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    categoryId: number;
    pembicaraId: number;
    maxParticipants: number;
  }) => Promise<boolean>;
  updateEvent: (id: number, eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    categoryId: number;
    pembicaraId: number;
    maxParticipants: number;
  }) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;

  // Pengurus Actions
  fetchPengurus: () => Promise<void>;
  createPengurus: (nama: string, jabatan: string, photoUrl?: string) => Promise<boolean>;
  updatePengurus: (id: number, nama: string, jabatan: string, photoUrl?: string) => Promise<boolean>;
  deletePengurus: (id: number) => Promise<boolean>;
}

// ═══ LOCAL STORAGE HELPERS ═══
const LS_CATEGORIES = 'ipm_categories';
const LS_SPEAKERS = 'ipm_speakers';
const LS_EVENTS = 'ipm_events';
const LS_PENGURUS = 'ipm_pengurus';

function getLocalCategories(): Category[] {
  return JSON.parse(localStorage.getItem(LS_CATEGORIES) || '[]');
}
function saveLocalCategories(cats: Category[]) {
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(cats));
}
function getLocalSpeakers(): Speaker[] {
  return JSON.parse(localStorage.getItem(LS_SPEAKERS) || '[]');
}
function saveLocalSpeakers(spk: Speaker[]) {
  localStorage.setItem(LS_SPEAKERS, JSON.stringify(spk));
}
function getLocalEvents(): Event[] {
  return JSON.parse(localStorage.getItem(LS_EVENTS) || '[]');
}
function saveLocalEvents(evts: Event[]) {
  localStorage.setItem(LS_EVENTS, JSON.stringify(evts));
}
function getLocalPengurus(): Pengurus[] {
  return JSON.parse(localStorage.getItem(LS_PENGURUS) || '[]');
}
function saveLocalPengurus(p: Pengurus[]) {
  localStorage.setItem(LS_PENGURUS, JSON.stringify(p));
}
function nextId(items: { id: number }[]): number {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// Check if backend is available
async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/categories`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export const useStore = create<AppState>((set, get) => {
  // Inject default user
  const users = JSON.parse(localStorage.getItem('seminar_ipm_users') || '{}');
  if (!users['24090030']) {
    users['24090030'] = {
      username: '24090030',
      profile: {
        nim: '24090030',
        name: 'Hanif Azhar',
        email: 'hanifazharre@gmail.com',
        major: 'Mahasiswa',
        class: 'Reguler',
        generation: '2024',
        birthPlaceDate: 'Brebes, 12 Oktober 2005'
      }
    };
    localStorage.setItem('seminar_ipm_users', JSON.stringify(users));
  }

  // Load initial auth state from localStorage
  const storedAuth = localStorage.getItem('seminar_ipm_auth');
  const initialAuth = storedAuth ? JSON.parse(storedAuth) : null;
  
  return {
    auth: initialAuth,
    categories: getLocalCategories(),
    speakers: getLocalSpeakers(),
    events: getLocalEvents(),
    pengurus: getLocalPengurus(),
    currentView: initialAuth ? 'dashboard' : 'landing',
    landingTab: 'beranda',
    loading: false,
    error: null,
    
    login: (identifier: string, username?: string) => {
      if (!identifier.trim() || !username?.trim()) return { success: false, message: 'Identitas dan Kata Sandi wajib diisi.' };
      
      const cleanId = identifier.trim();
      const users = JSON.parse(localStorage.getItem('seminar_ipm_users') || '{}');
      
      let user = users[cleanId];
      if (!user) {
        // Try finding by email
        for (const key in users) {
          if (users[key].profile?.email === cleanId) {
            user = users[key];
            break;
          }
        }
      }
      
      if (!user) {
        return { success: false, message: 'Akun tidak ditemukan. Silakan buat akun.' };
      }
      
      if (user.username !== username) {
        return { success: false, message: 'Kata Sandi salah.' };
      }
      
      localStorage.setItem('seminar_ipm_auth', JSON.stringify(user.profile));
      set({ auth: user.profile, currentView: 'dashboard', error: null });
      return { success: true };
    },
    
    register: (nim: string, name: string, email: string, username: string) => {
      if (!nim.trim() || !name.trim() || !email.trim() || !username.trim()) {
        return { success: false, message: 'Semua field wajib diisi.' };
      }
      
      const cleanNim = nim.trim();
      const users = JSON.parse(localStorage.getItem('seminar_ipm_users') || '{}');
      
      if (users[cleanNim]) {
        return { success: false, message: 'NIA sudah terdaftar. Silakan login.' };
      }
      
      let major = 'Ketua Umum';
      let classCode = 'Reguler';
      let generation = '20' + cleanNim.substring(0, 2);
      let birthPlaceDate = 'Brebes, 12 Oktober 2005';
      
      const studentProfile: Student = {
        nim: cleanNim,
        name: name.trim(),
        email: email.trim(),
        major,
        class: classCode,
        generation: generation.length === 4 ? generation : '2024',
        birthPlaceDate
      };
      
      users[cleanNim] = {
        username: username,
        profile: studentProfile
      };
      
      localStorage.setItem('seminar_ipm_users', JSON.stringify(users));
      
      // Auto login
      localStorage.setItem('seminar_ipm_auth', JSON.stringify(studentProfile));
      set({ auth: studentProfile, currentView: 'dashboard', error: null });
      
      return { success: true };
    },
    
    logout: () => {
      localStorage.removeItem('seminar_ipm_auth');
      set({ auth: null, currentView: 'landing' });
    },
    
    updateProfile: (profileData: Partial<Student>) => {
      const currentAuth = get().auth;
      if (!currentAuth) return;
      
      const updatedAuth = {
        ...currentAuth,
        ...profileData
      };
      
      localStorage.setItem('seminar_ipm_auth', JSON.stringify(updatedAuth));
      
      const users = JSON.parse(localStorage.getItem('seminar_ipm_users') || '{}');
      if (users[updatedAuth.nim]) {
        users[updatedAuth.nim].profile = updatedAuth;
        localStorage.setItem('seminar_ipm_users', JSON.stringify(users));
      }
      
      set({ auth: updatedAuth });
    },
    
    setView: (view: ViewType) => {
      // Check protection
      if (view !== 'landing' && view !== 'login' && !get().auth) {
        set({ currentView: 'login' });
      } else {
        set({ currentView: view });
      }
    },

    setLandingTab: (tab: TabType) => set({ landingTab: tab }),
    
    // ═══════════════════════════════════════
    // Categories CRUD (Local + API fallback)
    // ═══════════════════════════════════════
    fetchCategories: async () => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/categories`);
          if (res.ok) {
            const data = await res.json();
            saveLocalCategories(data);
            set({ categories: data, loading: false });
            return;
          }
        }
      } catch {}
      // Fallback to local
      set({ categories: getLocalCategories(), loading: false });
    },
    
    createCategory: async (name, description) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
          });
          if (res.ok) {
            await get().fetchCategories();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const cats = getLocalCategories();
      if (cats.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        set({ error: 'Nama kategori sudah ada.', loading: false });
        return false;
      }
      const newCat: Category = { id: nextId(cats), name, description, _count: { events: 0 } };
      cats.push(newCat);
      saveLocalCategories(cats);
      set({ categories: cats, loading: false });
      return true;
    },
    
    updateCategory: async (id, name, description) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
          });
          if (res.ok) {
            await get().fetchCategories();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const cats = getLocalCategories();
      const dup = cats.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== id);
      if (dup) {
        set({ error: 'Nama kategori sudah ada.', loading: false });
        return false;
      }
      const idx = cats.findIndex(c => c.id === id);
      if (idx === -1) { set({ error: 'Kategori tidak ditemukan.', loading: false }); return false; }
      cats[idx] = { ...cats[idx], name, description };
      saveLocalCategories(cats);
      // Also update events referencing this category
      const evts = getLocalEvents().map(e => e.categoryId === id ? { ...e, category: { ...e.category, name, description } } : e);
      saveLocalEvents(evts);
      set({ categories: cats, events: evts, loading: false });
      return true;
    },
    
    deleteCategory: async (id) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
          if (res.ok) {
            await get().fetchCategories();
            await get().fetchEvents();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const cats = getLocalCategories().filter(c => c.id !== id);
      saveLocalCategories(cats);
      const evts = getLocalEvents().filter(e => e.categoryId !== id);
      saveLocalEvents(evts);
      set({ categories: cats, events: evts, loading: false });
      return true;
    },
    
    // ═══════════════════════════════════════
    // Speakers CRUD (Local + API fallback)
    // ═══════════════════════════════════════
    fetchSpeakers: async () => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/speakers`);
          if (res.ok) {
            const data = await res.json();
            saveLocalSpeakers(data);
            set({ speakers: data, loading: false });
            return;
          }
        }
      } catch {}
      set({ speakers: getLocalSpeakers(), loading: false });
    },
    
    createSpeaker: async (name, biodata, email, photoUrl) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/speakers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, biodata, email, photoUrl })
          });
          if (res.ok) {
            await get().fetchSpeakers();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const spks = getLocalSpeakers();
      const newSpk: Speaker = { id: nextId(spks), name, biodata, email, photoUrl, _count: { events: 0 } };
      spks.push(newSpk);
      saveLocalSpeakers(spks);
      set({ speakers: spks, loading: false });
      return true;
    },
    
    updateSpeaker: async (id, name, biodata, email, photoUrl) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/speakers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, biodata, email, photoUrl })
          });
          if (res.ok) {
            await get().fetchSpeakers();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const spks = getLocalSpeakers();
      const idx = spks.findIndex(s => s.id === id);
      if (idx === -1) { set({ error: 'Pembicara tidak ditemukan.', loading: false }); return false; }
      spks[idx] = { ...spks[idx], name, biodata, email, photoUrl };
      saveLocalSpeakers(spks);
      const evts = getLocalEvents().map(e => e.pembicaraId === id ? { ...e, pembicara: { ...e.pembicara, name, biodata, email, photoUrl } } : e);
      saveLocalEvents(evts);
      set({ speakers: spks, events: evts, loading: false });
      return true;
    },
    
    deleteSpeaker: async (id) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/speakers/${id}`, { method: 'DELETE' });
          if (res.ok) {
            await get().fetchSpeakers();
            await get().fetchEvents();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      const spks = getLocalSpeakers().filter(s => s.id !== id);
      saveLocalSpeakers(spks);
      const evts = getLocalEvents().filter(e => e.pembicaraId !== id);
      saveLocalEvents(evts);
      set({ speakers: spks, events: evts, loading: false });
      return true;
    },
    
    // ═══════════════════════════════════════
    // Events CRUD (Local + API fallback)
    // ═══════════════════════════════════════
    fetchEvents: async () => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/events`);
          if (res.ok) {
            const data = await res.json();
            saveLocalEvents(data);
            set({ events: data, loading: false });
            return;
          }
        }
      } catch {}
      set({ events: getLocalEvents(), loading: false });
    },
    
    createEvent: async (eventData) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          });
          if (res.ok) {
            await get().fetchEvents();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const evts = getLocalEvents();
      const cats = getLocalCategories();
      const spks = getLocalSpeakers();
      const cat = cats.find(c => c.id === eventData.categoryId);
      const spk = spks.find(s => s.id === eventData.pembicaraId);
      if (!cat || !spk) {
        set({ error: 'Kategori atau pembicara tidak valid.', loading: false });
        return false;
      }
      const newEvt: Event = {
        id: nextId(evts),
        ...eventData,
        category: cat,
        pembicara: spk,
      };
      evts.push(newEvt);
      saveLocalEvents(evts);
      // Update counts
      const catIdx = cats.findIndex(c => c.id === eventData.categoryId);
      if (catIdx !== -1) {
        cats[catIdx] = { ...cats[catIdx], _count: { events: evts.filter(e => e.categoryId === eventData.categoryId).length } };
        saveLocalCategories(cats);
      }
      const spkIdx = spks.findIndex(s => s.id === eventData.pembicaraId);
      if (spkIdx !== -1) {
        spks[spkIdx] = { ...spks[spkIdx], _count: { events: evts.filter(e => e.pembicaraId === eventData.pembicaraId).length } };
        saveLocalSpeakers(spks);
      }
      set({ events: evts, categories: cats, speakers: spks, loading: false });
      return true;
    },
    
    updateEvent: async (id, eventData) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          });
          if (res.ok) {
            await get().fetchEvents();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      // Fallback to local
      const evts = getLocalEvents();
      const cats = getLocalCategories();
      const spks = getLocalSpeakers();
      const cat = cats.find(c => c.id === eventData.categoryId);
      const spk = spks.find(s => s.id === eventData.pembicaraId);
      if (!cat || !spk) {
        set({ error: 'Kategori atau pembicara tidak valid.', loading: false });
        return false;
      }
      const idx = evts.findIndex(e => e.id === id);
      if (idx === -1) { set({ error: 'Event tidak ditemukan.', loading: false }); return false; }
      evts[idx] = { ...evts[idx], ...eventData, category: cat, pembicara: spk };
      saveLocalEvents(evts);
      set({ events: evts, loading: false });
      return true;
    },
    
    deleteEvent: async (id) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
          if (res.ok) {
            await get().fetchEvents();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      const evts = getLocalEvents().filter(e => e.id !== id);
      saveLocalEvents(evts);
      set({ events: evts, loading: false });
      return true;
    },

    // ═══════════════════════════════════════
    // Pengurus CRUD (Local + API fallback)
    // ═══════════════════════════════════════
    fetchPengurus: async () => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/pengurus`);
          if (res.ok) {
            const data = await res.json();
            saveLocalPengurus(data);
            set({ pengurus: data, loading: false });
            return;
          }
        }
      } catch {}
      set({ pengurus: getLocalPengurus(), loading: false });
    },
    
    createPengurus: async (nama, jabatan, photoUrl) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/pengurus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, jabatan, photoUrl })
          });
          if (res.ok) {
            await get().fetchPengurus();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      const p = getLocalPengurus();
      const newP: Pengurus = { id: nextId(p), nama, jabatan, photoUrl };
      p.push(newP);
      saveLocalPengurus(p);
      set({ pengurus: p, loading: false });
      return true;
    },
    
    updatePengurus: async (id, nama, jabatan, photoUrl) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/pengurus/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, jabatan, photoUrl })
          });
          if (res.ok) {
            await get().fetchPengurus();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      const p = getLocalPengurus();
      const idx = p.findIndex(x => x.id === id);
      if (idx === -1) { set({ error: 'Pengurus tidak ditemukan.', loading: false }); return false; }
      p[idx] = { ...p[idx], nama, jabatan, photoUrl };
      saveLocalPengurus(p);
      set({ pengurus: p, loading: false });
      return true;
    },
    
    deletePengurus: async (id) => {
      set({ loading: true, error: null });
      try {
        if (await isBackendAvailable()) {
          const res = await fetch(`${API_URL}/pengurus/${id}`, { method: 'DELETE' });
          if (res.ok) {
            await get().fetchPengurus();
            set({ loading: false });
            return true;
          }
        }
      } catch {}
      const p = getLocalPengurus().filter(x => x.id !== id);
      saveLocalPengurus(p);
      set({ pengurus: p, loading: false });
      return true;
    }
  };
});
