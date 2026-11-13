import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBookingStore } from '../../store/useBookingStore';

// Interface untuk TypeScript
interface Doctor {
  id: string;
  name: string;
  spec: string;
}

export default function BookingScreen() {
  const router = useRouter();
  
  // State untuk menyimpan data dari API
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State loading

  // State form pilihan user
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  // Berjalan sekali saat halaman dimuat
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Ganti IP sesuai dengan PC Anda (port bawaan Expo: 8081)
      const response = await fetch('http://192.168.0.102:8081/api/doctors');
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setDoctors(data.doctors);
        setTimeSlots(data.time_slots);
        
        // Set nilai default picker ke item pertama
        if (data.doctors.length > 0) setSelectedDoctor(data.doctors[0].id);
        if (data.time_slots.length > 0) setSelectedTime(data.time_slots[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat jadwal dokter');
      console.error(error);
    } finally {
      setIsLoading(false); // Matikan loading setelah selesai
    }
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleBooking = async () => {
    try {
      // 1. Siapkan format data yang akan dikirim
      // Kita ubah format Date bawaan JS menjadi string (misal: "2026-11-15")
      const payload = {
        doctorId: selectedDoctor,
        date: date.toISOString().split('T')[0], 
        time: selectedTime
      };

      // 2. Kirim data ke API menggunakan metode POST
      const response = await fetch('http://192.168.0.102:8081/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 3. Cek apakah server merespons sukses
      if (response.ok && data.status === 'success') {
        // 1. Cari detail dokter yang dipilih untuk ditampilkan di riwayat
        const selectedDocObj = doctors.find(d => d.id === selectedDoctor);
        
        if (selectedDocObj) {
          // 2. Tambahkan data ke Zustand (Optimistic Update)
          const { addBooking } = useBookingStore.getState(); // Cara memanggil fungsi tanpa hook jika di dalam event handler (atau bisa dideklarasikan di atas)
          
          addBooking({
            id: Math.random().toString(), // Dummy ID sementara sebelum fetch ulang
            doctorName: selectedDocObj.name,
            specialist: selectedDocObj.spec,
            date: date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            time: `${selectedTime} WIB`,
            status: 'Menunggu'
          });
        }

        Alert.alert(
          "Booking Berhasil!", 
          `Antrian Anda telah dijadwalkan pada:\n${date.toLocaleDateString('id-ID')} jam ${selectedTime}`,
          [{ text: "OK", onPress: () => router.replace('/patient/history') }]
        );
      } else {
        Alert.alert("Gagal Booking", data.message || "Terjadi kesalahan sistem");
      }
    } catch (error) {
      Alert.alert("Koneksi Error", "Gagal mengirim data ke server API");
      console.error(error);
    }
  };

  // Jika masih loading, tampilkan indikator putar (Spinner)
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Memuat jadwal dokter...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pilih Dokter & Poli</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDoctor}
            onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
            style={styles.picker}
          >
            {/* Looping data dari state doctors */}
            {doctors.map((doc) => (
              <Picker.Item key={doc.id} label={`${doc.name} - ${doc.spec}`} value={doc.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tanggal Pemeriksaan</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
          <Text style={styles.dateText}>
            📅 {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pilih Jam</Text>
        <View style={styles.timeContainer}>
          {/* Looping data dari state timeSlots */}
          {timeSlots.map((time, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.timeButton, selectedTime === time && styles.timeButtonActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
        <Text style={styles.submitButtonText}>Konfirmasi Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  formGroup: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  pickerContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' },
  picker: { height: 50 },
  dateInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10 },
  dateText: { fontSize: 16, color: '#34495e' },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10 },
  timeButtonActive: { backgroundColor: '#3498db', borderColor: '#3498db' },
  timeText: { color: '#7f8c8d', fontWeight: '600' },
  timeTextActive: { color: '#fff', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 40, elevation: 2 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
