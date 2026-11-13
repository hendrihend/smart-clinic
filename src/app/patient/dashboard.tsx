import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Import useRouter dari expo-router
import { useRouter } from 'expo-router';

export default function PatientDashboard() {
  // 2. Deklarasikan router
  const router = useRouter(); 

  return (
    <ScrollView style={styles.container}>
      {/* Bagian Header / Profil Singkat */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, Hendri!</Text>
        <Text style={styles.subGreeting}>Semoga sehat selalu. Ada yang bisa kami bantu hari ini?</Text>
      </View>

      {/* Kartu Notifikasi Jadwal Terdekat */}
      <View style={styles.notificationCard}>
        <Text style={styles.cardTitle}>Jadwal Terdekat Anda</Text>
        <View style={styles.cardContent}>
          <Text style={styles.doctorName}>dr. Anita Ratnasari (Sp. PD)</Text>
          <Text style={styles.scheduleTime}>Senin, 9 Nov 2026 • 09:00 WIB</Text>
          <Text style={styles.statusBadge}>Menunggu Pemeriksaan</Text>
        </View>
      </View>

      {/* Bagian Menu Utama */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Layanan Klinik</Text>
        
        {/* 3. Ubah onPress menggunakan router.push */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => router.push('/patient/booking')}
          activeOpacity={0.8}
        >
          <View style={styles.menuIconPlaceholder}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Booking Antrian</Text>
            <Text style={styles.menuDesc}>Buat jadwal periksa dengan dokter</Text>
          </View>
        </TouchableOpacity>

        {/* 4. Ubah onPress menggunakan router.push */}
        <TouchableOpacity 
          style={[styles.menuButton, styles.menuButtonSecondary]} 
          onPress={() => router.push('/patient/history')}
          activeOpacity={0.8}
        >
          <View style={styles.menuIconPlaceholder}>
            <Text style={styles.iconText}>📋</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Riwayat Kunjungan</Text>
            <Text style={styles.menuDesc}>Lihat rekam medis & jadwal selesai</Text>
          </View>
        </TouchableOpacity>
        
        {/* Tombol Logout Pasien (Tambahan) */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={async () => {
            // Menghapus semua data sesi di lokal memori
            await AsyncStorage.clear(); 
            // Kembali ke halaman Login
            router.replace('/');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Keluar (Logout)</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { padding: 20, backgroundColor: '#3498db', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subGreeting: { fontSize: 14, color: '#e0f2fe' },
  notificationCard: { backgroundColor: '#ffffff', marginHorizontal: 20, padding: 20, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#2ecc71', elevation: 3, marginBottom: 25 },
  cardTitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 10, fontWeight: '600' },
  cardContent: {},
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  scheduleTime: { fontSize: 14, color: '#34495e', marginBottom: 10 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#e8f8f5', color: '#27ae60', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
  menuContainer: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  menuButton: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  menuButtonSecondary: { borderWidth: 1, borderColor: '#ecf0f1' },
  menuIconPlaceholder: { width: 50, height: 50, backgroundColor: '#ebf5fb', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconText: { fontSize: 24 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  menuDesc: { fontSize: 13, color: '#7f8c8d' },
  logoutButton: { marginTop: 20, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#e74c3c' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
