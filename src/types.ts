export interface JurnalEntry {
  id: string;
  tanggal: string;
  hari: string;
  kelas: string;
  mataPelajaran: string;
  jamKe: string;
  materi: string;
  kegiatan: string;
  jumlahHadir: number;
  jumlahTidakHadir: number;
  catatan: string;
  createdAt: string;
}

export interface FormData {
  tanggal: string;
  hari: string;
  kelas: string;
  mataPelajaran: string;
  jamKe: string;
  materi: string;
  kegiatan: string;
  jumlahHadir: number;
  jumlahTidakHadir: number;
  catatan: string;
}
