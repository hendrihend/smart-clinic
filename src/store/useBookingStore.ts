import { create } from 'zustand';

// 1. Definisikan tipe data
export interface HistoryItem {
  id: string;
  doctorName: string;
  specialist: string;
  date: string;
  time: string;
  status: 'Menunggu' | 'Selesai' | 'Dibatalkan';
}

// 2. Definisikan struktur brankas
interface BookingStore {
  historyData: HistoryItem[];
  setHistoryData: (data: HistoryItem[]) => void;
  addBooking: (newBooking: HistoryItem) => void;
}

// 3. Buat dan ekspor Zustand store
export const useBookingStore = create<BookingStore>((set) => ({
  historyData: [], // State awal kosong
  
  // Aksi 1: Menimpa seluruh data (digunakan saat pertama kali fetch dari API)
  setHistoryData: (data) => set({ historyData: data }),
  
  // Aksi 2: Menambahkan 1 data baru ke tumpukan paling atas (digunakan saat booking baru)
  addBooking: (newBooking) => set((state) => ({
    historyData: [newBooking, ...state.historyData]
  })),
}));