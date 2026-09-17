import React, { useState, useEffect } from 'react';
import { FormData } from '../types';

interface FormJurnalProps {
  onSubmit: (data: FormData) => void;
  editData?: FormData | null;
  onCancelEdit?: () => void;
}

const KELAS_OPTIONS = ['VII A', 'VII B', 'VII C', 'VII D', 'VII E', 'VII F'];

const MAPEL_OPTIONS = [
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Matematika',
  'IPA (Ilmu Pengetahuan Alam)',
  'IPS (Ilmu Pengetahuan Sosial)',
  'PKN',
  'Pendidikan Agama',
  'Seni Budaya',
  'PJOK',
  'Prakarya',
  'Informatika',
  'Bahasa Jawa',
];

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const JAM_OPTIONS = ['1-2', '3-4', '5-6', '7-8'];

const getHariFromTanggal = (tanggal: string): string => {
  if (!tanggal) return '';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const date = new Date(tanggal);
  return days[date.getDay()];
};

const initialFormData: FormData = {
  tanggal: new Date().toISOString().split('T')[0],
  hari: getHariFromTanggal(new Date().toISOString().split('T')[0]),
  kelas: '',
  mataPelajaran: '',
  jamKe: '',
  materi: '',
  kegiatan: '',
  jumlahHadir: 0,
  jumlahTidakHadir: 0,
  catatan: '',
};

const FormJurnal: React.FC<FormJurnalProps> = ({ onSubmit, editData, onCancelEdit }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  useEffect(() => {
    if (formData.tanggal) {
      const hari = getHariFromTanggal(formData.tanggal);
      setFormData(prev => ({ ...prev, hari }));
    }
  }, [formData.tanggal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlahHadir' || name === 'jumlahTidakHadir' ? parseInt(value) || 0 : value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal harus diisi';
    if (!formData.kelas) newErrors.kelas = 'Kelas harus dipilih';
    if (!formData.mataPelajaran) newErrors.mataPelajaran = 'Mata pelajaran harus dipilih';
    if (!formData.jamKe) newErrors.jamKe = 'Jam pelajaran harus dipilih';
    if (!formData.materi) newErrors.materi = 'Materi harus diisi';
    if (!formData.kegiatan) newErrors.kegiatan = 'Kegiatan harus diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      if (!editData) {
        setFormData({
          ...initialFormData,
          tanggal: new Date().toISOString().split('T')[0],
          hari: getHariFromTanggal(new Date().toISOString().split('T')[0]),
        });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      ...initialFormData,
      tanggal: new Date().toISOString().split('T')[0],
      hari: getHariFromTanggal(new Date().toISOString().split('T')[0]),
    });
    setErrors({});
    onCancelEdit?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </span>
        {editData ? 'Edit Jurnal Mengajar' : 'Input Jurnal Mengajar'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.tanggal ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
          </div>

          {/* Hari */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
            <input
              type="text"
              name="hari"
              value={formData.hari}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.kelas ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Pilih Kelas --</option>
              {KELAS_OPTIONS.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            {errors.kelas && <p className="text-red-500 text-xs mt-1">{errors.kelas}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mata Pelajaran */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <select
              name="mataPelajaran"
              value={formData.mataPelajaran}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mataPelajaran ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Pilih Mapel --</option>
              {MAPEL_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.mataPelajaran && <p className="text-red-500 text-xs mt-1">{errors.mataPelajaran}</p>}
          </div>

          {/* Jam Ke */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Pelajaran</label>
            <select
              name="jamKe"
              value={formData.jamKe}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.jamKe ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">-- Pilih Jam --</option>
              {JAM_OPTIONS.map(j => (
                <option key={j} value={j}>Jam ke-{j}</option>
              ))}
            </select>
            {errors.jamKe && <p className="text-red-500 text-xs mt-1">{errors.jamKe}</p>}
          </div>

          {/* Jumlah Hadir */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hadir</label>
              <input
                type="number"
                name="jumlahHadir"
                value={formData.jumlahHadir}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tidak Hadir</label>
              <input
                type="number"
                name="jumlahTidakHadir"
                value={formData.jumlahTidakHadir}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Materi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Materi / Kompetensi Dasar</label>
          <textarea
            name="materi"
            value={formData.materi}
            onChange={handleChange}
            rows={2}
            placeholder="Contoh: Memahami struktur teks deskripsi..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.materi ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.materi && <p className="text-red-500 text-xs mt-1">{errors.materi}</p>}
        </div>

        {/* Kegiatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan Pembelajaran</label>
          <textarea
            name="kegiatan"
            value={formData.kegiatan}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: 1. Pembukaan dengan salam dan doa&#10;2. Apersepsi materi sebelumnya&#10;3. Kegiatan inti: diskusi kelompok&#10;4. Penutup dan refleksi"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.kegiatan ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.kegiatan && <p className="text-red-500 text-xs mt-1">{errors.kegiatan}</p>}
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Hambatan</label>
          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            rows={2}
            placeholder="Catatan tambahan atau hambatan yang ditemui..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {editData ? 'Update Jurnal' : 'Simpan Jurnal'}
          </button>
          {editData && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormJurnal;
