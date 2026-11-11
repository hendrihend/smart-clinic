import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PatientData {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

// Data Dummy Semua Pasien Klinik
const ALL_PATIENTS_DATA: PatientData[] = [
  { id: '1', patientName: 'Hendri Gunawan', doctorName: 'dr. Anita Ratnasari', date: '9 Nov 2026', time: '09:00', status: 'Menunggu' },
  { id: '2', patientName: 'Budi Prakoso', doctorName: 'dr. Sarah Amalia', date: '9 Nov 2026', time: '10:30', status: 'Selesai' },
  { id: '3', patientName: 'Siti Aminah', doctorName: 'dr. Budi Santoso', date: '9 Nov 2026', time: '13:00', status: 'Menunggu' },
  { id: '4', patientName: 'Dimas Anggara', doctorName: 'dr. Anita Ratnasari', date: '10 Nov 2026', time: '09:00', status: 'Menunggu' },
];

export default function AdminDashboard() {
    const router = useRouter(); // Wajib ditambahkan di sini
    const [searchQuery, setSearchQuery] = useState('');

    // Logika Pencarian Nama Pasien
    const filteredData = ALL_PATIENTS_DATA.filter(item => 
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Menghitung Statistik Hari Ini (Asumsi hari ini 9 Nov 2026)
    const todayPatients = ALL_PATIENTS_DATA.filter(item => item.date === '9 Nov 2026');
    const waitingCount = todayPatients.filter(item => item.status === 'Menunggu').length;
    const finishedCount = todayPatients.filter(item => item.status === 'Selesai').length;

    const renderItem = ({ item }: {item: PatientData}) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.patientName}>👤 {item.patientName}</Text>
                <Text style={[
                styles.statusBadge, 
                item.status === 'Selesai' ? styles.statusSelesai : styles.statusMenunggu
                ]}>
                {item.status}
                </Text>
            </View>
            
            <View style={styles.cardBody}>
                <Text style={styles.detailText}>👨‍⚕️ {item.doctorName}</Text>
                <Text style={styles.detailText}>📅 {item.date} • ⏰ {item.time} WIB</Text>
            </View>

            {/* Tombol Aksi Admin */}
            <View style={styles.actionContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.btnEdit]}>
                <Text style={styles.btnTextEdit}>Ubah Jadwal</Text>
                </TouchableOpacity>
                
                {item.status === 'Menunggu' && (
                <TouchableOpacity style={[styles.actionButton, styles.btnSelesai]}>
                    <Text style={styles.btnTextSelesai}>Tandai Selesai</Text>
                </TouchableOpacity>
                )}
            </View>
        </View>
    );

  return (
    <View style={styles.container}>
      
      {/* Bagian Statistik */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{todayPatients.length}</Text>
          <Text style={styles.statLabel}>Total Hari Ini</Text>
        </View>
        <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#eee' }]}>
          <Text style={[styles.statNumber, { color: '#e67e22' }]}>{waitingCount}</Text>
          <Text style={styles.statLabel}>Menunggu</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#27ae60' }]}>{finishedCount}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
      </View>

      {/* Kolom Pencarian */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama pasien..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Daftar Pasien */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data pasien ditemukan.</Text>
          </View>
        }
      />
      
      {/* Tombol Logout Admin */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.replace('/')} // Gunakan replace agar tidak bisa di-back
      >
        <Text style={styles.logoutText}>Keluar (Logout)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 15,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
  statusMenunggu: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusSelesai: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  cardBody: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  btnEdit: {
    borderColor: '#bdc3c7',
    backgroundColor: '#ecf0f1',
  },
  btnTextEdit: {
    color: '#7f8c8d',
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnSelesai: {
    borderColor: '#2ecc71',
    backgroundColor: '#2ecc71',
    marginLeft: 10,
  },
  btnTextSelesai: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  }
});
