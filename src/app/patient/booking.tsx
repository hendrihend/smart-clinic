import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router'; // 1. Import router
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DOCTORS = [
  { id: '1', name: 'dr. Budi Santoso', spec: 'Poli Umum' },
  { id: '2', name: 'dr. Anita Ratnasari', spec: 'Spesialis Penyakit Dalam' },
  { id: '3', name: 'dr. Sarah Amalia', spec: 'Poli Gigi' },
];

const TIME_SLOTS = ['09:00', '10:30', '13:00', '15:30', '19:00'];

export default function BookingScreen() {
  const router = useRouter(); // 2. Inisialisasi router
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);

  // Tambahkan tipe DateTimePickerEvent agar tidak error merah di TypeScript
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleBooking = () => {
    Alert.alert(
      "Booking Berhasil!", 
      `Antrian Anda telah dijadwalkan pada:\n${date.toLocaleDateString('id-ID')} jam ${selectedTime}`,
      [
        // 3. Gunakan router untuk pindah halaman
        { text: "OK", onPress: () => router.replace('/patient/history') }
      ]
    );
  };

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
            {DOCTORS.map((doc) => (
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
          {TIME_SLOTS.map((time, index) => (
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
