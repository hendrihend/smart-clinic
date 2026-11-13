import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Import store yang baru saja dibuat
import { HistoryItem, useBookingStore } from '../../store/useBookingStore';


export default function HistoryScreen() {
  // 2. Panggil state global dan aksinya dari Zustand
  const { historyData, setHistoryData } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimasi: Hanya fetch ke API jika data masih kosong
    if (historyData.length === 0) {
      fetchHistory();
    } else {
      setIsLoading(false); // Langsung tampilkan data dari memori
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://192.168.0.102:8081/api/history');
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setHistoryData(data.data); // Simpan ke Global State Zustand
      }
    } catch (error) {
      Alert.alert('Koneksi Error', 'Tidak dapat terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Menunggu': return { bg: '#fff3cd', text: '#856404' };
      case 'Selesai': return { bg: '#d4edda', text: '#155724' };
      case 'Dibatalkan': return { bg: '#f8d7da', text: '#721c24' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };

  // Tampilkan indikator loading saat data masih di-fetch
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: '#7f8c8d' }}>Memuat riwayat kunjungan...</Text>
      </View>
    );
  }

  // 3. Tambahkan tipe { item: HistoryItem } agar tidak garis merah
  const renderItem = ({ item }: { item: HistoryItem }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>📅 {item.date}</Text>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.specialist}>{item.specialist}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏰</Text>
            <Text style={styles.timeText}>Jam Praktik: {item.time}</Text>
          </View>
        </View>

        {item.status === 'Selesai' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Lihat Resep / Catatan</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada riwayat kunjungan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f2f6', paddingBottom: 10 },
  dateText: { fontSize: 14, color: '#7f8c8d', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  cardBody: { marginBottom: 10 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  specialist: { fontSize: 14, color: '#34495e', marginBottom: 10 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9f9', padding: 10, borderRadius: 8 },
  timeIcon: { marginRight: 8, fontSize: 16 },
  timeText: { fontSize: 14, color: '#2c3e50', fontWeight: '500' },
  actionButton: { marginTop: 10, borderWidth: 1, borderColor: '#3498db', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#3498db', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#7f8c8d' }
});