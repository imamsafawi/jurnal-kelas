import React, { useState } from 'react';
import { JurnalEntry } from '../types';

interface TabelJurnalProps {
  data: JurnalEntry[];
  onEdit: (entry: JurnalEntry) => void;
  onDelete: (id: string) => void;
}

const TabelJurnal: React.FC<TabelJurnalProps> = ({ data, onEdit, onDelete }) => {
  const [filterKelas, setFilterKelas] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredData = data.filter(entry => {
    const matchKelas = !filterKelas || entry.kelas === filterKelas;
    const matchMapel = !filterMapel || entry.mataPelajaran === filterMapel;
    const matchTanggal = !filterTanggal || entry.tanggal === filterTanggal;
    const matchSearch = !searchTerm || 
      entry.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.catatan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKelas && matchMapel && matchTanggal && matchSearch;
  });

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const uniqueMapel = [...new Set(data.map(d => d.mataPelajaran))];

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-green-100 text-green-700 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Daftar Jurnal Mengajar
          <span className="ml-auto text-sm font-normal bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {filteredData.length} entri
          </span>
        </h2>

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Cari</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari materi/kegiatan..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Filter Kelas</label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Kelas</option>
              <option value="VII A">VII A</option>
              <option value="VII B">VII B</option>
              <option value="VII C">VII C</option>
              <option value="VII D">VII D</option>
              <option value="VII E">VII E</option>
              <option value="VII F">VII F</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Filter Mapel</label>
            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Mapel</option>
              {uniqueMapel.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Filter Tanggal</label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium">Belum ada data jurnal</p>
          <p className="text-sm">Silakan input jurnal mengajar menggunakan form di atas</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mapel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jam</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Materi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Siswa</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((entry, index) => (
                <React.Fragment key={entry.id}>
                  <tr className={`hover:bg-blue-50 transition-colors ${expandedId === entry.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatTanggal(entry.tanggal)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {entry.kelas}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.mataPelajaran}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{entry.jamKe}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{entry.materi}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-green-600 font-medium">{entry.jumlahHadir}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-red-500">{entry.jumlahTidakHadir}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Detail"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onEdit(entry)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className={`p-1.5 rounded-lg transition-colors ${deleteConfirm === entry.id ? 'text-white bg-red-500 hover:bg-red-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-100'}`}
                          title={deleteConfirm === entry.id ? 'Klik lagi untuk konfirmasi' : 'Hapus'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === entry.id && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Kegiatan Pembelajaran</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{entry.kegiatan}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Materi / Kompetensi Dasar</p>
                            <p className="text-sm text-gray-700">{entry.materi}</p>
                          </div>
                          {entry.catatan && (
                            <div className="md:col-span-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Catatan / Hambatan</p>
                              <p className="text-sm text-gray-700">{entry.catatan}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabelJurnal;
