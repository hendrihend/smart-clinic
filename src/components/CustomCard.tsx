import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1. Tipe data ini wajib di-export agar garis merah hilang di dashboard
export interface PatientData {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

// 2. Definisi Props (Mirip parameter di Constructor Flutter)
interface CustomCardProps {
  item: PatientData;
  onUbahJadwal?: () => void;      
  onTandaiSelesai?: () => void;  
}

// 3. Komponen Utama CustomCard
export default function CustomCard({ item, onUbahJadwal, onTandaiSelesai }: CustomCardProps) {
  return (
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

      {/* Tombol Aksi */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.btnEdit]} onPress={onUbahJadwal}>
          <Text style={styles.btnTextEdit}>Ubah Jadwal</Text>
        </TouchableOpacity>
        
        {item.status === 'Menunggu' && onTandaiSelesai && (
          <TouchableOpacity style={[styles.actionButton, styles.btnSelesai]} onPress={onTandaiSelesai}>
            <Text style={styles.btnTextSelesai}>Tandai Selesai</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// 4. Stylesheet khusus untuk komponen ini saja
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  statusBadge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, overflow: 'hidden' },
  statusMenunggu: { backgroundColor: '#fff3cd', color: '#856404' },
  statusSelesai: { backgroundColor: '#d4edda', color: '#155724' },
  cardBody: { marginBottom: 15 },
  detailText: { fontSize: 14, color: '#34495e', marginBottom: 5 },
  actionContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  actionButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1 },
  btnEdit: { borderColor: '#bdc3c7', backgroundColor: '#ecf0f1' },
  btnTextEdit: { color: '#7f8c8d', fontSize: 13, fontWeight: 'bold' },
  btnSelesai: { borderColor: '#2ecc71', backgroundColor: '#2ecc71', marginLeft: 10 },
  btnTextSelesai: { color: '#fff', fontSize: 13, fontWeight: 'bold' }
});