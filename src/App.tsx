import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FormJurnal from './components/FormJurnal';
import TabelJurnal from './components/TabelJurnal';
import Statistik from './components/Statistik';
import { JurnalEntry, FormData } from './types';

const STORAGE_KEY = 'jurnal-mengajar-smpn17';

function App() {
  const [jurnalData, setJurnalData] = useState<JurnalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<FormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setJurnalData(JSON.parse(saved));
      } catch {
        console.error('Failed to parse saved data');
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jurnalData));
  }, [jurnalData]);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submit
  const handleSubmit = (data: FormData) => {
    if (editingId) {
      // Update existing entry
      setJurnalData(prev =>
        prev.map(entry =>
          entry.id === editingId
            ? { ...entry, ...data }
            : entry
        )
      );
      setEditingEntry(null);
      setEditingId(null);
      showNotification('Jurnal berhasil diperbarui!');
    } else {
      // Create new entry
      const newEntry: JurnalEntry = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      setJurnalData(prev => [newEntry, ...prev]);
      showNotification('Jurnal berhasil disimpan!');
    }
  };

  // Handle edit
  const handleEdit = (entry: JurnalEntry) => {
    setEditingEntry({
      tanggal: entry.tanggal,
      hari: entry.hari,
      kelas: entry.kelas,
      mataPelajaran: entry.mataPelajaran,
      jamKe: entry.jamKe,
      materi: entry.materi,
      kegiatan: entry.kegiatan,
      jumlahHadir: entry.jumlahHadir,
      jumlahTidakHadir: entry.jumlahTidakHadir,
      catatan: entry.catatan,
    });
    setEditingId(entry.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setJurnalData(prev => prev.filter(entry => entry.id !== id));
    if (editingId === id) {
      setEditingEntry(null);
      setEditingId(null);
    }
    showNotification('Jurnal berhasil dihapus!');
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistik */}
        <Statistik data={jurnalData} />

        {/* Toggle Form Button (Mobile) */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="md:hidden w-full bg-white border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-between shadow-sm"
        >
          <span className="font-medium text-gray-700">
            {showForm ? 'Sembunyikan Form' : 'Tampilkan Form Input'}
          </span>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${showForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Form */}
        <div className={`${showForm ? 'block' : 'hidden'} md:block`}>
          <FormJurnal
            onSubmit={handleSubmit}
            editData={editingEntry}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Tabel */}
        <TabelJurnal
          data={jurnalData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 SMP Negeri 17 Surabaya — Aplikasi Jurnal Mengajar Kelas VII</p>
          <p className="mt-1 text-xs text-gray-400">Data tersimpan secara lokal di perangkat Anda</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
