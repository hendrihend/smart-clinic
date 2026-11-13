import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CustomCard, { PatientData } from '../../components/CustomCard';

export default function AdminDashboard() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk Popup Ubah Jadwal
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // 1. URL HARDCODE UNTUK AMBIL DATA
      const response = await fetch('http://192.168.0.102:8081/api/patients');
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setPatients(data.data);
      } else {
        Alert.alert('Error', 'Gagal memuat data pasien');
      }
    } catch (error) {
      Alert.alert('Koneksi Error', 'Tidak dapat terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatients();
    setRefreshing(false);
  };

  const handleTandaiSelesai = async (id: string) => {
    try {
      // 2. URL HARDCODE UNTUK TANDAI SELESAI
      const response = await fetch('http://192.168.0.102:8081/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        Alert.alert('Sukses', 'Status pasien berhasil diperbarui');
        setPatients(prevPatients => 
          prevPatients.map(patient => 
            patient.id === id ? { ...patient, status: 'Selesai' } : patient
          )
        );
      }
    } catch (error) {
      Alert.alert('Koneksi Error', 'Gagal menghubungi server API');
    }
  };

  const openRescheduleModal = (patient: PatientData) => {
    setSelectedPatientId(patient.id);
    setNewDate(patient.date);
    setNewTime(patient.time);
    setModalVisible(true);
  };

  const submitReschedule = async () => {
    try {
      // 3. URL HARDCODE UNTUK UBAH JADWAL
      const response = await fetch('http://192.168.0.102:8081/api/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPatientId, date: newDate, time: newTime })
      });
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        Alert.alert('Sukses', 'Jadwal pasien berhasil diubah');
        setPatients(prevPatients => 
          prevPatients.map(patient => 
            patient.id === selectedPatientId 
              ? { ...patient, date: newDate, time: newTime } 
              : patient
          )
        );
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Gagal mengubah jadwal');
      }
    } catch (error) {
      Alert.alert('Koneksi Error', 'Gagal menghubungi server API');
    }
  };

  const filteredData = patients.filter(item =>
    item.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAntrian = patients.length;
  const totalMenunggu = patients.filter(p => p.status === 'Menunggu').length;

  const renderItem = ({ item }: {item: PatientData}) => (
    <CustomCard 
      item={item} 
      onUbahJadwal={() => openRescheduleModal(item)}
      onTandaiSelesai={() => handleTandaiSelesai(item.id)}
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Memuat data pasien...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel Admin</Text>
        <Text style={styles.headerSubtitle}>Kelola Jadwal Antrian</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalAntrian}</Text>
          <Text style={styles.statLabel}>Total Antrian</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxHighlight]}>
          <Text style={[styles.statNumber, {color: '#d35400'}]}>{totalMenunggu}</Text>
          <Text style={styles.statLabel}>Menunggu</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari nama pasien..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3498db']} />
        }
      />

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.clear(); 
          router.replace('/');
        }}
      >
        <Text style={styles.logoutText}>Keluar (Logout)</Text>
      </TouchableOpacity>

      {/* POPUP MODAL UBAH JADWAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ubah Jadwal Pasien</Text>
            
            <Text style={styles.modalLabel}>Tanggal Baru:</Text>
            <TextInput 
              style={styles.modalInput} 
              value={newDate} 
              onChangeText={setNewDate}
              placeholder="Contoh: 17 Nov 2026"
            />

            <Text style={styles.modalLabel}>Jam Baru:</Text>
            <TextInput 
              style={styles.modalInput} 
              value={newTime} 
              onChangeText={setNewTime}
              placeholder="Contoh: 10:00"
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnTextCancel}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={submitReschedule}>
                <Text style={styles.modalBtnTextSave}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { padding: 20, backgroundColor: '#3498db', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#e0f2fe' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, marginBottom: 10, elevation: 2 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxHighlight: { borderLeftWidth: 1, borderLeftColor: '#ecf0f1' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#7f8c8d', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 15, marginTop: 10, marginBottom: 15, borderRadius: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ddd' },
  searchInput: { flex: 1, height: 45, fontSize: 15 },
  listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
  logoutButton: { backgroundColor: '#e74c3c', margin: 15, padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Style Popup Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textAlign: 'center' },
  modalLabel: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 15, fontSize: 15 },
  modalActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 5 },
  modalBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, minWidth: 80, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: '#ecf0f1' },
  modalBtnSave: { backgroundColor: '#3498db' },
  modalBtnTextCancel: { color: '#7f8c8d', fontWeight: 'bold' },
  modalBtnTextSave: { color: '#fff', fontWeight: 'bold' },
});